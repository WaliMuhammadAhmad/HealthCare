"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Sample data for new users
const newUsers = [
  {
    id: "USR-001",
    name: "John Doe",
    email: "john.doe@example.com",
    image: "/placeholder.svg?height=32&width=32",
    joinedDate: "2023-11-10",
  },
  {
    id: "USR-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    image: "/placeholder.svg?height=32&width=32",
    joinedDate: "2023-11-11",
  },
  {
    id: "USR-003",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    image: "/placeholder.svg?height=32&width=32",
    joinedDate: "2023-11-12",
  },
  {
    id: "USR-004",
    name: "Lisa Brown",
    email: "lisa.brown@example.com",
    image: "/placeholder.svg?height=32&width=32",
    joinedDate: "2023-11-13",
  },
  {
    id: "USR-005",
    name: "Mark Wilson",
    email: "mark.wilson@example.com",
    image: "/placeholder.svg?height=32&width=32",
    joinedDate: "2023-11-14",
  },
]

export function NewUsers() {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Users</CardTitle>
        <CardDescription>Recently registered users on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Joined {formatDate(user.joinedDate)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

