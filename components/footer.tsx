"use client"

import { usePathname } from "next/navigation"
import { Mail, Phone, MapPin, Globe, Linkedin, Twitter } from "lucide-react"
import Image from "next/image"

export function Footer() {
  const pathname = usePathname()

  // Don't show footer on test pages
  if (pathname?.startsWith("/test/")) {
    return null
  }

  // Show full footer only on main page
  const isMainPage = pathname === "/"

  if (!isMainPage) {
    // Show only bottom section for all other pages with logo
    return (
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Image
                src="/images/logo.png"
                alt="CodePro Technology Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              <p className="text-gray-400 text-sm">© 2024 CodePro Technology Private Limited. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Powered by</span>
              <span className="text-blue-400 font-semibold text-sm">CodePro Assessment Engine</span>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  // Full footer for main page
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/images/logo.png"
                alt="CodePro Technology Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <div>
                <h3 className="text-xl font-bold">CodePro Technology</h3>
                <p className="text-gray-400 text-sm">Private Limited</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Leading provider of comprehensive online assessment solutions. We help organizations evaluate technical
              skills and competencies through our advanced testing platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="bg-blue-400 hover:bg-blue-500 p-2 rounded-lg transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-600 hover:bg-gray-700 p-2 rounded-lg transition-colors">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300 text-sm">codepro.net@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300 text-sm">+91 8055404016</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-blue-400 mt-1" />
                <span className="text-gray-300 text-sm">
                  Bhagyodaya Nagar, Ambad Road
                  <br />
                  Jalna, Maharashtra 431203
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Quick Links</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-300 hover:text-white text-sm transition-colors">
                About Us
              </a>
              <a href="#" className="block text-gray-300 hover:text-white text-sm transition-colors">
                Our Services
              </a>
              <a href="#" className="block text-gray-300 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="block text-gray-300 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="block text-gray-300 hover:text-white text-sm transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Image
                src="/images/logo.png"
                alt="CodePro Technology Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              <p className="text-gray-400 text-sm">© 2024 CodePro Technology Private Limited. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Powered by</span>
              <span className="text-blue-400 font-semibold text-sm">CodePro Assessment Engine</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
