import { type NextRequest, NextResponse } from "next/server"
import { findUserByEmail, addUser, ensureUsersFile } from "@/lib/users"

export async function POST(request: NextRequest) {
  try {
    // Ensure users file exists
    ensureUsersFile()

    const userData = await request.json()

    console.log("=== REGISTRATION ATTEMPT ===")
    console.log("Email:", userData.email)

    // Check if user already exists
    const existingUser = findUserByEmail(userData.email)
    if (existingUser) {
      console.log("❌ User already exists")
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Create new user
    const newUser = addUser(userData)
    console.log("✅ User registered successfully:", newUser.email)

    // Remove password from response
    const { password, ...userWithoutPassword } = newUser

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: userWithoutPassword,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
