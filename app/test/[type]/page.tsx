"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, ChevronLeft, ChevronRight, Flag } from "lucide-react"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

export default function TestPage() {
  const [user, setUser] = useState<User | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [timeLeft, setTimeLeft] = useState(50 * 60) // 50 minutes in seconds
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const params = useParams()
  const assessmentType = params.type as string

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))
    fetchQuestions()
  }, [router, assessmentType])

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !submitting) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleSubmit()
    }
  }, [timeLeft, submitting])

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/questions?type=${assessmentType}`)
      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions)
      }
    } catch (error) {
      console.error("Error fetching questions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion]: Number.parseInt(value),
    })
  }

  const handleSubmit = async () => {
    if (submitting) return

    setSubmitting(true)

    try {
      const score = calculateScore()
      const response = await fetch("/api/submit-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          userName: `${user?.firstName} ${user?.lastName}`,
          assessmentType,
          answers,
          score,
          totalQuestions: questions.length,
          timeSpent: 50 * 60 - timeLeft,
        }),
      })

      if (response.ok) {
        router.push(`/results?type=${assessmentType}&score=${score}&total=${questions.length}`)
      }
    } catch (error) {
      console.error("Error submitting test:", error)
    }
  }

  const calculateScore = () => {
    let score = 0
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++
      }
    })
    return score
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getQuestionStatus = (index: number) => {
    if (answers[index] !== undefined) return "answered"
    if (index === currentQuestion) return "current"
    return "unanswered"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading test...</p>
        </div>
      </div>
    )
  }

  if (questions.length === 0 && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No questions available</h1>
          <p className="mb-4">No questions found for {assessmentType} assessment.</p>
          <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with timer */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">{assessmentType.toUpperCase()} Assessment</h1>
              <Badge variant="outline">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center px-3 py-2 rounded-lg ${
                  timeLeft < 300 ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                }`}
              >
                <Clock className="h-4 w-4 mr-2" />
                {formatTime(timeLeft)}
              </div>
              <Button onClick={handleSubmit} variant="outline">
                <Flag className="h-4 w-4 mr-2" />
                Submit Test
              </Button>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Question Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, index) => {
                    const status = getQuestionStatus(index)
                    return (
                      <Button
                        key={index}
                        variant={status === "current" ? "default" : "outline"}
                        size="sm"
                        className={`h-10 w-10 p-0 ${
                          status === "answered"
                            ? "bg-green-100 border-green-300 text-green-800"
                            : status === "current"
                              ? ""
                              : "hover:bg-gray-100"
                        }`}
                        onClick={() => setCurrentQuestion(index)}
                      >
                        {index + 1}
                      </Button>
                    )
                  })}
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
                    Answered ({Object.keys(answers).length})
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                    Current
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 border border-gray-300 rounded mr-2"></div>
                    Not Answered ({questions.length - Object.keys(answers).length})
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Question {currentQuestion + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-lg leading-relaxed">{questions[currentQuestion]?.question}</div>

                <RadioGroup
                  value={answers[currentQuestion]?.toString() || ""}
                  onValueChange={handleAnswerChange}
                  className="space-y-4"
                >
                  {questions[currentQuestion]?.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {currentQuestion === questions.length - 1 ? (
                    <Button onClick={handleSubmit} disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit Test"}
                    </Button>
                  ) : (
                    <Button onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
