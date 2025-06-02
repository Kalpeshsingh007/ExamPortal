"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Shield, BarChart3 } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Force initialize admin user
    fetch("/api/auth/init")
      .then((response) => response.json())
      .then((data) => {
        console.log("System initialized:", data)
      })
      .catch((error) => {
        console.error("Error initializing system:", error)
      })
      .finally(() => {
        setInitializing(false)
      })

    // Check if user is already logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
      router.push("/dashboard")
    }
  }, [router])

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing system...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <Image
              src="/images/logo.png"
              alt="CodePro Technology Logo"
              width={100}
              height={100}
              className="w-25 h-25 object-contain"
              priority
            />
          </div>
          <div className="mb-8">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium">
              Professional Assessment Platform
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Evaluate Skills with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {" "}
              Precision
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Our comprehensive online assessment portal helps organizations evaluate technical competencies through
            scientifically designed tests and real-time analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.push("/login")} size="lg" className="px-8 py-3 text-lg">
              Get Started
            </Button>
            <Button onClick={() => router.push("/register")} variant="outline" size="lg" className="px-8 py-3 text-lg">
              Create Account
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built with cutting-edge technology to provide accurate, reliable, and comprehensive assessments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Secure & Reliable</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Enterprise-grade security with encrypted data transmission and secure test environments
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Real-time Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Comprehensive reporting and analytics to track performance and identify skill gaps
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Comprehensive Tests</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Wide range of technical assessments covering HTML, CSS, JavaScript, and more
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Questions per Test</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-200">Uptime Guarantee</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-200">Support Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-200">Secure Platform</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Start Your Assessment?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of professionals who trust our platform for skill evaluation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.push("/register")} size="lg" className="px-8 py-3 text-lg">
              Create Free Account
            </Button>
            <Button onClick={() => router.push("/login")} variant="outline" size="lg" className="px-8 py-3 text-lg">
              Sign In
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
