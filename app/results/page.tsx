"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Home, RotateCcw } from "lucide-react"

export default function ResultsPage() {
  const [user, setUser] = useState(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const assessmentType = searchParams.get("type") || ""
  const score = Number.parseInt(searchParams.get("score") || "0")
  const total = Number.parseInt(searchParams.get("total") || "0")
  const percentage = Math.round((score / total) * 100)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: "A+", color: "bg-green-600" }
    if (percentage >= 80) return { grade: "A", color: "bg-green-500" }
    if (percentage >= 70) return { grade: "B", color: "bg-blue-500" }
    if (percentage >= 60) return { grade: "C", color: "bg-yellow-500" }
    if (percentage >= 50) return { grade: "D", color: "bg-orange-500" }
    return { grade: "F", color: "bg-red-500" }
  }

  const gradeInfo = getGrade(percentage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {percentage >= 60 ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-3xl font-bold">{assessmentType.toUpperCase()} Assessment Results</CardTitle>
          <CardDescription>
            {percentage >= 60
              ? "Congratulations! You passed the assessment."
              : "You need to improve your score to pass."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-4 mb-4">
              <div className="text-6xl font-bold text-gray-900">
                {score}/{total}
              </div>
              <div className={`px-4 py-2 rounded-lg text-white text-2xl font-bold ${gradeInfo.color}`}>
                {gradeInfo.grade}
              </div>
            </div>
            <div className="text-2xl font-semibold text-gray-700">{percentage}% Score</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{total - score}</div>
              <div className="text-sm text-gray-600">Incorrect Answers</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Performance Analysis:</h3>
            <div className="space-y-2">
              {percentage >= 90 && <Badge className="bg-green-100 text-green-800">Excellent Performance</Badge>}
              {percentage >= 70 && percentage < 90 && (
                <Badge className="bg-blue-100 text-blue-800">Good Performance</Badge>
              )}
              {percentage >= 60 && percentage < 70 && (
                <Badge className="bg-yellow-100 text-yellow-800">Average Performance</Badge>
              )}
              {percentage < 60 && <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>}
            </div>

            <div className="text-sm text-gray-600">
              {percentage >= 60
                ? "Great job! You've demonstrated a solid understanding of the subject matter."
                : "Don't worry! Use this as a learning opportunity and try again when you're ready."}
            </div>
          </div>

          <div className="flex space-x-4 pt-6">
            <Button onClick={() => router.push("/dashboard")} className="flex-1">
              <Home className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button onClick={() => router.push(`/assessment/${assessmentType}`)} variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Test
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
