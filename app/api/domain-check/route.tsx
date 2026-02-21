import { NextResponse } from "next/server";
import { buildDomain, normalizeLabel } from "@/app/lib/domain";
import { resolveNs } from "node:dns/promises";

export const runtime = "nodejs";

const DEFAULT_TLDS = ["com", "io", "ai", "dev"];

// ---- basic in-memory rate limit (ok for low traffic) ----
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function getClientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  if (!fwd) return "unknown";
  return fwd.split(",")[0]?.trim() || "unknown";
}

function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const b = buckets.get(key);

  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (b.count >= limit) {
    return { ok: false, remaining: 0, resetAt: b.resetAt };
  }

  b.count += 1;
  return { ok: true, remaining: limit - b.count, resetAt: b.resetAt };
}
// ---------------------------------------------------------

async function hasNsRecords(domain: string, timeoutMs = 1500) {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("TIMEOUT")), timeoutMs)
  );

  try {
    const nsRecords = await Promise.race([resolveNs(domain), timeout]);

    if (Array.isArray(nsRecords) && nsRecords.length > 0) {
      return { registered: true as const, detail: "ns_found" as const, nsRecords };
    }

    // unusual, but handle
    return { registered: false as const, detail: "no_ns" as const, nsRecords: [] as string[] };
  } catch (e: any) {
    const code = e?.code || e?.message;

    if (code === "ENOTFOUND" || String(code).includes("ENOTFOUND")) {
      return { registered: false as const, detail: "nxdomain" as const, nsRecords: [] as string[] };
    }

    // ambiguous failures
    return { registered: null, detail: String(code) as string, nsRecords: [] as string[] };
  }
}

export async function POST(req: Request) {
  // Rate limit: 30 requests per 10 minutes per IP
  const ip = getClientIp(req);
  const rl = rateLimit(`domain-check:${ip}`, 30, 10 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  const body = await req.json().catch(() => ({}));
  const rawName = String(body?.name ?? "");
  const tlds: string[] = Array.isArray(body?.tlds) ? body.tlds : DEFAULT_TLDS;

  const label = normalizeLabel(rawName);
  if (!label) {
    return NextResponse.json(
      { error: "Invalid name. Use letters/numbers/hyphens only." },
      { status: 400 }
    );
  }

  const results = await Promise.all(
    tlds.map(async (tld) => {
      const domain = buildDomain(label, tld);
      const { registered, detail, nsRecords } = await hasNsRecords(domain);

      // -------- AVAILABILITY LOGIC (THIS IS WHAT YOU ASKED FOR) --------
      // registered === true  => taken
      // registered === false => likely available
      // registered === null  => unknown (timeout/servfail/etc.)
      if (registered === true) {
        return {
          domain,
          tld,
          available: false,
          confidence: "high" as const,
          method: "dns_ns" as const,
          detail,
          nsRecords,
        };
      }

      if (registered === false) {
        return {
          domain,
          tld,
          available: true,
          confidence: "medium" as const,
          method: "dns_ns" as const,
          detail,
          nsRecords: [],
        };
      }

      return {
        domain,
        tld,
        available: null,
        confidence: "low" as const,
        method: "dns_ns" as const,
        detail,
        nsRecords: [],
      };
      // ----------------------------------------------------------------
    })
  );

  return NextResponse.json({
    label,
    rateLimit: { remaining: rl.remaining },
    results,
    disclaimer:
      "DNS NS-based check is not 100% authoritative. Some edge cases may appear available during propagation or unusual DNS states.",
  });
}