import { type NextRequest, NextResponse } from "next/server"

// Simple in-memory storage for test sections
let testSections: any[] = [
  {
    id: "html",
    name: "HTML",
    description: "HyperText Markup Language Assessment",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "css",
    name: "CSS",
    description: "Cascading Style Sheets Assessment",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "javascript",
    name: "JavaScript",
    description: "JavaScript Programming Assessment",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  return NextResponse.json({ sections: testSections })
}

export async function POST(request: NextRequest) {
  try {
    const sectionData = await request.json()

    const newSection = {
      id: sectionData.name.toLowerCase().replace(/\s+/g, "-"),
      ...sectionData,
      isActive: true,
      createdAt: new Date().toISOString(),
    }

    testSections.push(newSection)

    return NextResponse.json(
      {
        message: "Test section created successfully",
        section: newSection,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Failed to create test section" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json()

    const sectionIndex = testSections.findIndex((section) => section.id === id)
    if (sectionIndex === -1) {
      return NextResponse.json({ error: "Test section not found" }, { status: 404 })
    }

    testSections[sectionIndex] = { ...testSections[sectionIndex], ...updateData }

    return NextResponse.json({
      message: "Test section updated successfully",
      section: testSections[sectionIndex],
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update test section" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Section ID is required" }, { status: 400 })
    }

    testSections = testSections.filter((section) => section.id !== id)

    return NextResponse.json({ message: "Test section deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete test section" }, { status: 500 })
  }
}

export { testSections }
