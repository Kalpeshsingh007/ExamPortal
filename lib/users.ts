import fs from "fs"
import path from "path"

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
  contactNo: string
  jobDesignation: string
  dateOfJoined: string
  createdAt: string
}

const DATA_FILE = path.join(process.cwd(), "users.json")

export function ensureUsersFile(): void {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initialUsers: User[] = [
        {
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
        },
      ]
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialUsers, null, 2))
      console.log("Created users file with admin user")
    }
  } catch (error) {
    console.error("Error ensuring users file:", error)
  }
}

export function getUsers(): User[] {
  try {
    ensureUsersFile()
    const data = fs.readFileSync(DATA_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading users:", error)
    return []
  }
}

export function saveUsers(users: User[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error("Error saving users:", error)
  }
}

export function findUserByEmail(email: string): User | undefined {
  const users = getUsers()
  return users.find((user) => user.email === email)
}

export function validateUser(email: string, password: string): User | null {
  const users = getUsers()
  console.log("Validating user:", email)
  console.log(
    "Available users:",
    users.map((u) => ({ email: u.email, role: u.role })),
  )

  const user = users.find((user) => user.email === email && user.password === password)
  console.log("User found:", user ? "YES" : "NO")

  return user || null
}

export function addUser(userData: Omit<User, "id" | "role" | "createdAt">): User {
  const users = getUsers()

  const newUser: User = {
    id: `user-${Date.now()}`,
    ...userData,
    role: "user",
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)
  console.log("User added:", newUser.email)

  return newUser
}

// Initialize on module load
ensureUsersFile()
