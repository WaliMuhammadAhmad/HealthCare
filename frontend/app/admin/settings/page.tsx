import { ProfileForm } from "@/components/admin/profile-form"

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Admin Settings</h2>
      </div>

      <ProfileForm />
    </div>
  )
}

