import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "users.json")

export async function GET() {
  try {
    // Force create the admin user
    const adminUser = {
      id: "admin-1",
      firstName: "Kalpesh",
      lastName: "Admin",
      email: "kalpesh@admin.com",
      password: "Kadmin007",
      role: "admin",
      contactNo: "1234567890",
      jobDesignation: "System Administrator",
      dateOfJoined: "2024-01-01",
      createdAt: new Date().toISOString(),
    }

    let users = []

    // Read existing users or create new array
    if (fs.existsSync(DATA_FILE)) {
      try {
        const data = fs.readFileSync(DATA_FILE, "utf8")
        users = JSON.parse(data)
      } catch (error) {
        console.log("Creating new users file")
        users = []
      }
    }

    // Check if admin already exists
    const adminExists = users.find((user: any) => user.email === "kalpesh@admin.com")

    if (!adminExists) {
      users.push(adminUser)
      fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2))
      console.log("Admin user created successfully")
    }

    return NextResponse.json({
      message: "Admin user initialized",
      adminEmail: "kalpesh@admin.com",
      adminPassword: "Kadmin007",
    })
  } catch (error) {
    console.error("Error initializing admin:", error)
    return NextResponse.json({ error: "Failed to initialize admin" }, { status: 500 })
  }
}
