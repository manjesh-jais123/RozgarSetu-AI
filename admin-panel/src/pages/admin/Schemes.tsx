import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { Landmark, CheckCircle } from 'lucide-react';
import type { AdminScheme } from '../../types/admin';

export function Schemes() {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useQuery({ queryKey: ['admin-schemes'], queryFn: () => adminApi.schemes.list() });
  const verifyMutation = useMutation({ mutationFn: adminApi.schemes.verify });

  if (isLoading) return <LoadingState />;

  const schemes = data?.data || [];

  const handleVerify = async (id: string) => {
    await verifyMutation.mutateAsync(id);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Schemes</h1>
        <Button onClick={() => navigate('/admin/schemes/create')}>Add Scheme</Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full bg-white">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Scheme</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schemes.map((scheme: AdminScheme) => (
              <tr key={scheme.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Landmark className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium text-gray-900">{scheme.name}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{scheme.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{scheme.category}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <Badge variant={scheme.isVerified ? 'success' : 'warning'}>{scheme.isVerified ? 'Verified' : 'Unverified'}</Badge>
                    <Badge variant={scheme.isActive ? 'success' : 'danger'}>{scheme.isActive ? 'Active' : 'Inactive'}</Badge>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  {!scheme.isVerified && (
                    <button onClick={() => handleVerify(scheme.id)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/schemes/${scheme.id}/edit`)}>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SchemeForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { data: existing } = useQuery({ queryKey: ['scheme', id], queryFn: () => adminApi.schemes.get(id!), enabled: !!id });
  const createMutation = useMutation({ mutationFn: adminApi.schemes.create });
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<AdminScheme> }) => adminApi.schemes.update(id, data) });

  const [formData, setFormData] = useState<Partial<AdminScheme>>({
    name: '', description: '', category: '', eligibility: [], benefits: [],
    requiredDocuments: [], applicationProcess: [], officialWebsite: '',
    stateAvailability: [], isVerified: false, isActive: true,
  });

  if (isEdit && existing) {
    const scheme = existing as AdminScheme;
    if (formData.name !== scheme.name) setFormData({ ...formData, ...scheme, id: scheme.id });
  }

  const arrayFieldHandler = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
    setFormData({ ...formData, [field]: arr });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, data: formData });
      } else {
        await createMutation.mutateAsync(formData as Omit<AdminScheme, 'id' | 'createdAt' | 'updatedAt'>);
      }
      navigate('/admin/schemes');
    } catch {}
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit' : 'Create'} Scheme</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <input className="w-full px-4 py-3 border rounded-lg" placeholder="Scheme Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <textarea className="w-full px-4 py-3 border rounded-lg resize-y min-h-[100px]" placeholder="Description" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} required />
          <input className="w-full px-4 py-3 border rounded-lg" placeholder="Category" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} required />
          <input className="w-full px-4 py-3 border rounded-lg" placeholder="Eligibility (comma sep)" value={formData.eligibility?.join(', ') || ''} onChange={arrayFieldHandler('eligibility')} />
          <input className="w-full px-4 py-3 border rounded-lg" placeholder="Benefits (comma sep)" value={formData.benefits?.join(', ') || ''} onChange={arrayFieldHandler('benefits')} />
          <input className="w-full px-4 py-3 border rounded-lg" placeholder="Required Documents (comma sep)" value={formData.requiredDocuments?.join(', ') || ''} onChange={arrayFieldHandler('requiredDocuments')} />
          <input className="w-full px-4 py-3 border rounded-lg" placeholder="Application Process (comma sep)" value={formData.applicationProcess?.join(', ') || ''} onChange={arrayFieldHandler('applicationProcess')} />
          <input className="w-full px-4 py-3 border rounded-lg" type="url" placeholder="Official Website" value={formData.officialWebsite || ''} onChange={e => setFormData({...formData, officialWebsite: e.target.value})} />
          <input className="w-full px-4 py-3 border rounded-lg" placeholder="State Availability (comma sep)" value={formData.stateAvailability?.join(', ') || ''} onChange={arrayFieldHandler('stateAvailability')} />
          <div className="flex gap-4">
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isVerified} onChange={e => setFormData({...formData, isVerified: e.target.checked})} className="rounded" /> Verified</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="rounded" /> Active</label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => navigate('/admin/schemes')}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>Save</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
