"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/utils/formatDate";
import { useStatsStore } from "@/stores/useStatsStore";

export function NewUsers() {
  const newUsers = useStatsStore((state) => state.latestUsers);
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Users</CardTitle>
        <CardDescription>
          Recently registered users on the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {newUsers?.map((user) => (
            <div
              key={user.id}
              className='flex items-center justify-between border-b pb-4 last:border-0 last:pb-0'>
              <div className='flex items-center space-x-3'>
                <Avatar>
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-medium'>{user.name}</p>
                  <p className='text-sm text-muted-foreground'>{user.email}</p>
                </div>
              </div>
              <div className='text-sm text-muted-foreground'>
                Joined {formatDate(user.joinedDate)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
