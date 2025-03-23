import { UserProfileForm } from "@/components/dashboard/user-profile-form"

export default function UserSettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
      </div>

      <UserProfileForm />
    </div>
  )
}

