import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Define question type
interface Question {
  id: string
  sectionId: string
  question: string
  options: string[]
  correctAnswer: number
  createdAt: string
}

// Path to the questions data file
const QUESTIONS_FILE = path.join(process.cwd(), "admin-questions.json")

// Get questions from file system
function getAdminQuestions() {
  try {
    if (!fs.existsSync(QUESTIONS_FILE)) {
      return []
    }
    const data = fs.readFileSync(QUESTIONS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading questions:", error)
    return []
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")

  if (!type) {
    return NextResponse.json({ error: "Assessment type is required" }, { status: 400 })
  }

  // Get questions for the specific section
  const allQuestions = getAdminQuestions()
  const sectionQuestions = allQuestions.filter((q: Question) => q.sectionId === type)

  if (sectionQuestions.length === 0) {
    return NextResponse.json({ error: "No questions found for this assessment" }, { status: 404 })
  }

  // Generate 50 questions by repeating if necessary
  const extendedQuestions = []
  for (let i = 0; i < 50; i++) {
    const questionIndex = i % sectionQuestions.length
    const question = { ...sectionQuestions[questionIndex] }
    question.id = `${type}-${i + 1}`
    extendedQuestions.push(question)
  }

  return NextResponse.json({ questions: extendedQuestions })
}
