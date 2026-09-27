import { useState } from 'react';
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from '../hooks/useAdminQueries';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import { Award, Plus, Edit, Trash2 } from 'lucide-react';
import type { AdminSkill } from '../types';

const SKILL_CATEGORIES = [
  'Textile & Tailoring',
  'Handicrafts & Artisans',
  'Digital Services',
  'Food Processing',
  'Agriculture',
  'Other',
];

export function Skills() {
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<AdminSkill | null>(null);

  const { data, isLoading, refetch } = useSkills();
  const createMutation = useCreateSkill();
  const updateMutation = useUpdateSkill();
  const deleteMutation = useDeleteSkill();

  if (isLoading || !data) return <LoadingState text="Loading skills..." />;

  const skills = (data as { skills: AdminSkill[]; categories: string[]; pagination: unknown }).skills || [];

  const handleEdit = (skill: AdminSkill) => {
    setEditingSkill(skill);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      addToast({ type: 'success', title: 'Skill deleted' });
      refetch();
    } catch { addToast({ type: 'error', title: 'Failed to delete' }); }
  };

  const handleSubmit = async (formData: Partial<AdminSkill>) => {
    try {
      if (editingSkill) {
        await updateMutation.mutateAsync({ id: editingSkill._id, data: formData });
        addToast({ type: 'success', title: 'Skill updated' });
      } else {
        await createMutation.mutateAsync(formData);
        addToast({ type: 'success', title: 'Skill created' });
      }
      refetch();
      setShowForm(false);
      setEditingSkill(null);
    } catch { addToast({ type: 'error', title: 'Failed to save' }); }
  };

  if (showForm) {
    return (
      <SkillForm
        initial={editingSkill}
        onSubmit={handleSubmit}
        onCancel={() => { setShowForm(false); setEditingSkill(null); }}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Skill
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full bg-white">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Skill</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8">
                  <EmptyState icon={<Award className="w-12 h-12 text-gray-300" />} title="No skills found" />
                </td>
              </tr>
            ) : (
              skills.map((skill: AdminSkill) => (
                <tr key={skill._id} className="border-b border-gray-100 last:border-0">
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
                    <Badge variant={skill.isActive ? 'success' : 'danger'}>{skill.isActive ? 'Active' : 'Inactive'}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(skill)} className="p-1 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(skill._id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface SkillFormProps {
  initial?: AdminSkill | null;
  onSubmit: (data: Partial<AdminSkill>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

function SkillForm({ initial, onSubmit, onCancel, isLoading }: SkillFormProps) {
  const [name, setName] = useState(initial?.name || '');
  const [category, setCategory] = useState(initial?.category || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [isActive, setIsActive] = useState(initial?.isActive !== false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, category, description, isActive });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{initial ? 'Edit Skill' : 'Create Skill'}</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="Skill Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <select
            className="w-full px-4 py-3 border rounded-lg"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {SKILL_CATEGORIES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <textarea
            className="w-full px-4 py-3 border rounded-lg resize-y min-h-[100px]"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="rounded" />
            <span>Active</span>
          </label>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" loading={isLoading}>Save</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
