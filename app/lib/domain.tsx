export function normalizeLabel(raw: string) {
  // keep letters, numbers, hyphens; lower-case
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  // domain labels must be 1–63 chars
  if (!cleaned || cleaned.length > 63) return null;

  return cleaned;
}

export function buildDomain(label: string, tld: string) {
  return `${label}.${tld.toLowerCase().replace(/^\./, "")}`;
}