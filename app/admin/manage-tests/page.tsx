"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Plus, Edit, Trash2, Shield } from "lucide-react"

interface TestSection {
  id: string
  name: string
  description: string
  isActive: boolean
  createdAt: string
}

interface Question {
  id: string
  sectionId: string
  question: string
  options: string[]
  correctAnswer: number
  createdAt: string
}

export default function ManageTestsPage() {
  const [sections, setSections] = useState<TestSection[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedSection, setSelectedSection] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [showSectionDialog, setShowSectionDialog] = useState(false)
  const [showQuestionDialog, setShowQuestionDialog] = useState(false)
  const [showEditSectionDialog, setShowEditSectionDialog] = useState(false)
  const [showEditQuestionDialog, setShowEditQuestionDialog] = useState(false)
  const [editingSection, setEditingSection] = useState<TestSection | null>(null)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const router = useRouter()

  const [sectionForm, setSectionForm] = useState({
    name: "",
    description: "",
  })

  const [questionForm, setQuestionForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "admin") {
      router.push("/dashboard")
      return
    }

    fetchSections()
  }, [router])

  useEffect(() => {
    if (selectedSection) {
      fetchQuestions(selectedSection)
    }
  }, [selectedSection])

  const fetchSections = async () => {
    try {
      const response = await fetch("/api/admin/test-sections")
      if (response.ok) {
        const data = await response.json()
        setSections(data.sections)
        if (data.sections.length > 0) {
          setSelectedSection(data.sections[0].id)
        }
      }
    } catch (error) {
      console.error("Error fetching sections:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchQuestions = async (sectionId: string) => {
    try {
      const response = await fetch(`/api/admin/questions?sectionId=${sectionId}`)
      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions)
      }
    } catch (error) {
      console.error("Error fetching questions:", error)
    }
  }

  const handleCreateSection = async () => {
    try {
      const response = await fetch("/api/admin/test-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sectionForm),
      })

      if (response.ok) {
        fetchSections()
        setShowSectionDialog(false)
        setSectionForm({ name: "", description: "" })
      }
    } catch (error) {
      console.error("Error creating section:", error)
    }
  }

  const handleEditSection = (section: TestSection) => {
    setEditingSection(section)
    setSectionForm({
      name: section.name,
      description: section.description,
    })
    setShowEditSectionDialog(true)
  }

  const handleUpdateSection = async () => {
    if (!editingSection) return

    try {
      const response = await fetch("/api/admin/test-sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingSection.id,
          ...sectionForm,
        }),
      })

      if (response.ok) {
        fetchSections()
        setShowEditSectionDialog(false)
        setEditingSection(null)
        setSectionForm({ name: "", description: "" })
      }
    } catch (error) {
      console.error("Error updating section:", error)
    }
  }

  const handleCreateQuestion = async () => {
    try {
      const response = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...questionForm,
          sectionId: selectedSection,
        }),
      })

      if (response.ok) {
        fetchQuestions(selectedSection)
        setShowQuestionDialog(false)
        setQuestionForm({
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
        })
      }
    } catch (error) {
      console.error("Error creating question:", error)
    }
  }

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question)
    setQuestionForm({
      question: question.question,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
    })
    setShowEditQuestionDialog(true)
  }

  const handleUpdateQuestion = async () => {
    if (!editingQuestion) return

    try {
      const response = await fetch("/api/admin/questions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingQuestion.id,
          ...questionForm,
        }),
      })

      if (response.ok) {
        fetchQuestions(selectedSection)
        setShowEditQuestionDialog(false)
        setEditingQuestion(null)
        setQuestionForm({
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
        })
      }
    } catch (error) {
      console.error("Error updating question:", error)
    }
  }

  const handleDeleteSection = async (sectionId: string) => {
    if (confirm("Are you sure you want to delete this section?")) {
      try {
        const response = await fetch(`/api/admin/test-sections?id=${sectionId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          fetchSections()
        }
      } catch (error) {
        console.error("Error deleting section:", error)
      }
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      try {
        const response = await fetch(`/api/admin/questions?id=${questionId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          fetchQuestions(selectedSection)
        }
      } catch (error) {
        console.error("Error deleting question:", error)
      }
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button variant="ghost" onClick={() => router.push("/admin")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manage Tests</h1>
                <p className="text-gray-600">Create and manage test sections and questions</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="sections" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sections">Test Sections</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="sections">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Test Sections</CardTitle>
                    <CardDescription>Manage assessment categories</CardDescription>
                  </div>
                  <Dialog open={showSectionDialog} onOpenChange={setShowSectionDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Section
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Test Section</DialogTitle>
                        <DialogDescription>Add a new assessment category</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="sectionName">Section Name</Label>
                          <Input
                            id="sectionName"
                            value={sectionForm.name}
                            onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                            placeholder="e.g., React, Node.js, Python"
                          />
                        </div>
                        <div>
                          <Label htmlFor="sectionDescription">Description</Label>
                          <Textarea
                            id="sectionDescription"
                            value={sectionForm.description}
                            onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
                            placeholder="Brief description of the assessment"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSectionDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateSection}>Create Section</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sections.map((section) => (
                      <TableRow key={section.id}>
                        <TableCell className="font-medium">{section.name}</TableCell>
                        <TableCell>{section.description}</TableCell>
                        <TableCell>
                          <Badge variant={section.isActive ? "default" : "secondary"}>
                            {section.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(section.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditSection(section)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteSection(section.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Edit Section Dialog */}
            <Dialog open={showEditSectionDialog} onOpenChange={setShowEditSectionDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Test Section</DialogTitle>
                  <DialogDescription>Update the assessment category</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="editSectionName">Section Name</Label>
                    <Input
                      id="editSectionName"
                      value={sectionForm.name}
                      onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                      placeholder="e.g., React, Node.js, Python"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editSectionDescription">Description</Label>
                    <Textarea
                      id="editSectionDescription"
                      value={sectionForm.description}
                      onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
                      placeholder="Brief description of the assessment"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowEditSectionDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateSection}>Update Section</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="questions">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Questions</CardTitle>
                    <CardDescription>Manage questions for each section</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <select
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value)}
                      className="px-3 py-2 border rounded-md"
                    >
                      {sections.map((section) => (
                        <option key={section.id} value={section.id}>
                          {section.name}
                        </option>
                      ))}
                    </select>
                    <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
                      <DialogTrigger asChild>
                        <Button disabled={!selectedSection}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Question
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Create Question</DialogTitle>
                          <DialogDescription>Add a new question to the selected section</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="question">Question</Label>
                            <Textarea
                              id="question"
                              value={questionForm.question}
                              onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                              placeholder="Enter your question here"
                            />
                          </div>
                          <div>
                            <Label>Options</Label>
                            <div className="space-y-2">
                              {questionForm.options.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...questionForm.options]
                                      newOptions[index] = e.target.value
                                      setQuestionForm({ ...questionForm, options: newOptions })
                                    }}
                                    placeholder={`Option ${index + 1}`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label>Correct Answer</Label>
                            <RadioGroup
                              value={questionForm.correctAnswer.toString()}
                              onValueChange={(value) =>
                                setQuestionForm({ ...questionForm, correctAnswer: Number.parseInt(value) })
                              }
                            >
                              {questionForm.options.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                                  <Label htmlFor={`option-${index}`}>Option {index + 1}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowQuestionDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateQuestion}>Create Question</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {selectedSection ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Options</TableHead>
                        <TableHead>Correct Answer</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {questions.map((question) => (
                        <TableRow key={question.id}>
                          <TableCell className="max-w-xs">
                            <div className="truncate">{question.question}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {question.options.map((option, index) => (
                                <div key={index} className="truncate">
                                  {index + 1}. {option}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">Option {question.correctAnswer + 1}</Badge>
                          </TableCell>
                          <TableCell>{new Date(question.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditQuestion(question)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteQuestion(question.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">Select a section to view questions</div>
                )}
              </CardContent>
            </Card>

            {/* Edit Question Dialog */}
            <Dialog open={showEditQuestionDialog} onOpenChange={setShowEditQuestionDialog}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Question</DialogTitle>
                  <DialogDescription>Update the question details</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="editQuestion">Question</Label>
                    <Textarea
                      id="editQuestion"
                      value={questionForm.question}
                      onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                      placeholder="Enter your question here"
                    />
                  </div>
                  <div>
                    <Label>Options</Label>
                    <div className="space-y-2">
                      {questionForm.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...questionForm.options]
                              newOptions[index] = e.target.value
                              setQuestionForm({ ...questionForm, options: newOptions })
                            }}
                            placeholder={`Option ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Correct Answer</Label>
                    <RadioGroup
                      value={questionForm.correctAnswer.toString()}
                      onValueChange={(value) =>
                        setQuestionForm({ ...questionForm, correctAnswer: Number.parseInt(value) })
                      }
                    >
                      {questionForm.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={index.toString()} id={`edit-option-${index}`} />
                          <Label htmlFor={`edit-option-${index}`}>Option {index + 1}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowEditQuestionDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateQuestion}>Update Question</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
