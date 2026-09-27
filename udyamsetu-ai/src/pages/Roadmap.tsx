import { useAIRoadmap } from '../hooks/useQueries';
import { useAuthStore } from '../hooks/useStores';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

import { LoadingState } from '../components/ui/LoadingState';
import { Stepper } from '../components/ui/Stepper';

import { CheckCircle, ArrowRight, Target, Lightbulb, BookOpen, Wrench, ClipboardList, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';

const ROADMAP_STEPS = [
  { id: 'interest', label: 'Interest', description: 'Discover your interests', icon: Lightbulb },
  { id: 'learn', label: 'Learn', description: 'Acquire necessary skills', icon: BookOpen },
  { id: 'practice', label: 'Practice', description: 'Apply what you learned', icon: Wrench },
  { id: 'assess', label: 'Assess', description: 'Test your knowledge', icon: ClipboardList },
  { id: 'plan', label: 'Plan', description: 'Create your business plan', icon: Target },
  { id: 'fund', label: 'Fund', description: 'Secure funding & resources', icon: DollarSign },
  { id: 'sell', label: 'Sell', description: 'Start selling your products', icon: ShoppingBag },
  { id: 'grow', label: 'Grow', description: 'Scale and expand', icon: TrendingUp },
];

export function Roadmap() {
  const { user } = useAuthStore();
  const { data: roadmap, isLoading } = useAIRoadmap(user?.id || '');

  if (isLoading) return <LoadingState text="Loading your roadmap..." />;

  const currentStepIndex = roadmap?.steps.findIndex(s => !s.completed) ?? 0;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-primary-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">What Should I Do Next?</h1>
        <p className="text-purple-100 mt-1">Your personalized roadmap from skill to sustainable income</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Stepper steps={ROADMAP_STEPS.map(s => ({ id: s.id, label: s.label, description: s.description, icon: <s.icon className="w-5 h-5" /> }))} currentStep={currentStepIndex} orientation="horizontal" variant="default" />
        </CardContent>
      </Card>

      {roadmap && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-100">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Your Next Step</h3>
                <p className="text-gray-600 mt-2">{roadmap.nextAction}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {roadmap.steps[currentStepIndex] && (
                    <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Start: {roadmap.steps[currentStepIndex].label}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {ROADMAP_STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          return (
            <Card key={step.id} className={`${isCurrent ? 'ring-2 ring-primary-500' : ''} ${isCompleted ? 'bg-green-50 border-green-100' : ''}`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'}`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{step.label}</h3>
                      {isCurrent && <Badge variant="primary" size="sm">Current</Badge>}
                      {isCompleted && <Badge variant="success" size="sm">Done</Badge>}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">How It Works</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3"><span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span><p>Complete your onboarding to unlock personalized recommendations</p></div>
            <div className="flex items-start gap-3"><span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span><p>Follow the roadmap step by step - each builds on the previous</p></div>
            <div className="flex items-start gap-3"><span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span><p>Complete lessons, pass assessments, and build your business plan</p></div>
            <div className="flex items-start gap-3"><span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span><p>Get funding, find buyers, and start selling</p></div>
            <div className="flex items-start gap-3"><span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold flex-shrink-0">5</span><p>Scale your business with ongoing support</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}