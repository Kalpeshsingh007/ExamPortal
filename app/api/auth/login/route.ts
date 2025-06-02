import { type NextRequest, NextResponse } from "next/server"
import { validateUser, ensureUsersFile } from "@/lib/users"

export async function POST(request: NextRequest) {
  try {
    // Ensure users file exists
    ensureUsersFile()

    const { email, password } = await request.json()

    console.log("=== LOGIN ATTEMPT ===")
    console.log("Email:", email)
    console.log("Password:", password)

    // Find and validate user
    const user = validateUser(email, password)

    if (!user) {
      console.log("❌ Login failed - invalid credentials")
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    console.log("✅ Login successful for:", email, "Role:", user.role)

    return NextResponse.json({
      message: "Login successful",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
