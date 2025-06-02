"use client"

import { usePathname, useRouter } from "next/navigation"
import { Award, Shield, Users } from "lucide-react"
import Image from "next/image"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()

  // Don't show header on test pages
  if (pathname?.startsWith("/test/")) {
    return null
  }

  // Handle logo/title click - logout and redirect to home
  const handleLogoClick = () => {
    // Clear user session
    localStorage.removeItem("user")
    // Redirect to home page
    router.push("/")
  }

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4 cursor-pointer group" onClick={handleLogoClick}>
              {/* Custom Logo - Transparent */}
              <div className="group-hover:scale-105 transition-transform">
                <Image
                  src="/images/logo.png"
                  alt="CodePro Technology Logo"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                  priority
                />
              </div>

              {/* Company Name */}
              <div className="group-hover:opacity-90 transition-opacity">
                <h1 className="text-2xl font-bold text-white">CodePro Technology Private Limited</h1>
                <p className="text-blue-200 text-sm font-medium">Online Assessment Portal</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-2 text-blue-200">
              <Award className="h-5 w-5" />
              <span className="text-sm font-medium">Professional Testing</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-200">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Secure Platform</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-200">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Trusted by Professionals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400"></div>
    </header>
  )
}
