import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const RESULTS_FILE = path.join(process.cwd(), "test-results.json")

// Initialize results file if it doesn't exist
function initResultsFile() {
  if (!fs.existsSync(RESULTS_FILE)) {
    fs.writeFileSync(RESULTS_FILE, JSON.stringify([], null, 2))
  }
}

function getTestResults() {
  try {
    initResultsFile()
    const data = fs.readFileSync(RESULTS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading test results:", error)
    return []
  }
}

function saveTestResults(results: any[]) {
  try {
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2))
  } catch (error) {
    console.error("Error saving test results:", error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const testData = await request.json()
    const results = getTestResults()

    const result = {
      id: Date.now().toString(),
      userId: testData.userId,
      userName: testData.userName || "Unknown User",
      assessmentType: testData.assessmentType,
      score: testData.score,
      totalQuestions: testData.totalQuestions,
      answers: testData.answers,
      timeSpent: testData.timeSpent,
      completedAt: new Date().toISOString(),
    }

    results.push(result)
    saveTestResults(results)

    return NextResponse.json({
      message: "Test submitted successfully",
      result,
    })
  } catch (error) {
    console.error("Error submitting test:", error)
    return NextResponse.json({ error: "Failed to submit test" }, { status: 500 })
  }
}
