"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Code, Palette, Zap } from "lucide-react"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

export default function AssessmentPage() {
  const [user, setUser] = useState<User | null>(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const assessmentType = params.type as string

  console.log("Assessment page - type:", assessmentType)

  const assessmentInfo = {
    html: { title: "HTML Assessment", icon: Code, color: "bg-orange-500" },
    css: { title: "CSS Assessment", icon: Palette, color: "bg-blue-500" },
    javascript: { title: "JavaScript Assessment", icon: Zap, color: "bg-yellow-500" },
  }

  const currentAssessment = assessmentInfo[assessmentType as keyof typeof assessmentInfo]

  useEffect(() => {
    console.log("Assessment useEffect - checking user")
    const userData = localStorage.getItem("user")
    if (!userData) {
      console.log("No user data, redirecting to login")
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    console.log("User found:", parsedUser.email)
    setUser(parsedUser)
    fetchQuestions()
  }, [router, assessmentType])

  const fetchQuestions = async () => {
    try {
      console.log("Fetching questions for:", assessmentType)
      const response = await fetch(`/api/questions?type=${assessmentType}`)
      console.log("Questions response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Questions fetched:", data.questions?.length || 0)
        setQuestions(data.questions)
      } else {
        console.error("Failed to fetch questions:", response.status)
      }
    } catch (error) {
      console.error("Error fetching questions:", error)
    } finally {
      setLoading(false)
    }
  }

  const startTest = () => {
    console.log("Starting test for:", assessmentType)
    router.push(`/test/${assessmentType}`)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!currentAssessment) {
    console.error("Assessment not found for type:", assessmentType)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Assessment not found</h1>
          <p className="mb-4">Assessment type "{assessmentType}" is not available.</p>
          <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    )
  }

  const Icon = currentAssessment.icon

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${currentAssessment.color} text-white mr-3`}>
                <Icon className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{currentAssessment.title}</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Assessment Instructions</CardTitle>
            <CardDescription>Please read the following instructions carefully before starting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <Clock className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <div className="font-semibold">Duration</div>
                  <div className="text-sm text-gray-600">50 minutes</div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <Badge className="h-8 w-8 bg-green-600 mr-3 flex items-center justify-center">50</Badge>
                <div>
                  <div className="font-semibold">Questions</div>
                  <div className="text-sm text-gray-600">Total questions</div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                <div className="h-8 w-8 bg-purple-600 rounded-full mr-3 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <div className="font-semibold">Attempts</div>
                  <div className="text-sm text-gray-600">Single attempt</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Important Instructions:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  You have exactly 50 minutes to complete all 50 questions
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  The test will automatically submit when time expires
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  You can navigate between questions using the navigation panel
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Make sure you have a stable internet connection
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Once submitted, you cannot modify your answers
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="font-semibold text-yellow-800 mb-2">⚠️ Before You Start:</div>
              <p className="text-yellow-700 text-sm">
                Make sure you're in a quiet environment and won't be interrupted. The timer will start immediately when
                you click "Start Assessment".
              </p>
            </div>

            <div className="flex justify-center pt-6">
              <Button onClick={startTest} size="lg" className="px-8 py-3 text-lg">
                Start Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
