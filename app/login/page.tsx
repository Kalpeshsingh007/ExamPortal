"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Eye, EyeOff, Info } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize admin user first
    fetch("/api/auth/init")
      .then((response) => response.json())
      .then((data) => {
        console.log("Admin initialized:", data)
      })
      .catch((error) => {
        console.error("Error initializing admin:", error)
      })

    // Get message from URL if any
    const messageParam = searchParams.get("message")
    if (messageParam) {
      setMessage(messageParam)
    }

    // Auto-fill email from registration if available
    const lastEmail = sessionStorage.getItem("lastRegisteredEmail")
    if (lastEmail) {
      setEmail(lastEmail)
      const lastPassword = sessionStorage.getItem("lastRegisteredPassword")
      if (lastPassword) {
        setPassword(lastPassword)
      }
      sessionStorage.removeItem("lastRegisteredEmail")
      sessionStorage.removeItem("lastRegisteredPassword")
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    console.log("=== LOGIN FORM SUBMIT ===")
    console.log("Email:", email)
    console.log("Password:", password)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      console.log("Login response status:", response.status)
      const data = await response.json()
      console.log("Login response data:", data)

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user))
        console.log("User stored in localStorage:", data.user)

        // Redirect based on role
        if (data.user.role === "admin") {
          console.log("Redirecting to admin dashboard")
          router.push("/admin")
        } else {
          console.log("Redirecting to user dashboard")
          router.push("/dashboard")
        }
      } else {
        console.log("Login failed:", data.error)
        setError(data.error || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  // const fillAdminCredentials = () => {
  //   setEmail("kalpesh@admin.com")
  //   setPassword("Kadmin007")
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Admin Credentials Info
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800">Admin Access:</p>
                <p className="text-blue-700">Email: kalpesh@admin.com</p>
                <p className="text-blue-700">Password: Kadmin007</p>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-blue-600 hover:text-blue-800"
                  onClick={fillAdminCredentials}
                >
                  Click to auto-fill
                </Button>
              </div>
            </div>
          </div> */}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {"Don't have an account? "}
              <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/register")}>
                Register here
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
