"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Search } from "lucide-react"

// Sample data for medical records
const medicalRecordsData = [
  {
    id: "REC-001",
    date: "2023-10-28",
    doctor: "Dr. Smith",
    type: "Checkup",
    diagnosis: "Annual physical examination",
    prescription: "Vitamin D supplements",
    notes: "Patient is in good health. Recommended regular exercise and balanced diet.",
  },
  {
    id: "REC-002",
    date: "2023-10-15",
    doctor: "Dr. Johnson",
    type: "Lab Test",
    diagnosis: "Blood work analysis",
    prescription: "None",
    notes: "Cholesterol levels slightly elevated. Follow-up in 3 months recommended.",
  },
  {
    id: "REC-003",
    date: "2023-09-22",
    doctor: "Dr. Williams",
    type: "Procedure",
    diagnosis: "Minor dermatological procedure",
    prescription: "Antibiotic ointment",
    notes: "Removed skin tag. Area should heal within 7-10 days.",
  },
  {
    id: "REC-004",
    date: "2023-08-10",
    doctor: "Dr. Brown",
    type: "Vaccination",
    diagnosis: "Seasonal flu vaccination",
    prescription: "None",
    notes: "Patient received annual flu vaccine. No adverse reactions observed.",
  },
  {
    id: "REC-005",
    date: "2023-07-05",
    doctor: "Dr. Smith",
    type: "Checkup",
    diagnosis: "Follow-up appointment",
    prescription: "Prescription refill for hypertension medication",
    notes: "Blood pressure under control. Continue current medication regimen.",
  },
  {
    id: "REC-006",
    date: "2023-06-18",
    doctor: "Dr. Johnson",
    type: "Lab Test",
    diagnosis: "Comprehensive metabolic panel",
    prescription: "Iron supplements",
    notes: "Slight iron deficiency detected. Recommended dietary changes and supplements.",
  },
  {
    id: "REC-007",
    date: "2023-05-22",
    doctor: "Dr. Williams",
    type: "Prescription",
    diagnosis: "Seasonal allergies",
    prescription: "Antihistamine medication",
    notes: "Prescribed 30-day supply of allergy medication with 2 refills.",
  },
  {
    id: "REC-008",
    date: "2023-04-15",
    doctor: "Dr. Brown",
    type: "Procedure",
    diagnosis: "Diagnostic imaging",
    prescription: "None",
    notes: "X-ray of right shoulder showed no fractures or dislocations.",
  },
]

export function UserMedicalRecordsTable() {
  const [records, setRecords] = useState(medicalRecordsData)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedRecord, setSelectedRecord] = useState<(typeof medicalRecordsData)[0] | null>(null)

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Checkup":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Lab Test":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "Procedure":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Vaccination":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Prescription":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const filteredRecords = records.filter((record) => {
    // Filter by search query
    const matchesSearch =
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by type
    const matchesType = typeFilter === "all" || record.type === typeFilter

    return matchesSearch && matchesType
  })

  return (
    <>
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4">
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Checkup">Checkup</SelectItem>
              <SelectItem value="Lab Test">Lab Test</SelectItem>
              <SelectItem value="Procedure">Procedure</SelectItem>
              <SelectItem value="Vaccination">Vaccination</SelectItem>
              <SelectItem value="Prescription">Prescription</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records..."
              className="pl-8 w-full sm:w-[260px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Diagnosis</TableHead>
              <TableHead className="hidden md:table-cell">Prescription</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No medical records found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{formatDate(record.date)}</TableCell>
                  <TableCell>{record.doctor}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTypeColor(record.type)}>
                      {record.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{record.diagnosis}</TableCell>
                  <TableCell className="hidden md:table-cell">{record.prescription || "None"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedRecord(record)}>
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Record Details Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Medical Record Details</DialogTitle>
            <DialogDescription>Complete information about this medical record.</DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Record ID:</div>
                <div className="col-span-3">{selectedRecord.id}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Date:</div>
                <div className="col-span-3">{formatDate(selectedRecord.date)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Doctor:</div>
                <div className="col-span-3">{selectedRecord.doctor}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Type:</div>
                <div className="col-span-3">
                  <Badge variant="outline" className={getTypeColor(selectedRecord.type)}>
                    {selectedRecord.type}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Diagnosis:</div>
                <div className="col-span-3">{selectedRecord.diagnosis}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Prescription:</div>
                <div className="col-span-3">{selectedRecord.prescription || "None"}</div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <div className="font-medium">Notes:</div>
                <div className="col-span-3">{selectedRecord.notes}</div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline">Download PDF</Button>
                <Button variant="outline" onClick={() => setSelectedRecord(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

