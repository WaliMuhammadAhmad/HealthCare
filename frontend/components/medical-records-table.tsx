"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download } from "lucide-react"

// Dummy data for medical records
const medicalRecords = [
  {
    id: "REC-001",
    date: "2023-03-15",
    doctor: "Dr. Smith",
    type: "Checkup",
    diagnosis: "Annual physical examination",
    prescription: "Vitamin D supplements",
    notes: "Patient is in good health. Recommended regular exercise and balanced diet.",
    status: "completed",
  },
  {
    id: "REC-002",
    date: "2023-02-28",
    doctor: "Dr. Johnson",
    type: "Lab Test",
    diagnosis: "Blood work analysis",
    prescription: "None",
    notes: "Cholesterol levels slightly elevated. Follow-up in 3 months recommended.",
    status: "completed",
  },
  {
    id: "REC-003",
    date: "2023-01-10",
    doctor: "Dr. Williams",
    type: "Procedure",
    diagnosis: "Minor dermatological procedure",
    prescription: "Antibiotic ointment",
    notes: "Removed skin tag. Area should heal within 7-10 days.",
    status: "completed",
  },
  {
    id: "REC-004",
    date: "2022-12-05",
    doctor: "Dr. Brown",
    type: "Vaccination",
    diagnosis: "Seasonal flu vaccination",
    prescription: "None",
    notes: "Patient received annual flu vaccine. No adverse reactions observed.",
    status: "completed",
  },
  {
    id: "REC-005",
    date: "2022-11-20",
    doctor: "Dr. Smith",
    type: "Checkup",
    diagnosis: "Follow-up appointment",
    prescription: "Prescription refill for hypertension medication",
    notes: "Blood pressure under control. Continue current medication regimen.",
    status: "completed",
  },
  {
    id: "REC-006",
    date: "2022-10-15",
    doctor: "Dr. Johnson",
    type: "Lab Test",
    diagnosis: "Comprehensive metabolic panel",
    prescription: "Iron supplements",
    notes: "Slight iron deficiency detected. Recommended dietary changes and supplements.",
    status: "completed",
  },
  {
    id: "REC-007",
    date: "2022-09-08",
    doctor: "Dr. Williams",
    type: "Prescription",
    diagnosis: "Seasonal allergies",
    prescription: "Antihistamine medication",
    notes: "Prescribed 30-day supply of allergy medication with 2 refills.",
    status: "completed",
  },
  {
    id: "REC-008",
    date: "2022-08-22",
    doctor: "Dr. Brown",
    type: "Procedure",
    diagnosis: "Diagnostic imaging",
    prescription: "None",
    notes: "X-ray of right shoulder showed no fractures or dislocations.",
    status: "completed",
  },
]

export function MedicalRecordsTable() {
  const [selectedRecord, setSelectedRecord] = useState<(typeof medicalRecords)[0] | null>(null)

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

  return (
    <>
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
            {medicalRecords.map((record) => (
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
            ))}
          </TableBody>
        </Table>
      </div>

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

