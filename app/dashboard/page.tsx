"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogOut, Code, Palette, Zap, Clock, CheckCircle, Shield } from "lucide-react"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

interface TestResult {
  id: string
  userId: string
  userName: string
  assessmentType: string
  score: number
  totalQuestions: number
  completedAt: string
  timeSpent: number
}

interface Assessment {
  id: string
  title: string
  description: string
  icon: any
  color: string
  duration: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([
    {
      id: "html",
      title: "HTML Assessment",
      description: "Test your HTML knowledge with 50 comprehensive questions",
      icon: Code,
      color: "bg-orange-500",
      duration: "50 minutes",
    },
    {
      id: "css",
      title: "CSS Assessment",
      description: "Evaluate your CSS skills and styling techniques",
      icon: Palette,
      color: "bg-blue-500",
      duration: "50 minutes",
    },
    {
      id: "javascript",
      title: "JavaScript Assessment",
      description: "Challenge your JavaScript programming abilities",
      icon: Zap,
      color: "bg-yellow-500",
      duration: "50 minutes",
    },
  ])
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Fetch test results and sections
    fetchTestResults(parsedUser.id)
    fetchSections()
  }, [router])

  const fetchSections = async () => {
    try {
      const response = await fetch("/api/admin/test-sections")
      if (response.ok) {
        const data = await response.json()
        // Update assessments with dynamic sections
        const dynamicAssessments = data.sections.map((section: any) => ({
          id: section.id,
          title: `${section.name} Assessment`,
          description: section.description,
          icon: getIconForSection(section.name),
          color: getColorForSection(section.name),
          duration: "50 minutes",
        }))
        setAssessments(dynamicAssessments)
      }
    } catch (error) {
      console.error("Error fetching sections:", error)
    }
  }

  const getIconForSection = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes("html")) return Code
    if (lowerName.includes("css")) return Palette
    if (lowerName.includes("javascript") || lowerName.includes("js")) return Zap
    return Code // default icon
  }

  const getColorForSection = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes("html")) return "bg-orange-500"
    if (lowerName.includes("css")) return "bg-blue-500"
    if (lowerName.includes("javascript") || lowerName.includes("js")) return "bg-yellow-500"
    return "bg-gray-500" // default color
  }

  const fetchTestResults = async (userId: string) => {
    try {
      const response = await fetch(`/api/test-results?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setTestResults(data.results)
      }
    } catch (error) {
      console.error("Error fetching test results:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const startAssessment = (assessmentId: string) => {
    router.push(`/test/${assessmentId}`)
  }

  const getLatestTestResult = (assessmentType: string) => {
    const results = testResults.filter((result) => result.assessmentType === assessmentType)
    if (results.length === 0) return null

    // Sort by completedAt date and get the latest
    return results.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0]
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {user.firstName} {user.lastName}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {user.role === "admin" && (
                <Button onClick={() => router.push("/admin")} variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              )}
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((assessment) => {
            const latestResult = getLatestTestResult(assessment.id)
            const Icon = assessment.icon

            return (
              <Card key={assessment.id} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${assessment.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    {latestResult && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{assessment.title}</CardTitle>
                  <CardDescription>{assessment.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {assessment.duration} • 50 Questions
                    </div>

                    {latestResult ? (
                      <div className="space-y-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm font-medium text-gray-900 mb-1">Latest Score</div>
                          <div className="text-lg font-bold text-blue-600">
                            {latestResult.score}/{latestResult.totalQuestions} (
                            {Math.round((latestResult.score / latestResult.totalQuestions) * 100)}%)
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          <div>
                            <span className="font-medium">Time:</span> {formatTime(latestResult.timeSpent)}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span>{" "}
                            {new Date(latestResult.completedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <Button onClick={() => startAssessment(assessment.id)} variant="outline" className="w-full">
                          Retake Assessment
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={() => startAssessment(assessment.id)} className="w-full">
                        Start Assessment
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
