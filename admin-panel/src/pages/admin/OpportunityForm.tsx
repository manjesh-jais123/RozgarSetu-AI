import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import type { AdminOpportunity } from '../../types/admin';

export function OpportunityForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { data: existing } = useQuery({
    queryKey: ['opportunity', id],
    queryFn: () => adminApi.opportunities.get(id!),
    enabled: !!id,
  });
  const createMutation = useMutation({ mutationFn: adminApi.opportunities.create });
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<AdminOpportunity> }) => adminApi.opportunities.update(id, data) });

  const [formData, setFormData] = useState<Partial<AdminOpportunity>>({
    title: '', description: '', category: '', difficulty: 'easy',
    requiredInvestment: { min: 0, max: 0, currency: 'INR' },
    requiredSkills: [], customerSegments: [], isActive: true,
  });

  if (isEdit && existing) {
    const opp = existing as AdminOpportunity;
    if (formData.title !== opp.title) setFormData({ ...formData, ...opp, id: opp.id });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, data: formData });
      } else {
        await createMutation.mutateAsync(formData as Omit<AdminOpportunity, 'id' | 'createdAt' | 'updatedAt'>);
      }
      addToast({ type: 'success', title: 'Opportunity saved' });
      navigate('/admin/opportunities');
    } catch { addToast({ type: 'error', title: 'Failed to save' }); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit' : 'Create'} Opportunity</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <input className="w-full px-4 py-3 border rounded-lg" placeholder="Title" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} required />
          <textarea className="w-full px-4 py-3 border rounded-lg resize-y min-h-[100px]" placeholder="Description" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input className="px-4 py-3 border rounded-lg" placeholder="Category" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} required />
            <select className="px-4 py-3 border rounded-lg" value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value as AdminOpportunity['difficulty']})}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <input type="number" className="px-4 py-3 border rounded-lg" placeholder="Min Investment" value={formData.requiredInvestment?.min || 0} onChange={e => setFormData({...formData, requiredInvestment: {...formData.requiredInvestment!, min: parseInt(e.target.value) || 0}})} required />
            <input type="number" className="px-4 py-3 border rounded-lg" placeholder="Max Investment" value={formData.requiredInvestment?.max || 0} onChange={e => setFormData({...formData, requiredInvestment: {...formData.requiredInvestment!, max: parseInt(e.target.value) || 0}})} required />
            <input type="text" className="px-4 py-3 border rounded-lg" placeholder="Required Skills (comma sep)" value={formData.requiredSkills?.join(', ') || ''} onChange={e => setFormData({...formData, requiredSkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="rounded" />
            <span>Active</span>
          </label>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => navigate('/admin/opportunities')}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>Save</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
