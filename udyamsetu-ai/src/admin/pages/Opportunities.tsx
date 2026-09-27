import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import { Briefcase, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import type { AdminOpportunity } from '../types';

export function Opportunities() {
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingOpp, setEditingOpp] = useState<AdminOpportunity | null>(null);
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-opportunities', search],
    queryFn: () => adminApi.opportunities.list({ search: search || undefined }),
  });

  const createMutation = useMutation({
    mutationFn: adminApi.opportunities.create,
    onSuccess: () => { refetch(); addToast({ type: 'success', title: 'Opportunity created' }); },
    onError: () => addToast({ type: 'error', title: 'Failed to create' }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminOpportunity> }) => adminApi.opportunities.update(id, data),
    onSuccess: () => { refetch(); addToast({ type: 'success', title: 'Opportunity updated' }); },
    onError: () => addToast({ type: 'error', title: 'Failed to update' }),
  });
  const deleteMutation = useMutation({
    mutationFn: adminApi.opportunities.delete,
    onSuccess: () => { refetch(); addToast({ type: 'success', title: 'Opportunity deleted' }); },
    onError: () => addToast({ type: 'error', title: 'Failed to delete' }),
  });

  if (isLoading || !data) return <LoadingState text="Loading opportunities..." />;

  const opportunities = data.data || [];

  const handleEdit = (opp: AdminOpportunity) => {
    setEditingOpp(opp);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleSubmit = async (formData: Partial<AdminOpportunity>) => {
    if (editingOpp) {
      await updateMutation.mutateAsync({ id: editingOpp._id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setShowForm(false);
    setEditingOpp(null);
  };

  if (showForm) {
    return (
      <OpportunityForm
        initial={editingOpp}
        onSubmit={handleSubmit}
        onCancel={() => { setShowForm(false); setEditingOpp(null); }}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Opportunity
        </Button>
      </div>

       <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {opportunities.length === 0 ? (
          <EmptyState icon={<Briefcase className="w-12 h-12 text-gray-300" />} title="No opportunities found" />
        ) : (
          opportunities.map((opp: AdminOpportunity) => (
            <Card key={opp._id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{opp.title}</h3>
                <Badge variant={opp.isActive ? 'success' : 'danger'}>{opp.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{opp.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <Badge variant="gray" size="sm">{opp.category}</Badge>
                <Badge variant="gray" size="sm">{opp.difficulty}</Badge>
                <span>Invest: {formatCurrency(opp.requiredInvestment.min)} - {formatCurrency(opp.requiredInvestment.max)}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(opp)} className="p-1 text-gray-600 hover:text-primary-600 rounded">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(opp._id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

interface OpportunityFormProps {
  initial?: AdminOpportunity | null;
  onSubmit: (data: Partial<AdminOpportunity>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

function OpportunityForm({ initial, onSubmit, onCancel, isLoading }: OpportunityFormProps) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [category, setCategory] = useState(initial?.category || '');
  const [difficulty, setDifficulty] = useState(initial?.difficulty || 'easy');
  const [minInvest, setMinInvest] = useState(initial?.requiredInvestment?.min || 0);
  const [maxInvest, setMaxInvest] = useState(initial?.requiredInvestment?.max || 0);
  const [requiredSkills, setRequiredSkills] = useState(initial?.requiredSkills?.join(', ') || '');
  const [customerSegments, setCustomerSegments] = useState(initial?.customerSegments?.join(', ') || '');
  const [isActive, setIsActive] = useState(initial?.isActive !== false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      description,
      category,
      difficulty,
      requiredInvestment: { min: minInvest, max: maxInvest, currency: 'INR' },
      requiredSkills: requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      customerSegments: customerSegments.split(',').map(s => s.trim()).filter(Boolean),
      incomeScenarios: { conservative: 0, expected: 0, optimistic: 0, currency: 'INR', period: 'monthly' },
      isActive,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{initial ? 'Edit Opportunity' : 'Create Opportunity'}</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <input className="w-full px-4 py-3 border rounded-lg" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <textarea className="w-full px-4 py-3 border rounded-lg resize-y min-h-[100px]" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input className="px-4 py-3 border rounded-lg" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} required />
            <select className="px-4 py-3 border rounded-lg" value={difficulty} onChange={e => setDifficulty(e.target.value as AdminOpportunity['difficulty'])}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="number" className="px-4 py-3 border rounded-lg" placeholder="Min Investment" value={minInvest} onChange={e => setMinInvest(parseInt(e.target.value) || 0)} required />
            <input type="number" className="px-4 py-3 border rounded-lg" placeholder="Max Investment" value={maxInvest} onChange={e => setMaxInvest(parseInt(e.target.value) || 0)} required />
          </div>
          <input className="w-full px-4 py-3 border rounded-lg" placeholder="Required Skills (comma sep)" value={requiredSkills} onChange={e => setRequiredSkills(e.target.value)} />
          <input className="w-full px-4 py-3 border rounded-lg" placeholder="Customer Segments (comma sep)" value={customerSegments} onChange={e => setCustomerSegments(e.target.value)} />
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
