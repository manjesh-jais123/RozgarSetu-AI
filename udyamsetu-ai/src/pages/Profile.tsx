import { useState } from 'react';
import { useProfile, useUpdateProfile } from '../hooks/useQueries';
import { useAuthStore } from '../hooks/useStores';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { LoadingState } from '../components/ui/LoadingState';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { User, Phone, Mail, MapPin, Calendar, BookOpen, Wrench, Target, Save, ArrowLeft, Trash2, CheckCircle, Plus } from 'lucide-react';

const GENDERS = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }];
const EDUCATION = [{ value: '', label: 'Select' }, { value: '10th', label: '10th Pass' }, { value: '12th', label: '12th Pass' }, { value: 'graduate', label: 'Graduate' }, { value: 'postgraduate', label: 'Post Graduate' }];

export function Profile() {
  const { user } = useAuthStore();
  const { data: profile, isLoading } = useProfile();
  const _updateProfile = useUpdateProfile();
  const { addToast: _addToast } = useToast();
  const [activeTab, setActiveTab] = useState('personal');

  if (isLoading) return <LoadingState text="Loading profile..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500">Manage your information and preferences</p>
        </div>
        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
          <User className="w-8 h-8 text-primary-600" />
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'personal', label: 'Personal Info', icon: User },
          { id: 'skills', label: 'Skills', icon: Wrench },
          { id: 'business', label: 'Business', icon: Target },
          { id: 'learning', label: 'Learning', icon: BookOpen },
          { id: 'achievements', label: 'Achievements', icon: CheckCircle },
          { id: 'settings', label: 'Settings', icon: Save },
        ].map(tab => {
          const Icon = tab.icon;
          void Icon;
          return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${activeTab === tab.id ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{tab.label}</button>;
        })}
      </div>

      {activeTab === 'personal' && (
        <Card><CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2"><User className="w-5 h-5 text-primary-600" /> Basic Information</h4>
              <div className="space-y-4">
                <Input label="Full Name" defaultValue={profile?.name || ''} />
                <Input label="Mobile" defaultValue={profile?.phone || ''} leftIcon={<Phone className="w-5 h-5" />} />
                <Input label="Email" type="email" defaultValue={profile?.email || ''} leftIcon={<Mail className="w-5 h-5" />} />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary-600" /> Location</h4>
              <div className="space-y-4">
                <Select label="State" options={[{value:'UP',label:'Uttar Pradesh'},{value:'MP',label:'Madhya Pradesh'}]} defaultValue="UP" />
                <Input label="District" defaultValue="Varanasi" />
                <Input label="Village/City" defaultValue="Sarnath" />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-primary-600" /> Personal Details</h4>
              <div className="space-y-4">
                <Input label="Age" type="number" defaultValue={profile?.profile?.age || 28} />
                <Select label="Gender" options={GENDERS} defaultValue="female" />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary-600" /> Education</h4>
              <Select label="Education Level" options={EDUCATION} defaultValue="12th" />
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end gap-3">
            <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>Back</Button>
            <Button variant="primary" leftIcon={<Save className="w-4 h-4" />}>Save Changes</Button>
          </div>
        </CardContent></Card>
      )}

      {activeTab === 'skills' && (
        <Card><CardContent className="p-6"><h3 className="font-semibold text-gray-900 mb-4">Your Skills</h3><div className="space-y-4">{profile?.profile?.skills?.map((skill, i) => (<div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center"><Wrench className="w-5 h-5 text-primary-600" /></div><div><p className="font-medium text-gray-900">{skill.name}</p><p className="text-sm text-gray-500">{skill.category} • {skill.yearsExperience} years</p></div></div><div className="flex items-center gap-2"><Badge variant={skill.proficiency === 'advanced' ? 'success' : skill.proficiency === 'intermediate' ? 'warning' : 'primary'}>{skill.proficiency}</Badge><Button variant="ghost" size="sm" className="text-red-500" onClick={() => {}}><Trash2 className="w-4 h-4" /></Button></div></div>))}</div><Button variant="primary" className="mt-4" leftIcon={<Plus className="w-4 h-4" />}>Add New Skill</Button></CardContent></Card>
      )}

      {activeTab === 'business' && (
        <Card><CardContent className="p-6"><h3 className="font-semibold text-gray-900 mb-4">Business Interests</h3><div className="grid md:grid-cols-2 gap-4">{profile?.profile?.businessInterest?.map((biz, i) => (<div key={i} className="p-4 border border-gray-200 rounded-lg"><Badge variant="primary" className="mb-2">{biz.category}</Badge><h4 className="font-medium text-gray-900">{biz.name}</h4><p className="text-sm text-gray-500 mt-1">{biz.description || 'No description'}</p></div>))}</div></CardContent></Card>
      )}

      {activeTab === 'learning' && (
        <Card><CardContent className="p-6"><h3 className="font-semibold text-gray-900 mb-4">Learning Progress</h3><div className="space-y-4">{/* Learning progress from data */}<div className="p-4 bg-gray-50 rounded-lg"><div className="flex justify-between mb-2"><span className="font-medium">Candle Making Business</span><span>35%</span></div><ProgressBar value={35} size="md" /></div><div className="p-4 bg-gray-50 rounded-lg"><div className="flex justify-between mb-2"><span className="font-medium">Tailoring Fundamentals</span><span>60%</span></div><ProgressBar value={60} size="md" /></div></div></CardContent></Card>
      )}

      {activeTab === 'achievements' && (
        <Card><CardContent className="p-6"><h3 className="font-semibold text-gray-900 mb-4">Achievements</h3><EmptyState icon={<CheckCircle className="w-12 h-12" />} title="No achievements yet" description="Complete lessons and milestones to earn badges" action={{ label: 'Explore Courses', onClick: () => {}, variant: 'primary' }} /></CardContent></Card>
      )}

      {activeTab === 'settings' && (
        <Card><CardContent className="p-6 space-y-6"><div><h4 className="font-medium text-gray-900 mb-3">Language Preferences</h4><div className="flex gap-3"><Button variant={user?.language === 'hi' ? 'primary' : 'outline'}>हिंदी</Button><Button variant={user?.language === 'en' ? 'primary' : 'outline'}>English</Button></div></div><div><h4 className="font-medium text-gray-900 mb-3">Notifications</h4><div className="space-y-2"><label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="w-5 h-5 rounded" /><span>New opportunity alerts</span></label><label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="w-5 h-5 rounded" /><span>Learning reminders</span></label><label className="flex items-center gap-3"><input type="checkbox" className="w-5 h-5 rounded" /><span>Marketing emails</span></label></div></div></CardContent></Card>
      )}
    </div>
  );
}