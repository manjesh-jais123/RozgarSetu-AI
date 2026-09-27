import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useOnboardingStore, useAuthStore } from '../hooks/useStores';
import { ArrowLeft, ArrowRight, BookOpen, Building2, Users, DollarSign, TrendingUp } from 'lucide-react';

const GOALS = [
  { id: 'learn', label: 'Learn a New Skill', description: 'Acquire new skills for livelihood', icon: BookOpen },
  { id: 'start', label: 'Start a Business', description: 'Begin your entrepreneurial journey', icon: Building2 },
  { id: 'grow', label: 'Grow Existing Business', description: 'Scale and expand your current business', icon: TrendingUp },
  { id: 'customers', label: 'Find Customers', description: 'Connect with buyers and markets', icon: Users },
  { id: 'funding', label: 'Find Funding', description: 'Access schemes, loans and grants', icon: DollarSign },
];

export function OnboardingStep5() {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const { updateFormData, setCurrentStep } = useOnboardingStore();
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleComplete = async () => {
    updateFormData({ goals: selectedGoals });
    setCurrentStep(5);
    
    // Mark onboarding as complete
    const user = JSON.parse(localStorage.getItem('rozgarsetu-auth') || '{}').user;
    if (user) {
      user.onboardingCompleted = true;
      setAuth(user, user.accessToken, user.refreshToken);
    }
    
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/onboarding/step-4')}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors touch-target"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-primary-600">Step 5 of 5</span>
            <span className="text-sm text-gray-400">Goals</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">What is Your Goal?</h1>
            <p className="text-gray-500 mt-1">Select what you want to achieve on RozgarSetu AI.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GOALS.map((goal) => {
              const Icon = goal.icon;
              const isSelected = selectedGoals.includes(goal.id);
              return (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`
                    flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all touch-target
                    ${isSelected
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    }
                  `}
                  aria-pressed={isSelected}
                >
                  <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isSelected ? 'bg-primary-100' : 'bg-gray-100'}
                  `}>
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-primary-600' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{goal.label}</h3>
                    <p className="text-sm text-gray-500">{goal.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => navigate('/onboarding/step-4')}
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleComplete}
              disabled={selectedGoals.length === 0}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Complete Onboarding
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

