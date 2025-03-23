"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Search, Plus, AlertCircle, Pencil, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Sample data for doctors
const doctorsData = [
  {
    id: "DOC-001",
    name: "Dr. Smith",
    image: "/placeholder.svg?height=40&width=40",
    email: "dr.smith@example.com",
    specialty: "Family Medicine",
    joinedDate: "2022-01-15",
    status: "active",
    availability: "Mon, Wed, Fri",
    bio: "Dr. Smith is a board-certified family physician with over 15 years of experience in primary care.",
  },
  {
    id: "DOC-002",
    name: "Dr. Johnson",
    image: "/placeholder.svg?height=40&width=40",
    email: "dr.johnson@example.com",
    specialty: "Cardiology",
    joinedDate: "2022-02-20",
    status: "active",
    availability: "Tue, Thu",
    bio: "Dr. Johnson is a cardiologist specializing in preventive cardiology and heart health.",
  },
  {
    id: "DOC-003",
    name: "Dr. Williams",
    image: "/placeholder.svg?height=40&width=40",
    email: "dr.williams@example.com",
    specialty: "Dermatology",
    joinedDate: "2022-03-10",
    status: "active",
    availability: "Mon, Tue, Wed",
    bio: "Dr. Williams is a dermatologist with expertise in skin cancer detection and treatment.",
  },
  {
    id: "DOC-004",
    name: "Dr. Brown",
    image: "/placeholder.svg?height=40&width=40",
    email: "dr.brown@example.com",
    specialty: "Pediatrics",
    joinedDate: "2022-04-05",
    status: "active",
    availability: "Wed, Thu, Fri",
    bio: "Dr. Brown is a pediatrician dedicated to providing comprehensive care for children from birth through adolescence.",
  },
  {
    id: "DOC-005",
    name: "Dr. Davis",
    image: "/placeholder.svg?height=40&width=40",
    email: "dr.davis@example.com",
    specialty: "Orthopedics",
    joinedDate: "2022-05-12",
    status: "inactive",
    availability: "Mon, Thu, Fri",
    bio: "Dr. Davis is an orthopedic surgeon specializing in sports medicine and joint replacement.",
  },
  {
    id: "DOC-006",
    name: "Dr. Miller",
    image: "/placeholder.svg?height=40&width=40",
    email: "dr.miller@example.com",
    specialty: "Neurology",
    joinedDate: "2022-06-18",
    status: "active",
    availability: "Tue, Wed, Thu",
    bio: "Dr. Miller is a neurologist with expertise in headache disorders and multiple sclerosis.",
  },
  {
    id: "DOC-007",
    name: "Dr. Wilson",
    image: "/placeholder.svg?height=40&width=40",
    email: "dr.wilson@example.com",
    specialty: "Psychiatry",
    joinedDate: "2022-07-22",
    status: "active",
    availability: "Mon, Wed, Fri",
    bio: "Dr. Wilson is a psychiatrist specializing in mood disorders and anxiety treatment.",
  },
  {
    id: "DOC-008",
    name: "Dr. Moore",
    image: "/placeholder.svg?height=40&width=40",
    email: "dr.moore@example.com",
    specialty: "Obstetrics & Gynecology",
    joinedDate: "2022-08-30",
    status: "active",
    availability: "Tue, Thu",
    bio: "Dr. Moore is an OB/GYN providing comprehensive women's health services.",
  },
]

// List of medical specialties
const specialties = [
  "Family Medicine",
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Orthopedics",
  "Neurology",
  "Psychiatry",
  "Obstetrics & Gynecology",
  "Ophthalmology",
  "Endocrinology",
  "Gastroenterology",
  "Urology",
  "Rheumatology",
  "Pulmonology",
]

export function DoctorsTable() {
  const [doctors, setDoctors] = useState(doctorsData)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedDoctor, setSelectedDoctor] = useState<(typeof doctorsData)[0] | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)

  // Form state for adding/editing
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    specialty: "",
    availability: "",
    bio: "",
    status: "active",
  })

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const filteredDoctors = doctors.filter((doctor) => {
    // Filter by search query
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by status
    const matchesStatus = statusFilter === "all" || doctor.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleOpenEditDialog = (doctor: (typeof doctorsData)[0]) => {
    setSelectedDoctor(doctor)
    setFormData({
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      specialty: doctor.specialty,
      availability: doctor.availability,
      bio: doctor.bio,
      status: doctor.status,
    })
    setIsEditing(true)
  }

  const handleOpenAddDialog = () => {
    setFormData({
      id: `DOC-${String(doctors.length + 1).padStart(3, "0")}`,
      name: "",
      email: "",
      specialty: "",
      availability: "",
      bio: "",
      status: "active",
    })
    setIsAdding(true)
  }

  const handleSaveDoctor = () => {
    if (isEditing && selectedDoctor) {
      // Update existing doctor
      setDoctors(
        doctors.map((doctor) =>
          doctor.id === selectedDoctor.id
            ? {
                ...doctor,
                name: formData.name,
                email: formData.email,
                specialty: formData.specialty,
                availability: formData.availability,
                bio: formData.bio,
                status: formData.status,
              }
            : doctor,
        ),
      )
      setIsEditing(false)
    } else if (isAdding) {
      // Add new doctor
      const newDoctor = {
        ...formData,
        image: "/placeholder.svg?height=40&width=40",
        joinedDate: new Date().toISOString().split("T")[0],
      }
      setDoctors([...doctors, newDoctor])
      setIsAdding(false)
    }
    setSelectedDoctor(null)
  }

  const handleDeleteDoctor = () => {
    if (selectedDoctor) {
      setDoctors(doctors.filter((doctor) => doctor.id !== selectedDoctor.id))
      setDeleteDialog(false)
      setSelectedDoctor(null)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle>All Doctors</CardTitle>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <Button onClick={handleOpenAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Doctor
            </Button>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors..."
                className="pl-8 w-full sm:w-[260px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <CardDescription>Manage doctors, their specialties, and availability</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDoctors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No doctors found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={doctor.image} alt={doctor.name} />
                          <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{doctor.name}</div>
                          <div className="text-sm text-muted-foreground">{doctor.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{doctor.specialty}</TableCell>
                    <TableCell>{formatDate(doctor.joinedDate)}</TableCell>
                    <TableCell>{doctor.availability}</TableCell>
                    <TableCell>
                      <Badge variant={doctor.status === "active" ? "default" : "secondary"}>
                        {doctor.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenEditDialog(doctor)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedDoctor(doctor)
                              setDeleteDialog(true)
                            }}
                            className="text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          Showing {filteredDoctors.length} of {doctors.length} doctors
        </div>
      </CardFooter>

      {/* Add/Edit Doctor Dialog */}
      <Dialog
        open={isEditing || isAdding}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditing(false)
            setIsAdding(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Doctor" : "Add New Doctor"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update the doctor's information and availability." : "Add a new doctor to the platform."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Dr. John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="doctor@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Select value={formData.specialty} onValueChange={(value) => handleSelectChange("specialty", value)}>
                  <SelectTrigger id="specialty">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Input
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                placeholder="Mon, Wed, Fri"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Brief professional bio and specializations..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false)
                setIsAdding(false)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveDoctor}>{isEditing ? "Save Changes" : "Add Doctor"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Doctor Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-destructive" />
              Delete Doctor
            </DialogTitle>
            <DialogDescription>
              This will permanently remove the doctor from the platform. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedDoctor && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-4 border rounded-md">
                <Avatar>
                  <AvatarImage src={selectedDoctor.image} alt={selectedDoctor.name} />
                  <AvatarFallback>{selectedDoctor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedDoctor.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedDoctor.specialty}</div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDoctor}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

