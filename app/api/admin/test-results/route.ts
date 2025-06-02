import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const RESULTS_FILE = path.join(process.cwd(), "test-results.json")

function getTestResults() {
  try {
    if (!fs.existsSync(RESULTS_FILE)) {
      return []
    }
    const data = fs.readFileSync(RESULTS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading test results:", error)
    return []
  }
}

export async function GET() {
  const results = getTestResults()
  return NextResponse.json({ results })
}
