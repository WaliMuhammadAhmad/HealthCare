"use client"

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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Search, AlertCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Sample data for users
const usersData = [
  {
    id: "USR-001",
    name: "John Doe",
    email: "john.doe@example.com",
    image: "/placeholder.svg?height=40&width=40",
    joinedDate: "2023-01-15",
    status: "active",
    role: "patient",
  },
  {
    id: "USR-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    image: "/placeholder.svg?height=40&width=40",
    joinedDate: "2023-02-20",
    status: "active",
    role: "patient",
  },
  {
    id: "USR-003",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    image: "/placeholder.svg?height=40&width=40",
    joinedDate: "2023-03-10",
    status: "inactive",
    role: "patient",
  },
  {
    id: "USR-004",
    name: "Lisa Brown",
    email: "lisa.brown@example.com",
    image: "/placeholder.svg?height=40&width=40",
    joinedDate: "2023-04-05",
    status: "active",
    role: "patient",
  },
  {
    id: "USR-005",
    name: "Mark Wilson",
    email: "mark.wilson@example.com",
    image: "/placeholder.svg?height=40&width=40",
    joinedDate: "2023-05-12",
    status: "active",
    role: "patient",
  },
  {
    id: "USR-006",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    image: "/placeholder.svg?height=40&width=40",
    joinedDate: "2023-06-18",
    status: "active",
    role: "patient",
  },
  {
    id: "USR-007",
    name: "Michael Rodriguez",
    email: "michael.rodriguez@example.com",
    image: "/placeholder.svg?height=40&width=40",
    joinedDate: "2023-07-22",
    status: "active",
    role: "patient",
  },
  {
    id: "USR-008",
    name: "Emily Chen",
    email: "emily.chen@example.com",
    image: "/placeholder.svg?height=40&width=40",
    joinedDate: "2023-08-30",
    status: "active",
    role: "patient",
  },
  {
    id: "USR-009",
    name: "David Wilson",
    email: "david.wilson@example.com",
    image: "/placeholder.svg?height=40&width=40",
    joinedDate: "2023-09-14",
    status: "inactive",
    role: "patient",
  },
  {
    id: "USR-010",
    name: "Jessica Martinez",
    email: "jessica.martinez@example.com",
    image: "/placeholder.svg?height=40&width=40",
    joinedDate: "2023-10-05",
    status: "active",
    role: "patient",
  },
]

export function UsersTable() {
  const [users, setUsers] = useState(usersData)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<(typeof usersData)[0] | null>(null)
  const [deactivateDialog, setDeactivateDialog] = useState(false)

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDeactivateUser = () => {
    if (selectedUser) {
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
        ),
      )
      setDeactivateDialog(false)
      setSelectedUser(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Users</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <CardDescription>Manage user accounts and access permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.image} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{formatDate(user.joinedDate)}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>
                        {user.status === "active" ? "Active" : "Inactive"}
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
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user)
                              setDeactivateDialog(true)
                            }}
                          >
                            {user.status === "active" ? "Deactivate" : "Activate"} User
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
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
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </CardFooter>

      {/* Deactivate User Dialog */}
      <Dialog open={deactivateDialog} onOpenChange={setDeactivateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-destructive" />
              {selectedUser?.status === "active" ? "Deactivate" : "Activate"} User
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.status === "active"
                ? "This will prevent the user from accessing the platform. They will not be able to book appointments or access their medical records."
                : "This will restore the user's access to the platform. They will be able to book appointments and access their medical records."}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-4 border rounded-md">
                <Avatar>
                  <AvatarImage src={selectedUser.image} alt={selectedUser.name} />
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedUser.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeactivateDialog(false)}>
              Cancel
            </Button>
            <Button
              variant={selectedUser?.status === "active" ? "destructive" : "default"}
              onClick={handleDeactivateUser}
            >
              {selectedUser?.status === "active" ? "Deactivate" : "Activate"} User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

