import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { useToast } from '../../components/ui/Toast';
import { BookOpen, Plus, HelpCircle } from 'lucide-react';
import type { AdminLearningPath, AdminLesson, AdminQuizQuestion } from '../types';
import { useSocket } from '../hooks/useSocket';
import { useEffect } from 'react';

const DIFFICULTY_OPTIONS = ['beginner', 'intermediate', 'advanced'] as const;

export function Learning() {
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-learning'],
    queryFn: () => adminApi.learning.listPaths(),
  });

  const { subscribe, unsubscribe } = useSocket();

  useEffect(() => {
    const handler = () => refetch();
    subscribe('LEARNING_CONTENT_UPDATED', handler);
    return () => unsubscribe('LEARNING_CONTENT_UPDATED');
  }, [subscribe, unsubscribe, refetch]);

  if (isLoading || !data) return <LoadingState text="Loading learning paths..." />;

  const paths = (data as { paths: AdminLearningPath[]; categories: string[]; pagination: unknown }).paths || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Learning Paths</h1>
        <Button onClick={() => navigate('/admin/learning/create')}>Create Learning Path</Button>
      </div>

      <div className="space-y-4">
        {paths.length === 0 ? (
          <Card className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No learning paths yet</p>
          </Card>
        ) : (
          paths.map((path: AdminLearningPath) => (
            <Card key={path._id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{path.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{path.description}</p>
                </div>
                <Badge variant={path.isActive ? 'success' : 'danger'}>{path.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <Badge variant="gray" size="sm">{path.category}</Badge>
                <Badge variant="gray" size="sm">{path.difficulty}</Badge>
                <span>{path.estimatedDuration}</span>
                <span>{path.lessons?.length || 0} lessons</span>
              </div>
              <div className="mt-4">
                <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/learning/${path._id}/edit`)}>Edit</Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export function LearningPathForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: existing } = useQuery({
    queryKey: ['learning-path', id],
    queryFn: () => adminApi.learning.getPath(id!),
    enabled: !!id,
  });

  const createMutation = useMutation({
    mutationFn: adminApi.learning.createPath,
    onSuccess: () => { refetchPaths(); addToast({ type: 'success', title: 'Learning path saved' }); navigate('/admin/learning'); },
    onError: () => addToast({ type: 'error', title: 'Failed to save' }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ pathId, data }: { pathId: string; data: Partial<AdminLearningPath> }) =>
      adminApi.learning.updatePath(pathId, data),
    onSuccess: () => { refetchPaths(); addToast({ type: 'success', title: 'Learning path saved' }); navigate('/admin/learning'); },
    onError: () => addToast({ type: 'error', title: 'Failed to save' }),
  });

  const refetchPaths = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-learning'] });
  };

  const [formData, setFormData] = useState<AdminLearningPath>({
    _id: '', title: '', description: '', category: '', difficulty: 'beginner',
    estimatedDuration: '', lessons: [], progress: 0, tags: [], matchPercentage: 0,
    isActive: true, createdAt: '', updatedAt: '',
  });

  if (isEdit && existing) {
    const path = existing as AdminLearningPath;
    if (formData._id !== path._id) {
      setFormData({ ...path, _id: path._id });
    }
  }

  const addLesson = () => {
    const newLesson: AdminLesson = {
      title: '', description: '', videoUrl: '', thumbnail: '', duration: '',
      difficulty: 'easy', order: formData.lessons?.length || 0, keyPoints: [], isActive: true,
    };
    setFormData({
      ...formData,
      lessons: [...(formData.lessons || []), newLesson],
    });
  };

  const updateLesson = (index: number, field: keyof AdminLesson, value: unknown) => {
    const lessons = [...(formData.lessons || [])];
    lessons[index] = { ...lessons[index], [field]: value };
    setFormData({ ...formData, lessons });
  };

  const addQuizQuestion = (lessonIndex: number) => {
    const lessons = [...(formData.lessons || [])];
    const lesson = { ...lessons[lessonIndex] };
    const currentQuiz = lesson.quiz || { questions: [], passingScore: 70 };
    const newQuestion: AdminQuizQuestion = {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
    };
    lesson.quiz = {
      questions: [...currentQuiz.questions, newQuestion],
      passingScore: currentQuiz.passingScore,
    };
    lessons[lessonIndex] = lesson;
    setFormData({ ...formData, lessons });
  };

  const updateQuizQuestion = (lessonIndex: number, qIndex: number, field: keyof AdminQuizQuestion, value: unknown) => {
    const lessons = [...(formData.lessons || [])];
    const lesson = { ...lessons[lessonIndex] };
    const currentQuiz = lesson.quiz || { questions: [], passingScore: 70 };
    const questions = [...currentQuiz.questions];
    questions[qIndex] = { ...questions[qIndex], [field]: value };
    lesson.quiz = { questions, passingScore: currentQuiz.passingScore };
    lessons[lessonIndex] = lesson;
    setFormData({ ...formData, lessons });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ pathId: id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch {
      addToast({ type: 'error', title: 'Failed to save learning path' });
    }
  };

  const togglePublish = () => {
    setFormData({ ...formData, isActive: !formData.isActive });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Learning Path' : 'Create Learning Path'}</h1>
        <div className="flex gap-2">
          <Button variant={formData.isActive ? 'secondary' : 'primary'} size="sm" onClick={togglePublish}>
            {formData.isActive ? 'Unpublish' : 'Publish'}
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Title"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
            />
            <input
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Category"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              required
            />
          </div>

          <textarea
            className="w-full px-4 py-3 border rounded-lg resize-y min-h-[100px]"
            placeholder="Description"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <select
              className="w-full px-4 py-3 border rounded-lg"
              value={formData.difficulty}
              onChange={e => setFormData({...formData, difficulty: e.target.value as AdminLearningPath['difficulty']})}
            >
              {DIFFICULTY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
            </select>
            <input
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Estimated Duration (e.g. 4 weeks)"
              value={formData.estimatedDuration}
              onChange={e => setFormData({...formData, estimatedDuration: e.target.value})}
              required
            />
            <input
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Tags (comma sep)"
              value={formData.tags.join(', ')}
              onChange={e => setFormData({...formData, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
            />
          </div>

          <input
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="Thumbnail URL"
            value={formData.thumbnail || ''}
            onChange={e => setFormData({...formData, thumbnail: e.target.value})}
          />

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Lessons
              </h3>
              <Button type="button" variant="outline" size="sm" onClick={addLesson}>
                <Plus className="w-4 h-4 mr-1" /> Add Lesson
              </Button>
            </div>

            {formData.lessons?.length === 0 ? (
              <Card className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No lessons yet. Add your first lesson below.</p>
              </Card>
            ) : (
              formData.lessons?.map((lesson, lessonIndex) => (
                <Card key={lessonIndex} className="p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-3">Lesson {lessonIndex + 1}: {lesson.title || 'Untitled'}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Lesson Title"
                      value={lesson.title || ''}
                      onChange={e => updateLesson(lessonIndex, 'title', e.target.value)}
                      required
                    />
                    <input
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Video URL (YouTube)"
                      value={lesson.videoUrl || ''}
                      onChange={e => updateLesson(lessonIndex, 'videoUrl', e.target.value)}
                      required
                    />
                  </div>
                  <textarea
                    className="w-full px-4 py-2 border rounded-lg resize-y mt-3"
                    placeholder="Description"
                    value={lesson.description || ''}
                    onChange={e => updateLesson(lessonIndex, 'description', e.target.value)}
                    rows={3}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <input
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Thumbnail URL"
                      value={lesson.thumbnail || ''}
                      onChange={e => updateLesson(lessonIndex, 'thumbnail', e.target.value)}
                    />
                    <input
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Duration (e.g. 10 mins)"
                      value={lesson.duration || ''}
                      onChange={e => updateLesson(lessonIndex, 'duration', e.target.value)}
                    />
                  </div>
                  <input
                    className="w-full px-4 py-2 border rounded-lg mt-3"
                    placeholder="Key Points (comma sep)"
                    value={lesson.keyPoints?.join(', ') || ''}
                    onChange={e => updateLesson(lessonIndex, 'keyPoints', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  />

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-800 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" /> Quiz Questions
                      </h5>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addQuizQuestion(lessonIndex)}
                      >
                        <Plus className="w-3 h-4 mr-1" /> Add Question
                      </Button>
                    </div>

                    {lesson.quiz?.questions?.length === 0 && (
                      <p className="text-sm text-gray-500">No quiz questions. Add questions to test understanding.</p>
                    )}

                    {lesson.quiz?.questions?.map((q, qIndex) => (
                      <Card key={qIndex} className="p-4 mb-3 bg-gray-50">
                        <input
                          className="w-full px-3 py-2 border rounded-lg mb-2"
                          placeholder={`Question ${qIndex + 1}`}
                          value={q.question || ''}
                          onChange={e => updateQuizQuestion(lessonIndex, qIndex, 'question', e.target.value)}
                        />
                        {q.options.map((opt, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2 mb-2">
                            <input
                              type="radio"
                              name={`q${lessonIndex}_${qIndex}_correct`}
                              checked={q.correctAnswer === optIndex}
                              onChange={() => updateQuizQuestion(lessonIndex, qIndex, 'correctAnswer', optIndex)}
                              className="text-primary-600"
                            />
                            <input
                              className="flex-1 px-3 py-2 border rounded-lg"
                              placeholder={`Option ${optIndex + 1}`}
                              value={opt || ''}
                              onChange={e => {
                                const currentQuiz = { ...(formData.lessons![lessonIndex].quiz || { questions: [], passingScore: 70 }) };
                                const questions = [...currentQuiz.questions];
                                const question = { ...questions[qIndex] };
                                question.options = [...(question.options || ['', '', '', ''])];
                                question.options[optIndex] = e.target.value;
                                questions[qIndex] = question;
                                currentQuiz.questions = questions;
                                const lessons = [...(formData.lessons || [])];
                                const lesson = { ...lessons[lessonIndex] };
                                lesson.quiz = currentQuiz;
                                lessons[lessonIndex] = lesson;
                                setFormData({ ...formData, lessons });
                              }}
                            />
                          </div>
                        ))}
                        <input
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="Explanation (optional)"
                          value={q.explanation || ''}
                          onChange={e => updateQuizQuestion(lessonIndex, qIndex, 'explanation', e.target.value)}
                        />
                      </Card>
                    ))}

                    {lesson.quiz && (
                      <div className="mt-2">
                        <input
                          type="number"
                          className="w-32 px-3 py-2 border rounded-lg"
                          placeholder="Passing Score (%)"
                          value={lesson.quiz.passingScore}
                          onChange={e => {
                            const lessons = [...(formData.lessons || [])];
                            const lesson = { ...lessons[lessonIndex] };
                            lesson.quiz = { ...(lesson.quiz || { questions: [] }), passingScore: parseInt(e.target.value) || 70 };
                            lessons[lessonIndex] = lesson;
                            setFormData({ ...formData, lessons });
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <label className="flex items-center gap-2 mt-3">
                    <input
                      type="checkbox"
                      checked={lesson.isActive}
                      onChange={e => updateLesson(lessonIndex, 'isActive', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Lesson Active</span>
                  </label>
                </Card>
              ))
            )}
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
