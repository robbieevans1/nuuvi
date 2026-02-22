import { NextRequest, NextResponse } from "next/server";

type SummaryResponse = {
  summary: string;
  score: number;
  warnings?: string[];
};

export async function Post(request: NextRequest) {
  const { domain, tld, signals } = await request.json();

  if (!domain || !tld) {
    return NextResponse.json(
      { error: "Domain and TLD are required" },
      { status: 400 },
    );
  }

  const prompt = `
You are a domain branding analyst.
Domain: ${domain}.${tld}

Signals:
${JSON.stringify(signals ?? {}, null, 2)}

Return STRICT JSON:
{
  "summary": "2-3 sentences max, concrete and practical",
  "score": 0-100,
  "warnings": ["..."]
}
`.trim();

  const r = await fetch("https://api.openrouter.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "Http-Referer": process.env.OPENROUTER_SITE_URL ?? "",
      "X-Title": process.env.OPENROUTER_APP_NAME ?? "Nuuvi    ",
    },
    body: JSON.stringify({
      model: "openrouter/free",
      messages: [
        { role: "system", content: "Be concise and only output valid JSON." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    }),
  });

  if (!r.ok) {
    const errorText = await r.text();
    return NextResponse.json(
      { error: "OpenRouter API error: " + errorText },
      { status: 502 },
    );
  }

  const data = await r.json();

  const content: string | undefined = data.choices?.[0]?.message?.content;

  if (!content) {
    return NextResponse.json(
      { error: "No content returned from OpenRouter API" },
      { status: 502 },
    );
  }
  let parsed: SummaryResponse;

  try {
    parsed = JSON.parse(content);
  } catch {
    return NextResponse.json(
        {error: "Invalid JSON returned from OpenRouter API: " + content},
        {status: 502}
    )
  }
  return NextResponse.json(parsed);
}
