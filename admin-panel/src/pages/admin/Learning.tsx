import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { useToast } from '../../hooks/useToast';
import type { AdminLearningPath, AdminLesson } from '../../types/admin';

const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export function Learning() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({ queryKey: ['admin-learning'], queryFn: () => adminApi.learning.listPaths() });

  if (isLoading) return <LoadingState />;

  const paths = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Learning Paths</h1>
        <Button onClick={() => navigate('/admin/learning/create')}>Create Learning Path</Button>
      </div>

      <div className="space-y-4">
        {paths.map((path: AdminLearningPath) => (
          <Card key={path.id} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{path.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{path.description}</p>
              </div>
              <Badge variant={path.isActive ? 'success' : 'danger'}>{path.isActive ? 'Active' : 'Inactive'}</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <Badge variant="gray" size="sm">{path.difficulty}</Badge>
              <span>{path.category}</span>
              <span>{path.estimatedDuration}</span>
              <span>{path.lessons?.length || 0} lessons</span>
            </div>
            <div className="mt-4">
              <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/learning/${path.id}/edit`)}>Edit</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function LearningPathForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { data: existing } = useQuery({
    queryKey: ['learning-path', id],
    queryFn: () => adminApi.learning.getPath(id!),
    enabled: !!id,
  });
  const createMutation = useMutation({ mutationFn: adminApi.learning.createPath });
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<AdminLearningPath> }) => adminApi.learning.updatePath(id, data) });

  const [formData, setFormData] = useState<AdminLearningPath>({
    id: '', title: '', description: '', category: '', difficulty: 'beginner',
    estimatedDuration: '', lessons: [], isActive: true, createdAt: '', updatedAt: '',
  });

  if (isEdit && existing) {
    const path = existing as AdminLearningPath;
    if (formData.id !== path.id) setFormData({ ...formData, ...path, id: path.id });
  }

  const addLesson = () => {
    const newLesson: AdminLesson = {
      id: `lesson-${Date.now()}`, title: '', description: '', content: '', keyPoints: [], order: formData.lessons?.length || 0,
    };
    setFormData({ ...formData, lessons: [...(formData.lessons || []), newLesson] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      addToast({ type: 'success', title: 'Learning path saved' });
      navigate('/admin/learning');
    } catch { addToast({ type: 'error', title: 'Failed to save' }); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit' : 'Create'} Learning Path</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <input className="w-full px-4 py-3 border rounded-lg" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          <textarea className="w-full px-4 py-3 border rounded-lg resize-y min-h-[100px]" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input className="px-4 py-3 border rounded-lg" placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
            <select className="px-4 py-3 border rounded-lg" value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value as AdminLearningPath['difficulty']})}>
              {DIFFICULTY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <input className="px-4 py-3 border rounded-lg" placeholder="Estimated Duration (e.g. 4 weeks)" value={formData.estimatedDuration} onChange={e => setFormData({...formData, estimatedDuration: e.target.value})} required />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="rounded" />
            <span>Active</span>
          </label>
          <div className="border-t pt-4">
            <Button type="button" variant="outline" onClick={addLesson}>Add Lesson</Button>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => navigate('/admin/learning')}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>Save</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
