import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { useAuthStore } from '../../hooks/useStores';
import {
  Bell,
  Database,
  Save,
  RefreshCw,
  Trash2,
  Download,
  Upload,
} from 'lucide-react';

function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <label className="relative inline-flex h-5 w-9 items-center rounded-full">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
      />
      <span className={`inline-block h-5 w-9 rounded-full transition-colors ${
        checked ? 'bg-gray-700' : 'bg-gray-300'
      }`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-1'
        }`} />
      </span>
    </label>
  );
}

export function AdminSettings() {
  const { addToast } = useToast();
  const { user } = useAuthStore();

  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      newUserAlerts: true,
      productModerationAlerts: true,
      schemeVerificationAlerts: true,
      dailyDigest: false,
    },
    system: {
      maintenanceMode: false,
      userRegistrations: true,
      aiGenerations: true,
    },
    data: {
      autoArchiveAuditLogs: false,
      archiveAfterDays: 90,
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('admin-settings', JSON.stringify(settings));
      addToast({ type: 'success', title: 'Settings saved successfully' });
    } catch {
      addToast({ type: 'error', title: 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({
      notifications: {
        emailNotifications: true,
        newUserAlerts: true,
        productModerationAlerts: true,
        schemeVerificationAlerts: true,
        dailyDigest: false,
      },
      system: {
        maintenanceMode: false,
        userRegistrations: true,
        aiGenerations: true,
      },
      data: {
        autoArchiveAuditLogs: false,
        archiveAfterDays: 90,
      },
    });
  };

  const toggleSetting = (section: keyof typeof settings, key: string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key as keyof typeof prev[typeof section]],
      },
    }));
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage platform configuration and preferences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive email notifications for admin actions</p>
            </div>
            <ToggleSwitch
              checked={settings.notifications.emailNotifications}
              onChange={() => toggleSetting('notifications', 'emailNotifications')}
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">New User Alerts</p>
              <p className="text-sm text-gray-500">Alert when a new user registers</p>
            </div>
            <ToggleSwitch
              checked={settings.notifications.newUserAlerts}
              onChange={() => toggleSetting('notifications', 'newUserAlerts')}
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Product Moderation Alerts</p>
              <p className="text-sm text-gray-500">Alert when products need moderation</p>
            </div>
            <ToggleSwitch
              checked={settings.notifications.productModerationAlerts}
              onChange={() => toggleSetting('notifications', 'productModerationAlerts')}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900">Daily Digest</p>
              <p className="text-sm text-gray-500">Receive a daily summary of platform activity</p>
            </div>
            <ToggleSwitch
              checked={settings.notifications.dailyDigest}
              onChange={() => toggleSetting('notifications', 'dailyDigest')}
            />
          </div>
        </div>
      </Card>

      {isSuperAdmin && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">System Configuration</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Maintenance Mode</p>
                <p className="text-sm text-gray-500">Temporarily disable public access to the platform</p>
              </div>
              <ToggleSwitch
                checked={settings.system.maintenanceMode}
                onChange={() => toggleSetting('system', 'maintenanceMode')}
                disabled
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">User Registrations</p>
                <p className="text-sm text-gray-500">Allow new users to register</p>
              </div>
              <ToggleSwitch
                checked={settings.system.userRegistrations}
                onChange={() => toggleSetting('system', 'userRegistrations')}
                disabled
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-900">AI Generations</p>
                <p className="text-sm text-gray-500">Enable AI-powered content generation</p>
              </div>
              <ToggleSwitch
                checked={settings.system.aiGenerations}
                onChange={() => toggleSetting('system', 'aiGenerations')}
                disabled
              />
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Auto-archive Audit Logs</p>
              <p className="text-sm text-gray-500">Automatically archive logs after set period</p>
            </div>
            <ToggleSwitch
              checked={settings.data.autoArchiveAuditLogs}
              onChange={() => toggleSetting('data', 'autoArchiveAuditLogs')}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900">Archive After (Days)</p>
              <p className="text-sm text-gray-500">Number of days before logs are archived</p>
            </div>
            <input
              type="number"
              min="30"
              max="365"
              value={settings.data.archiveAfterDays}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                data: { ...prev.data, archiveAfterDays: parseInt(e.target.value) || 90 }
              }))}
              className="w-20 px-2 py-1 border border-gray-200 rounded text-sm"
              disabled
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>
          </div>
        </div>
      </Card>

      {user?.role === 'SUPER_ADMIN' && (
        <Card className="p-6 border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">Irreversible actions that will affect the entire platform</p>
          <div className="flex gap-3">
            <Button variant="danger" size="sm" onClick={() => addToast({ type: 'info', title: 'Contact system administrator for data deletion' })}>
              Delete All Audit Logs
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
