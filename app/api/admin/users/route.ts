import { NextResponse } from "next/server"
import { getUsers } from "@/lib/users"

export async function GET() {
  try {
    const users = getUsers()

    // Remove passwords
    const safeUsers = users.map(({ password, ...user }) => user)

    return NextResponse.json({ users: safeUsers })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
