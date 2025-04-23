"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Admin } from "@/utils/api/admin";
import { useAppStore } from "@/stores/useAppStore";
import {
  editAdminInformation,
  updateAdminPassword,
  fetchAdminProfile,
} from "@/utils/api/admin";

export function ProfileForm() {
  const { admin } = useAppStore();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState({
    adminID: admin?.adminID,
    name: admin?.name,
    email: admin?.email,
    username: admin?.username,
    profilePic: admin?.profilePic,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      profileData.adminID &&
      profileData.name &&
      profileData.email &&
      profileData.username &&
      profileData.profilePic
    ) {
      editAdminInformation(profileData.adminID, profileData as Admin);
    } else {
      toast({
        title: "Incomplete Profile Data",
        description: "Please ensure all profile fields are filled out.",
        variant: "destructive",
      });
    }
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    updateAdminPassword(
      profileData.adminID ?? 0,
      passwordData.currentPassword,
      passwordData.newPassword
    );

    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });

    // Reset password fields
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <Tabs defaultValue='profile' className='w-full'>
      <TabsList className='grid w-full max-w-md grid-cols-2'>
        <TabsTrigger value='profile'>Profile</TabsTrigger>
        <TabsTrigger value='password'>Password</TabsTrigger>
      </TabsList>

      <TabsContent value='profile'>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your account profile information and email address.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleProfileSubmit}>
            <CardContent className='space-y-6'>
              <div className='flex items-center space-x-4'>
                <Avatar className='h-20 w-20'>
                  <AvatarImage
                    src={profileData.profilePic}
                    alt={profileData.name}
                  />
                  <AvatarFallback>
                    {profileData.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant='outline' size='sm'>
                    Change Avatar
                  </Button>
                </div>
              </div>

              <div className='space-y-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='name'>Name</Label>
                  <Input
                    id='name'
                    name='name'
                    value={profileData.name}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className='grid gap-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    value={profileData.email}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className='grid gap-2'>
                  <Label htmlFor='username'>Username</Label>
                  <Input
                    id='username'
                    name='username'
                    value={profileData.username}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type='submit'>Save Changes</Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <TabsContent value='password'>
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password to maintain account security.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handlePasswordSubmit}>
            <CardContent className='space-y-4'>
              <div className='grid gap-2'>
                <Label htmlFor='currentPassword'>Current Password</Label>
                <Input
                  id='currentPassword'
                  name='currentPassword'
                  type='password'
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='newPassword'>New Password</Label>
                <Input
                  id='newPassword'
                  name='newPassword'
                  type='password'
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='confirmPassword'>Confirm Password</Label>
                <Input
                  id='confirmPassword'
                  name='confirmPassword'
                  type='password'
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className='text-sm text-muted-foreground'>
                Password must be at least 8 characters long and include a mix of
                letters, numbers, and special characters.
              </div>
            </CardContent>
            <CardFooter>
              <Button type='submit'>Update Password</Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
