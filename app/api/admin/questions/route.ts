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

// Initialize with some default questions
const defaultQuestions: Question[] = [
  // HTML Questions
  {
    id: "html-1",
    sectionId: "html",
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlink and Text Markup Language",
    ],
    correctAnswer: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "html-2",
    sectionId: "html",
    question: "Which HTML element is used for the largest heading?",
    options: ["<h6>", "<h1>", "<heading>", "<header>"],
    correctAnswer: 1,
    createdAt: new Date().toISOString(),
  },
  // CSS Questions
  {
    id: "css-1",
    sectionId: "css",
    question: "What does CSS stand for?",
    options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
    correctAnswer: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: "css-2",
    sectionId: "css",
    question: "Which property is used to change the background color?",
    options: ["color", "bgcolor", "background-color", "background"],
    correctAnswer: 2,
    createdAt: new Date().toISOString(),
  },
  // JavaScript Questions
  {
    id: "js-1",
    sectionId: "javascript",
    question: "Which method is used to write content to the HTML document?",
    options: ["document.write()", "document.output()", "document.print()", "document.display()"],
    correctAnswer: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: "js-2",
    sectionId: "javascript",
    question: "How do you declare a variable in JavaScript?",
    options: ["var myVar", "variable myVar", "v myVar", "declare myVar"],
    correctAnswer: 0,
    createdAt: new Date().toISOString(),
  },
]

// Initialize questions file if it doesn't exist
function initQuestionsFile() {
  if (!fs.existsSync(QUESTIONS_FILE)) {
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(defaultQuestions, null, 2))
  }
}

// Get all questions
function getAllQuestions(): Question[] {
  try {
    initQuestionsFile()
    const data = fs.readFileSync(QUESTIONS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading questions:", error)
    return defaultQuestions
  }
}

// Save questions
function saveQuestions(questions: Question[]) {
  try {
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(questions, null, 2))
  } catch (error) {
    console.error("Error saving questions:", error)
  }
}

// Export questions for other routes to use
export const allQuestions = getAllQuestions()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sectionId = searchParams.get("sectionId")

  const questions = getAllQuestions()

  if (sectionId) {
    const filteredQuestions = questions.filter((q: Question) => q.sectionId === sectionId)
    return NextResponse.json({ questions: filteredQuestions })
  }

  return NextResponse.json({ questions })
}

export async function POST(request: NextRequest) {
  try {
    const questionData = await request.json()
    const questions = getAllQuestions()

    const newQuestion: Question = {
      id: `${questionData.sectionId}-${Date.now()}`,
      ...questionData,
      createdAt: new Date().toISOString(),
    }

    questions.push(newQuestion)
    saveQuestions(questions)

    return NextResponse.json(
      {
        message: "Question created successfully",
        question: newQuestion,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating question:", error)
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json()
    const questions = getAllQuestions()

    const questionIndex = questions.findIndex((q: Question) => q.id === id)
    if (questionIndex === -1) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    questions[questionIndex] = { ...questions[questionIndex], ...updateData }
    saveQuestions(questions)

    return NextResponse.json({
      message: "Question updated successfully",
      question: questions[questionIndex],
    })
  } catch (error) {
    console.error("Error updating question:", error)
    return NextResponse.json({ error: "Failed to update question" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Question ID is required" }, { status: 400 })
    }

    const questions = getAllQuestions()
    const updatedQuestions = questions.filter((q: Question) => q.id !== id)
    saveQuestions(updatedQuestions)

    return NextResponse.json({ message: "Question deleted successfully" })
  } catch (error) {
    console.error("Error deleting question:", error)
    return NextResponse.json({ error: "Failed to delete question" }, { status: 500 })
  }
}
