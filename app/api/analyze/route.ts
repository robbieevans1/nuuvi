import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { name } = await req.json()

  // Temporary fake result
  return NextResponse.json({
    name,
    pronunciation: "Example pronunciation",
    vibe: "Modern, tech-focused",
    memorability_score: 7,
    spelling_risk: "Low",
    suggestions: [
      name + "io",
      name + "ai",
      "get" + name
    ]
  })
}