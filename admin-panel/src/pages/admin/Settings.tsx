import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Shield, Save, Bell } from 'lucide-react';
import { Card } from '../../components/ui/Card';

export function Settings() {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
  });
  const [platformSettings, setPlatformSettings] = useState({
    registrationOpen: true,
    maintenanceMode: false,
    aiAssistedMatching: true,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <p className="text-sm text-gray-500 mt-1">Manage platform configuration and preferences</p>

      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4" /> Platform Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="font-medium">User Registration</p><p className="text-sm text-gray-500">Allow new users to register</p></div>
            <label className="relative inline-flex h-6 w-12 items-center rounded-full">
              <input type="checkbox" checked={platformSettings.registrationOpen} onChange={e => setPlatformSettings({...platformSettings, registrationOpen: e.target.checked})} className="sr-only" />
              <span className={`absolute inset-0 inline-flex transform rounded-full transition-colors ${platformSettings.registrationOpen ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              <span className="inline-block h-5 w-5 transform rounded-full bg-white"></span>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div><p className="font-medium">Maintenance Mode</p><p className="text-sm text-gray-500">Temporarily disable public access</p></div>
            <label className="relative inline-flex h-6 w-12 items-center rounded-full">
              <input type="checkbox" checked={platformSettings.maintenanceMode} onChange={e => setPlatformSettings({...platformSettings, maintenanceMode: e.target.checked})} className="sr-only" />
              <span className={`absolute inset-0 inline-flex transform rounded-full transition-colors ${platformSettings.maintenanceMode ? 'bg-orange-500' : 'bg-gray-300'}`}></span>
              <span className="inline-block h-5 w-5 transform rounded-full bg-white"></span>
            </label>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4" /> Notification Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">Email Notifications</p>
            <input type="checkbox" checked={notificationSettings.emailNotifications} onChange={e => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})} className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Push Notifications</p>
            <input type="checkbox" checked={notificationSettings.pushNotifications} onChange={e => setNotificationSettings({...notificationSettings, pushNotifications: e.target.checked})} className="rounded" />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button leftIcon={<Save className="w-4 h-4" />}>Save Settings</Button>
      </div>
    </div>
  );
}
