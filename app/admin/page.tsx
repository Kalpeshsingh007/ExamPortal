"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Users, FileText, BarChart3, UserPlus, Shield } from "lucide-react"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  jobDesignation: string
  dateOfJoined: string
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

interface AdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

export default function AdminPage() {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)

    // Check if user is admin
    if (parsedUser.role !== "admin") {
      router.push("/dashboard")
      return
    }

    setAdmin(parsedUser)
    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      const [usersResponse, resultsResponse] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/test-results"),
      ])

      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        // Filter out admin users from the display
        const regularUsers = usersData.users.filter((user: User) => user.role !== "admin")
        setUsers(regularUsers)
      }

      if (resultsResponse.ok) {
        const resultsData = await resultsResponse.json()
        setTestResults(resultsData.results)
      }
    } catch (error) {
      console.error("Error fetching admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const getStats = () => {
    const totalUsers = users.length
    const totalTests = testResults.length
    const avgScore =
      testResults.length > 0
        ? Math.round(
            testResults.reduce((sum, result) => sum + (result.score / result.totalQuestions) * 100, 0) /
              testResults.length,
          )
        : 0

    return { totalUsers, totalTests, avgScore }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-gray-600">
                    Welcome, {admin?.firstName} {admin?.lastName}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => router.push("/dashboard")} variant="outline">
                User Dashboard
              </Button>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTests}</div>
              <p className="text-xs text-muted-foreground">Total assessments taken</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgScore}%</div>
              <p className="text-xs text-muted-foreground">Across all tests</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your assessment platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button onClick={() => router.push("/admin/manage-tests")} className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Tests & Questions
                </Button>
                <Button onClick={() => router.push("/register")} variant="outline" className="flex items-center">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Registered Users</TabsTrigger>
            <TabsTrigger value="results">Test Results</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
                <CardDescription>All users who have registered on the platform (excluding admins)</CardDescription>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="text-center py-8">
                    <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users registered yet</h3>
                    <p className="text-gray-500 mb-4">Users will appear here after they register</p>
                    <Button onClick={() => router.push("/register")}>Add First User</Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Job Designation</TableHead>
                        <TableHead>Date Joined</TableHead>
                        <TableHead>Tests Taken</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => {
                        const userTests = testResults.filter((result) => result.userId === user.id)
                        return (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              {user.firstName} {user.lastName}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.jobDesignation}</TableCell>
                            <TableCell>{new Date(user.dateOfJoined).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{userTests.length}</Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
                <CardDescription>All completed test submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {testResults.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No test results yet</h3>
                    <p className="text-gray-500">Test results will appear here after users complete assessments</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Assessment</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead>Time Spent</TableHead>
                        <TableHead>Completed At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testResults.map((result) => {
                        const percentage = Math.round((result.score / result.totalQuestions) * 100)
                        return (
                          <TableRow key={result.id}>
                            <TableCell className="font-medium">{result.userName}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{result.assessmentType.toUpperCase()}</Badge>
                            </TableCell>
                            <TableCell>
                              {result.score}/{result.totalQuestions}
                            </TableCell>
                            <TableCell>
                              <Badge variant={percentage >= 60 ? "default" : "destructive"}>{percentage}%</Badge>
                            </TableCell>
                            <TableCell>{formatTime(result.timeSpent)}</TableCell>
                            <TableCell>{new Date(result.completedAt).toLocaleString()}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
