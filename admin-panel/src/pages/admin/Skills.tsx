import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { useToast } from '../../hooks/useToast';
import { Award } from 'lucide-react';
import type { AdminSkill } from '../../types/admin';

const PROFICIENCY_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const SKILL_CATEGORIES = [
  { value: 'Textile & Tailoring', label: 'Textile & Tailoring' },
  { value: 'Handicrafts & Artisans', label: 'Handicrafts & Artisans' },
  { value: 'Digital Services', label: 'Digital Services' },
  { value: 'Food Processing', label: 'Food Processing' },
  { value: 'Agriculture', label: 'Agriculture' },
  { value: 'Other', label: 'Other' },
];

export function Skills() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-skills'],
    queryFn: () => adminApi.skills.list(),
  });

  if (isLoading) return <LoadingState />;

  const skills = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
        <Button onClick={() => navigate('/admin/skills/create')}>Add Skill</Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full bg-white">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Skill</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Proficiency</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill: AdminSkill) => (
              <tr key={skill.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{skill.name}</p>
                      {skill.description && <p className="text-sm text-gray-500 line-clamp-1">{skill.description}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{skill.category}</td>
                <td className="px-4 py-3">
                  <Badge variant={skill.proficiency === 'advanced' ? 'primary' : skill.proficiency === 'intermediate' ? 'secondary' : 'gray'}>
                    {skill.proficiency}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {skill.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="danger">Inactive</Badge>}
                </td>
                <td className="px-4 py-3">
                  <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/skills/${skill.id}/edit`)}>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SkillForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { data: existing, isLoading } = useQuery({
    queryKey: ['skill', id],
    queryFn: () => adminApi.skills.get(id!),
    enabled: !!id,
  });
  const createMutation = useMutation({ mutationFn: adminApi.skills.create });
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<AdminSkill> }) => adminApi.skills.update(id, data) });

  const [formData, setFormData] = useState<AdminSkill>({
    id: '', name: '', category: '', description: '', proficiency: 'beginner',
    yearsExperience: 0, learningResourceUrl: '', isActive: true,
    createdAt: '', updatedAt: '',
  });

  if (isEdit && isLoading) return <LoadingState />;

  if (isEdit && existing) {
    const skill = existing as AdminSkill;
    if (formData.id !== skill.id) setFormData({ ...formData, ...skill, id: skill.id });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      addToast({ type: 'success', title: 'Skill saved successfully' });
      navigate('/admin/skills');
    } catch { addToast({ type: 'error', title: 'Failed to save skill' }); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Skill' : 'Create Skill'}</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input className="px-4 py-3 border rounded-lg" placeholder="Skill Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <select className="px-4 py-3 border rounded-lg" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
              <option value="">Select Category</option>
              {SKILL_CATEGORIES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <textarea className="w-full px-4 py-3 border rounded-lg resize-y min-h-[100px]" placeholder="Description" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <select className="px-4 py-3 border rounded-lg" value={formData.proficiency} onChange={e => setFormData({...formData, proficiency: e.target.value as AdminSkill['proficiency']})}>
              {PROFICIENCY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <input type="number" className="px-4 py-3 border rounded-lg" placeholder="Years Experience" value={formData.yearsExperience} onChange={e => setFormData({...formData, yearsExperience: parseInt(e.target.value) || 0})} />
            <input type="url" className="px-4 py-3 border rounded-lg" placeholder="Learning Resource URL" value={formData.learningResourceUrl || ''} onChange={e => setFormData({...formData, learningResourceUrl: e.target.value})} />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="rounded" />
            <span>Active</span>
          </label>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => navigate('/admin/skills')}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>Save</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
