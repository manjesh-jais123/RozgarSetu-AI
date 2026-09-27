import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLearningPath, useCompleteLesson, useSubmitQuiz } from '../hooks/useQueries';
import { AIMessage } from '../components/ui/AIMessage';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { LoadingState } from '../components/ui/LoadingState';
import { useToast } from '../components/ui/Toast';
import { Play, CheckCircle, Clock, Brain, MessageSquare, Volume2, ChevronLeft, ChevronRight, X } from 'lucide-react';

const EXPLANATION_STYLES = [
  { id: 'simple', label: 'Explain Simply', icon: Brain },
  { id: 'example', label: 'Give Example', icon: MessageSquare },
  { id: 'village', label: 'Village Example', icon: Volume2 },
];

export function LearnPath() {
  const { pathId } = useParams();
  const { addToast } = useToast();
  const { data: path } = useLearningPath(pathId || '');
  const completeLesson = useCompleteLesson();
  const submitQuiz = useSubmitQuiz();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showAI, setShowAI] = useState(false);
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [aiInput, setAiInput] = useState('');

  if (!path) return <LoadingState text="Loading learning path..." />;

  const currentLesson = path.lessons[currentLessonIndex];
  const completedCount = path.lessons.filter(l => l.completed).length;
  const progress = Math.round((completedCount / path.lessons.length) * 100);

  const handleCompleteLesson = async () => {
    if (!currentLesson) return;
    try {
      await completeLesson.mutateAsync({ pathId: path.id, lessonId: currentLesson.id });
      addToast({ type: 'success', title: 'Lesson completed!', message: 'Great progress!' });
      if (currentLessonIndex < path.lessons.length - 1) {
        setCurrentLessonIndex(prev => prev + 1);
      }
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Failed to complete lesson' });
    }
  };

  const handleQuizSubmit = async (answers: number[]) => {
    if (!currentLesson?.quiz) return;
    try {
      const result = await submitQuiz.mutateAsync({ pathId: path.id, lessonId: currentLesson.id, answers });
      if (result.passed) {
        addToast({ type: 'success', title: 'Quiz Passed!', message: `Score: ${result.score}%` });
        await completeLesson.mutateAsync({ pathId: path.id, lessonId: currentLesson.id });
        if (currentLessonIndex < path.lessons.length - 1) {
          setCurrentLessonIndex(prev => prev + 1);
        }
      } else {
        addToast({ type: 'error', title: 'Quiz Failed', message: `Score: ${result.score}%. Try again!` });
      }
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Failed to submit quiz' });
    }
  };

  const handleAIExplain = async (style: string) => {
    if (!currentLesson) return;
    setShowAI(true);
    setAiMessages(prev => [...prev, { role: 'user', content: `Explain "${currentLesson.title}" in ${style} way` }]);
    addToast({ type: 'info', title: 'AI Explaining', message: 'Generating explanation...' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-secondary-600 to-primary-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="primary" className="mb-2">{path.category}</Badge>
            <h1 className="text-2xl font-bold">{path.title}</h1>
            <p className="text-secondary-100 mt-1">{path.description}</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {path.estimatedDuration}</span>
            <span className="flex items-center gap-1"><Target className="w-4 h-4" /> {progress}%</span>
          </div>
        </div>
        <ProgressBar value={progress} className="mt-4" size="lg" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-black relative">
                <img src={currentLesson.thumbnail} alt={currentLesson.title} className="w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button size="xl" variant="primary" onClick={() => addToast({ type: 'info', title: 'Video Player', message: 'Video playback will be integrated with backend' })}>
                    <Play className="w-8 h-8 ml-1" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white font-semibold">{currentLesson.title}</h3>
                  <p className="text-secondary-200 text-sm mt-1">{currentLesson.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Lesson Objective</CardTitle></CardHeader>
            <CardContent>
              <p className="text-gray-600">{currentLesson.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant={currentLesson.difficulty === 'easy' ? 'success' : currentLesson.difficulty === 'medium' ? 'warning' : 'danger'}>{currentLesson.difficulty}</Badge>
                <Badge variant="gray"><Clock className="w-3 h-3 mr-1" /> {currentLesson.duration}</Badge>
                <Badge variant="primary"><Brain className="w-3 h-3 mr-1" /> AI Explanation Available</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Key Points</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {currentLesson.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /> {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-primary-50 border-primary-100">
            <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="w-5 h-5 text-primary-600" /> Didn't Understand?</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">Ask AI to explain this lesson in different ways:</p>
              <div className="flex flex-wrap gap-2">
                {EXPLANATION_STYLES.map(({ id, label, icon }) => {
                  const Icon = icon;
                  return <Button key={id} variant="outline" size="sm" onClick={() => handleAIExplain(label.toLowerCase())} leftIcon={<Icon className="w-4 h-4" />}>{label}</Button>;
                })}
              </div>
            </CardContent>
          </Card>

          {currentLesson.quiz && (
            <Card>
              <CardHeader><CardTitle>Assessment Quiz</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentLesson.quiz.questions.map((q, qi) => (
                    <div key={q.id} className="space-y-2">
                      <p className="font-medium text-gray-900">{qi + 1}. {q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((opt, oi) => (
                          <label key={oi} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 cursor-pointer transition-colors">
                            <input type="radio" name={`q-${q.id}`} value={oi} className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500" />
                            <span className="text-gray-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button variant="primary" onClick={() => {
                    const answers = currentLesson.quiz!.questions.map((_, i) => {
                      const selected = document.querySelector(`input[name="q-${currentLesson.quiz!.questions[i].id}"]:checked`) as HTMLInputElement;
                      return selected ? parseInt(selected.value) : -1;
                    });
                    handleQuizSubmit(answers);
                  }} className="w-full">Submit Quiz</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!currentLesson.completed && !currentLesson.quiz && (
            <Card><CardContent className="p-6 text-center">
              <Button variant="primary" size="lg" onClick={handleCompleteLesson} className="w-full" rightIcon={<CheckCircle className="w-5 h-5" />}>Mark as Complete</Button>
            </CardContent></Card>
          )}

          {showAI && (
            <Card className="bg-gray-50 border-gray-100">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary-600" /> AI Assistant</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowAI(false)}><X className="w-4 h-4" /></Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto p-4 space-y-4">
                  {aiMessages.map((msg, i) => <AIMessage key={i} content={msg.content} />)}
                </div>
                <div className="border-t border-gray-200 p-4">
                  <div className="flex gap-2">
                    <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="Ask a follow-up question..." className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    <Button variant="primary" onClick={() => {}}>Send</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Course Content</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 p-2 max-h-[60vh] overflow-y-auto">
                {path.lessons.map((lesson, i) => (
                  <button key={lesson.id} onClick={() => setCurrentLessonIndex(i)} className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${i === currentLessonIndex ? 'bg-primary-50 border border-primary-200' : 'hover:bg-gray-50'}`} aria-current={i === currentLessonIndex ? 'step' : undefined}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${lesson.completed ? 'bg-green-500 text-white' : i === currentLessonIndex ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'}`}>
                      {lesson.completed ? <CheckCircle className="w-4 h-4" /> : <span className="text-sm font-medium">{i + 1}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">{lesson.title}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {lesson.duration}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Your Progress</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div><div className="flex justify-between text-sm mb-1"><span className="text-gray-500">Overall Progress</span><span className="font-medium text-gray-900">{progress}%</span></div><ProgressBar value={progress} size="md" /></div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg"><p className="text-2xl font-bold text-gray-900">{completedCount}</p><p className="text-xs text-gray-500">Completed</p></div>
                  <div className="p-3 bg-gray-50 rounded-lg"><p className="text-2xl font-bold text-gray-900">{path.lessons.length - completedCount}</p><p className="text-xs text-gray-500">Remaining</p></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => currentLessonIndex > 0 && setCurrentLessonIndex(prev => prev - 1)} disabled={currentLessonIndex === 0} leftIcon={<ChevronLeft className="w-4 h-4" />}>Previous</Button>
        <Button variant="primary" onClick={() => currentLessonIndex < path.lessons.length - 1 && setCurrentLessonIndex(prev => prev + 1)} disabled={currentLessonIndex === path.lessons.length - 1} rightIcon={<ChevronRight className="w-4 h-4" />}>Next</Button>
      </div>
    </div>
  );
}

import { Target } from 'lucide-react';