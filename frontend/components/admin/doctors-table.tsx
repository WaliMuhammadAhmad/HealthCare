"use client";

import type React from "react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Search,
  Plus,
  AlertCircle,
  Pencil,
  Trash,
  Info,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/stores/useAppStore";
import { specialties } from "@/data/specialties";
import { formatDate } from "@/utils/formatDate";
import { addDoctor, editDoctor, deleteDoctor } from "@/utils/doctor";

export function DoctorsTable() {
  const doctors = useAppStore((state) => state.doctors);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState<
    (typeof doctors)[0] | null
  >(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [infoDialog, setInfoDialog] = useState(false);

  // Form state for adding/editing
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    specialty: "",
    serviceDays: "",
    availabilityTimes: "",
    status: "Active",
    bio: "",
  });

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || doctor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenEditDialog = (doctor: (typeof doctors)[0]) => {
    setSelectedDoctor(doctor);
    setFormData({
      fullName: doctor.fullName,
      email: doctor.email,
      specialty: doctor.specialty,
      serviceDays: doctor.serviceDays,
      availabilityTimes: doctor.availabilityTimes,
      bio: doctor.bio,
      status: doctor.status,
    });
    setIsEditing(true);
  };

  const handleOpenAddDialog = () => {
    setFormData({
      fullName: "",
      email: "",
      specialty: "",
      serviceDays: "",
      availabilityTimes: "",
      bio: "",
      status: "Active",
    });
    setIsAdding(true);
  };

  const handleSaveDoctor = () => {
    if (isEditing && selectedDoctor) {
      editDoctor(selectedDoctor.doctorID, formData);
      setIsEditing(false);
    } else if (isAdding) {
      addDoctor(formData);
      setIsAdding(false);
    }
    setSelectedDoctor(null);
  };

  const handleDeleteDoctor = () => {
    if (selectedDoctor) {
      deleteDoctor(selectedDoctor.doctorID);
      setDeleteDialog(false);
      setSelectedDoctor(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
          <CardTitle>All Doctors</CardTitle>
          <div className='flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0'>
            <Button onClick={handleOpenAddDialog}>
              <Plus className='mr-2 h-4 w-4' />
              Add Doctor
            </Button>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Filter by status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Statuses</SelectItem>
                <SelectItem value='Active'>Active</SelectItem>
                <SelectItem value='Inactive'>Inactive</SelectItem>
              </SelectContent>
            </Select>
            <div className='relative'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search doctors...'
                className='pl-8 w-full sm:w-[260px]'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <CardDescription>
          Manage doctors, their specialties, and availability
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDoctors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='h-24 text-center'>
                    No doctors found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.doctorID}>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarImage
                            src={doctor.profilePic}
                            alt={doctor.fullName}
                          />
                          <AvatarFallback>
                            {doctor.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className='font-medium'>{doctor.fullName}</div>
                          <div className='text-sm text-muted-foreground'>
                            {doctor.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{doctor.specialty}</TableCell>
                    <TableCell>{formatDate(doctor.createdAt)}</TableCell>
                    <TableCell>
                      {doctor.serviceDays}
                      <br />
                      {doctor.availabilityTimes}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          doctor.status === "Active" ? "default" : "secondary"
                        }>
                        {doctor.status === "Active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon'>
                            <MoreHorizontal className='h-4 w-4' />
                            <span className='sr-only'>Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            onClick={() => handleOpenEditDialog(doctor)}>
                            <Pencil className='mr-2 h-4 w-4' />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setDeleteDialog(true);
                            }}
                            className='text-destructive'>
                            <Trash className='mr-2 h-4 w-4' />
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setInfoDialog(true);
                            }}>
                            View Details
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
        <div className='text-sm text-muted-foreground'>
          Showing {filteredDoctors.length} of {doctors.length} doctors
        </div>
      </CardFooter>

      {/* Add/Edit Doctor Dialog */}
      <Dialog
        open={isEditing || isAdding}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditing(false);
            setIsAdding(false);
          }
        }}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Doctor" : "Add New Doctor"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the doctor's information and availability."
                : "Add a new doctor to the platform."}
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Full Name</Label>
                <Input
                  id='name'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder='Dr. John Doe'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder='doctor@example.com'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='specialty'>Specialty</Label>
                <Select
                  value={formData.specialty}
                  onValueChange={(value) =>
                    handleSelectChange("specialty", value)
                  }>
                  <SelectTrigger id='specialty'>
                    <SelectValue placeholder='Select specialty' />
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
              <div className='space-y-2'>
                <Label htmlFor='status'>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleSelectChange("status", value)
                  }>
                  <SelectTrigger id='status'>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Active'>Active</SelectItem>
                    <SelectItem value='Inactive'>Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='serviceDays'>Service Days</Label>
                <Input
                  id='serviceDays'
                  name='serviceDays'
                  value={formData.serviceDays}
                  onChange={handleInputChange}
                  placeholder='Mon, Wed, Fri'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='availability'>Available Time Slots</Label>
                <Input
                  id='availabilityTimes'
                  name='availabilityTimes'
                  value={formData.availabilityTimes}
                  onChange={handleInputChange}
                  placeholder='10:00-12:00'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='bio'>Bio</Label>
              <Textarea
                id='bio'
                name='bio'
                value={formData.bio}
                onChange={handleInputChange}
                placeholder='Brief professional bio and specializations...'
                className='min-h-[100px]'
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setIsEditing(false);
                setIsAdding(false);
              }}>
              Cancel
            </Button>
            <Button onClick={handleSaveDoctor}>
              {isEditing ? "Save Changes" : "Add Doctor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Doctor Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle className='flex items-center'>
              <AlertCircle className='h-5 w-5 mr-2 text-destructive' />
              Delete Doctor
            </DialogTitle>
            <DialogDescription>
              This will permanently remove the doctor from the platform. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedDoctor && (
            <div className='py-4'>
              <div className='flex items-center gap-3 p-4 border rounded-md'>
                <Avatar>
                  <AvatarImage
                    src={selectedDoctor.profilePic}
                    alt={selectedDoctor.fullName}
                  />
                  <AvatarFallback>
                    {selectedDoctor.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className='font-medium'>{selectedDoctor.fullName}</div>
                  <div className='text-sm text-muted-foreground'>
                    {selectedDoctor.specialty}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={handleDeleteDoctor}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Doctor Info Dialog */}
      <Dialog open={infoDialog} onOpenChange={setInfoDialog}>
        <DialogContent className='sm:max-w-[725px]'>
          <DialogHeader>
            <DialogTitle className='flex items-center'>
              <Info className='h-5 w-5 mr-2' />
              User Details
            </DialogTitle>
          </DialogHeader>

          {selectedDoctor && (
            <div className='py-4'>
              {/* First Row: Full Name and Profile Pic */}
              <div className='col-span-2 flex items-center gap-4 p-4 border rounded-md'>
                <Avatar className='w-16 h-16'>
                  <AvatarImage
                    src={selectedDoctor.profilePic}
                    alt={selectedDoctor.fullName}
                  />
                  <AvatarFallback>
                    {selectedDoctor.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className='font-semibold text-xl'>
                    {selectedDoctor.fullName}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    {selectedDoctor.email}
                  </div>
                </div>
              </div>

              <div className='p-4 border rounded-md'>
                <div className='font-medium text-lg mb-2'>Personal Info</div>
                <div className='text-sm text-muted-foreground space-y-1'>
                  <p>
                    <span className='font-medium'>Specialty:</span>{" "}
                    {selectedDoctor.specialty}
                  </p>
                  <p>
                    <span className='font-medium'>Service Days:</span>{" "}
                    {selectedDoctor.serviceDays}
                  </p>
                  <p>
                    <span className='font-medium'>Availability Times:</span>{" "}
                    {selectedDoctor.availabilityTimes}
                  </p>
                  <p>
                    <span className='font-medium'>Bio:</span>{" "}
                    {selectedDoctor.bio}
                  </p>
                  <p>
                    <span className='font-medium'>Joined On:</span>{" "}
                    {formatDate(selectedDoctor.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant='outline' onClick={() => setInfoDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
