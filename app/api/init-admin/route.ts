import { NextResponse } from "next/server"
import { ensureUsersFile, getUsers } from "@/lib/users"

export async function GET() {
  try {
    // Initialize users file with admin user
    ensureUsersFile()

    // Get all users (without passwords)
    const users = getUsers()
    const safeUsers = users.map(({ password, ...user }) => user)

    return NextResponse.json({
      message: "Admin user initialized successfully",
      users: safeUsers,
    })
  } catch (error) {
    console.error("Error initializing admin user:", error)
    return NextResponse.json({ error: "Failed to initialize admin user" }, { status: 500 })
  }
}
