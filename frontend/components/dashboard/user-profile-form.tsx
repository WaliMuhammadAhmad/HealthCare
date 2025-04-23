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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import {
  updateAccountInfo,
  updateAccountPassword,
  deactivateAccount,
  deleteAccount,
} from "@/utils/api/user";

export function UserProfileForm() {
  const { user } = useAppStore();
  const { toast } = useToast();

  // User profile data
  const [profileData, setProfileData] = useState({
    userId: user?.patientID,
    fullName: user?.fullName,
    email: user?.email,
    phone: user?.phoneNumber,
    address: user?.address,
    dateOfBirth: user?.dateOfBirth,
    gender: user?.gender,
    emergencyContact: user?.emergencyContact,
    emergencyContactName: user?.emergencyContactName,
    profilePic: user?.profilePic || "/placeholder.svg?height=100&width=100",
  });

  // Password change data
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailAppointmentReminders: true,
    emailAppointmentChanges: true,
    emailMedicalUpdates: true,
    smsAppointmentReminders: false,
    smsAppointmentChanges: false,
    smsMedicalUpdates: false,
  });

  // Account deletion
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
  const [deactivateAccountDialog, setDeactivateAccountDialog] = useState(false);
  const [accountActionReason, setAccountActionReason] = useState("");

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    });
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileData.userId !== undefined) {
      updateAccountInfo(profileData);
    } else {
      toast({
        title: "Error",
        description: "User ID is missing. Unable to update profile.",
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

    updateAccountPassword(
      profileData.userId ?? 0,
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

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data to the server
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleRequestAccountDeletion = () => {
    if (accountActionReason) {
      deleteAccount(profileData.userId ?? 0);
      toast({
        title: "Account deletion requested",
        description: "Your account has been deleted.",
      });
      setDeleteAccountDialog(false);
      setAccountActionReason("");
    }
  };

  const handleRequestAccountDeactivation = () => {
    if (accountActionReason) {
      deactivateAccount(profileData.userId ?? 0);
      toast({
        title: "Account deactivation requested",
        description:
          "Your account has been deactivated. You can contact admin to reactivate it.",
      });
      setDeactivateAccountDialog(false);
      setAccountActionReason("");
    }
  };

  return (
    <Tabs defaultValue='profile' className='w-full'>
      <TabsList className='grid w-full max-w-md grid-cols-3'>
        <TabsTrigger value='profile'>Profile</TabsTrigger>
        <TabsTrigger value='password'>Password</TabsTrigger>
        <TabsTrigger value='notifications'>Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value='profile'>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information and preferences.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleProfileSubmit}>
            <CardContent className='space-y-6'>
              <div className='flex items-center space-x-4'>
                <Avatar className='h-20 w-20'>
                  <AvatarImage
                    src={profileData.profilePic}
                    alt={profileData.fullName}
                  />
                  <AvatarFallback>
                    {profileData.fullName?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant='outline' size='sm'>
                    Change Avatar
                  </Button>
                </div>
              </div>

              <div className='grid gap-4 md:grid-cols-2'>
                <div className='grid gap-2'>
                  <Label htmlFor='name'>Full Name</Label>
                  <Input
                    id='name'
                    name='name'
                    value={profileData.fullName}
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
                  <Label htmlFor='phone'>Phone Number</Label>
                  <Input
                    id='phone'
                    name='phone'
                    value={profileData.phone}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className='grid gap-2'>
                  <Label htmlFor='dateOfBirth'>Date of Birth</Label>
                  <Input
                    id='dateOfBirth'
                    name='dateOfBirth'
                    type='date'
                    value={profileData.dateOfBirth}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              <div className='grid gap-4 md:grid-cols-3'>
                <div className='grid gap-2'>
                  <Label htmlFor='gender'>Gender</Label>
                  <select
                    id='gender'
                    name='gender'
                    value={profileData.gender}
                    onChange={handleProfileChange}
                    className='border rounded-md p-2'>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                    <option value='Prefer Not to Say'>Prefer Not to Say</option>
                  </select>
                </div>

                <div className='grid gap-2'>
                  <Label htmlFor='emergencyContactName'>
                    Emergency Contact Name
                  </Label>
                  <Input
                    id='emergencyContactName'
                    name='emergencyContactName'
                    value={profileData.emergencyContactName}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className='grid gap-2'>
                  <Label htmlFor='emergencyContact'>Emergency Contact</Label>
                  <Input
                    id='emergencyContact'
                    name='emergencyContact'
                    value={profileData.emergencyContact}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='address'>Address</Label>
                <Input
                  id='address'
                  name='address'
                  value={profileData.address}
                  onChange={handleProfileChange}
                />
              </div>
            </CardContent>
            <CardFooter className='flex justify-between'>
              <Button type='submit'>Save Changes</Button>
            </CardFooter>
          </form>
        </Card>

        <Card className='mt-6'>
          <CardHeader>
            <CardTitle className='text-destructive'>Danger Zone</CardTitle>
            <CardDescription>
              Actions that will affect your account access and data.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between rounded-lg border p-4'>
              <div>
                <h4 className='font-medium'>Deactivate Account</h4>
                <p className='text-sm text-muted-foreground'>
                  Temporarily disable your account. You can reactivate it later.
                </p>
              </div>
              <Button
                variant='outline'
                onClick={() => setDeactivateAccountDialog(true)}>
                Deactivate
              </Button>
            </div>

            <div className='flex items-center justify-between rounded-lg border p-4'>
              <div>
                <h4 className='font-medium text-destructive'>Delete Account</h4>
                <p className='text-sm text-muted-foreground'>
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
              </div>
              <Button
                variant='destructive'
                onClick={() => setDeleteAccountDialog(true)}>
                Delete
              </Button>
            </div>
          </CardContent>
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

      <TabsContent value='notifications'>
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Manage how and when you receive notifications.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleNotificationSubmit}>
            <CardContent className='space-y-6'>
              <div>
                <h3 className='text-lg font-medium mb-4'>
                  Email Notifications
                </h3>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <Label htmlFor='emailAppointmentReminders'>
                        Appointment Reminders
                      </Label>
                      <p className='text-sm text-muted-foreground'>
                        Receive email reminders about upcoming appointments
                      </p>
                    </div>
                    <Switch
                      id='emailAppointmentReminders'
                      checked={notificationSettings.emailAppointmentReminders}
                      onCheckedChange={(checked) =>
                        handleNotificationChange(
                          "emailAppointmentReminders",
                          checked
                        )
                      }
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <Label htmlFor='emailAppointmentChanges'>
                        Appointment Changes
                      </Label>
                      <p className='text-sm text-muted-foreground'>
                        Receive emails about appointment cancellations or
                        reschedules
                      </p>
                    </div>
                    <Switch
                      id='emailAppointmentChanges'
                      checked={notificationSettings.emailAppointmentChanges}
                      onCheckedChange={(checked) =>
                        handleNotificationChange(
                          "emailAppointmentChanges",
                          checked
                        )
                      }
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <Label htmlFor='emailMedicalUpdates'>
                        Medical Updates
                      </Label>
                      <p className='text-sm text-muted-foreground'>
                        Receive emails about new medical records or test results
                      </p>
                    </div>
                    <Switch
                      id='emailMedicalUpdates'
                      checked={notificationSettings.emailMedicalUpdates}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("emailMedicalUpdates", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className='text-lg font-medium mb-4'>SMS Notifications</h3>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <Label htmlFor='smsAppointmentReminders'>
                        Appointment Reminders
                      </Label>
                      <p className='text-sm text-muted-foreground'>
                        Receive SMS reminders about upcoming appointments
                      </p>
                    </div>
                    <Switch
                      id='smsAppointmentReminders'
                      checked={notificationSettings.smsAppointmentReminders}
                      onCheckedChange={(checked) =>
                        handleNotificationChange(
                          "smsAppointmentReminders",
                          checked
                        )
                      }
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <Label htmlFor='smsAppointmentChanges'>
                        Appointment Changes
                      </Label>
                      <p className='text-sm text-muted-foreground'>
                        Receive SMS about appointment cancellations or
                        reschedules
                      </p>
                    </div>
                    <Switch
                      id='smsAppointmentChanges'
                      checked={notificationSettings.smsAppointmentChanges}
                      onCheckedChange={(checked) =>
                        handleNotificationChange(
                          "smsAppointmentChanges",
                          checked
                        )
                      }
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <Label htmlFor='smsMedicalUpdates'>Medical Updates</Label>
                      <p className='text-sm text-muted-foreground'>
                        Receive SMS about new medical records or test results
                      </p>
                    </div>
                    <Switch
                      id='smsMedicalUpdates'
                      checked={notificationSettings.smsMedicalUpdates}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("smsMedicalUpdates", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type='submit'>Save Preferences</Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      {/* Delete Account Dialog */}
      <Dialog open={deleteAccountDialog} onOpenChange={setDeleteAccountDialog}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle className='flex items-center'>
              <AlertCircle className='h-5 w-5 mr-2 text-destructive' />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This will permanently delete your account and all associated data.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className='py-4'>
            <div className='space-y-2'>
              <Label htmlFor='deleteReason'>
                Please tell us why you're leaving
              </Label>
              <Textarea
                id='deleteReason'
                placeholder='Your feedback helps us improve our services...'
                value={accountActionReason}
                onChange={(e) => setAccountActionReason(e.target.value)}
                className='min-h-[100px]'
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setDeleteAccountDialog(false)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleRequestAccountDeletion}
              disabled={!accountActionReason}>
              Delete My Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Account Dialog */}
      <Dialog
        open={deactivateAccountDialog}
        onOpenChange={setDeactivateAccountDialog}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle className='flex items-center'>
              <AlertCircle className='h-5 w-5 mr-2 text-destructive' />
              Deactivate Account
            </DialogTitle>
            <DialogDescription>
              This will temporarily disable your account. You can reactivate it
              by logging in again.
            </DialogDescription>
          </DialogHeader>

          <div className='py-4'>
            <div className='space-y-2'>
              <Label htmlFor='deactivateReason'>
                Please tell us why you're deactivating
              </Label>
              <Textarea
                id='deactivateReason'
                placeholder='Your feedback helps us improve our services...'
                value={accountActionReason}
                onChange={(e) => setAccountActionReason(e.target.value)}
                className='min-h-[100px]'
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setDeactivateAccountDialog(false)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleRequestAccountDeactivation}
              disabled={!accountActionReason}>
              Deactivate Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
