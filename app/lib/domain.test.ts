import { describe, it, expect } from "vitest";
import { normalizeLabel } from "./domain";

describe("normalizeLabel", () => {
  it("removes invalid characters and spaces", () => {
    expect(normalizeLabel("bad name")).toBe("badname");
    expect(normalizeLabel("bad$name")).toBe("badname");});

  it("lowercases and trims", () => {
    expect(normalizeLabel("  My-Domain  ")).toBe("my-domain");
  });

  it("accepts letters/numbers/hyphens", () => {
    expect(normalizeLabel("abc-123")).toBe("abc-123");
  });
});