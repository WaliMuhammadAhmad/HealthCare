"use client";

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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Search, AlertCircle, Info } from "lucide-react";
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
import { useAppStore } from "@/stores/useAppStore";
import { formatDate } from "@/utils/formatDate";
import { activateAccount, deactivateAccount } from "@/utils/api/user";
import { usePatientStore } from "@/stores/usePatientStore";

export function UsersTable() {
  const users = usePatientStore((state) => state.patients);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(
    null
  );
  const [deactivateDialog, setDeactivateDialog] = useState(false);
  const [infoDialog, setInfoDialog] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeactivateUser = () => {
    if (selectedUser?.accountStatus === "Deactivated") {
      activateAccount(selectedUser.patientID);
      setDeactivateDialog(false);
      setSelectedUser(null);
    } else {
      if (selectedUser?.patientID !== undefined) {
        deactivateAccount(selectedUser.patientID);
      }
      setDeactivateDialog(false);
      setSelectedUser(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>All Users</CardTitle>
          <div className='relative w-64'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search users...'
              className='pl-8'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <CardDescription>
          Manage user accounts and access permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className='h-24 text-center'>
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.patientID}>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarImage
                            src={user.profilePic}
                            alt={user.fullName}
                          />
                          <AvatarFallback>
                            {user.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className='font-medium'>{user.fullName}</div>
                          <div className='text-sm text-muted-foreground'>
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.patientID}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.accountStatus === "Active"
                            ? "default"
                            : "secondary"
                        }>
                        {user.accountStatus === "Active"
                          ? "Active"
                          : "Inactive"}
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
                            onClick={() => {
                              setSelectedUser(user);
                              setDeactivateDialog(true);
                            }}>
                            {user.accountStatus === "Active"
                              ? "Deactivate"
                              : "Activate"}{" "}
                            User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
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
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </CardFooter>

      {/* User Info Dialog */}
      <Dialog open={infoDialog} onOpenChange={setInfoDialog}>
        <DialogContent className='sm:max-w-[725px]'>
          <DialogHeader>
            <DialogTitle className='flex items-center'>
              <Info className='h-5 w-5 mr-2' />
              User Details
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className='py-4 grid grid-cols-2 gap-4'>
              {/* First Row: Full Name and Profile Pic */}
              <div className='col-span-2 flex items-center gap-4 p-4 border rounded-md'>
                <Avatar className='w-16 h-16'>
                  <AvatarImage
                    src={selectedUser.profilePic}
                    alt={selectedUser.fullName}
                  />
                  <AvatarFallback>
                    {selectedUser.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className='font-semibold text-xl'>
                    {selectedUser.fullName}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    {selectedUser.email}
                  </div>
                </div>
              </div>

              {/* Second Row: Personal Info */}
              <div className='p-4 border rounded-md'>
                <div className='font-medium text-lg mb-2'>Personal Info</div>
                <div className='text-sm text-muted-foreground space-y-1'>
                  <p>
                    <span className='font-medium'>Gender:</span>{" "}
                    {selectedUser.gender}
                  </p>
                  <p>
                    <span className='font-medium'>Phone:</span>{" "}
                    {selectedUser.phoneNumber || "N/A"}
                  </p>
                  <p>
                    <span className='font-medium'>Address:</span>{" "}
                    {selectedUser.address || "N/A"}
                  </p>
                  <p>
                    <span className='font-medium'>Date of Birth:</span>{" "}
                    {formatDate(selectedUser.dateOfBirth) || "N/A"}
                  </p>
                  <p>
                    <span className='font-medium'>Joined On:</span>{" "}
                    {formatDate(selectedUser.createdAt)}
                  </p>
                </div>
              </div>

              {/* Third Row: Appointments Info */}
              <div className='p-4 border rounded-md'>
                <div className='font-medium text-lg mb-2'>Appointments</div>
                <div className='text-sm text-muted-foreground space-y-1'>
                  {/* <p>
                    <span className='font-medium'>Upcoming Appointments:</span>{" "}
                    {selectedUser.appointments || "N/A"}
                  </p> */}
                </div>
              </div>

              {/* Fourth Row: Emergency Contact */}
              <div className='p-4 border rounded-md'>
                <div className='font-medium text-lg mb-2'>
                  Emergency Contact
                </div>
                <div className='text-sm text-muted-foreground space-y-1'>
                  <p>
                    <span className='font-medium'>Contact Person:</span>{" "}
                    {selectedUser.emergencyContactName || "N/A"}
                  </p>
                  <p>
                    <span className='font-medium'>Contact Number:</span>{" "}
                    {selectedUser.emergencyContact || "N/A"}
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

      {/* Deactivate User Dialog */}
      <Dialog open={deactivateDialog} onOpenChange={setDeactivateDialog}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle className='flex items-center'>
              <AlertCircle className='h-5 w-5 mr-2 text-destructive' />
              {selectedUser?.accountStatus === "Active"
                ? "Deactivate"
                : "Activate"}{" "}
              User
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.accountStatus === "Active"
                ? "This will prevent the user from accessing the platform. They will not be able to book appointments or access their medical records."
                : "This will restore the user's access to the platform. They will be able to book appointments and access their medical records."}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className='py-4'>
              <div className='flex items-center gap-3 p-4 border rounded-md'>
                <Avatar>
                  <AvatarImage
                    src={selectedUser.profilePic}
                    alt={selectedUser.fullName}
                  />
                  <AvatarFallback>
                    {selectedUser.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className='font-medium'>{selectedUser.fullName}</div>
                  <div className='text-sm text-muted-foreground'>
                    {selectedUser.email}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setDeactivateDialog(false)}>
              Cancel
            </Button>
            <Button
              variant={
                selectedUser?.accountStatus === "Active"
                  ? "destructive"
                  : "default"
              }
              onClick={handleDeactivateUser}>
              {selectedUser?.accountStatus === "Active"
                ? "Deactivate"
                : "Activate"}{" "}
              User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
