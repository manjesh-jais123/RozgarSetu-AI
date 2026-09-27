import { useNavigate } from 'react-router-dom';
import { useAuthStore, useUIStore } from '../hooks/useStores';
import { useRecommendedOpportunities, useRecommendedLearningPaths, useRecommendedSchemes, useAIRecommendations } from '../hooks/useQueries';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { OpportunityCard } from '../components/ui/OpportunityCard';
import { CourseCard } from '../components/ui/CourseCard';
import { SchemeCard } from '../components/ui/SchemeCard';
import { StatCard } from '../components/ui/StatCard';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { 
  TrendingUp, BookOpen, DollarSign, Target, 
  ArrowRight, 
  Sparkles, Lightbulb, Brain, MessageSquare, Wrench, Heart, Bot 
} from 'lucide-react';
import { mockTodaysMission } from '../data/mockData';

export function Dashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const { setChatOpen } = useUIStore();
  const navigate = useNavigate();

  // Queries
  const { data: opportunities, isLoading: oppLoading } = useRecommendedOpportunities(user?.id || '');
  const { data: learningPaths, isLoading: lpLoading } = useRecommendedLearningPaths(user?.id || '');
  const { data: schemes, isLoading: schemesLoading } = useRecommendedSchemes(user?.id || '');
  const { data: recommendations } = useAIRecommendations(user?.id || '');

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Namaste, {user?.name || 'User'} 👋</h1>
            <p className="text-primary-100 mt-1">Let&apos;s build your path to sustainable income.</p>
          </div>
          <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* AI Livelihood Profile Summary */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary-600" />
            Your Livelihood Fingerprint
          </h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
            View Full Profile
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Skills"
            value={user?.profile.skills.length || 0}
            icon={<Wrench className="w-5 h-5" />}
            iconBg="bg-primary-100"
            iconColor="text-primary-600"
          />
          <StatCard
            label="Interests"
            value={user?.profile.interests.length || 0}
            icon={<Heart className="w-5 h-5" />}
            iconBg="bg-secondary-100"
            iconColor="text-secondary-600"
          />
          <StatCard
            label="Investment"
            value={`₹${(user?.profile.financialInfo.availableCapital || 0).toLocaleString()}`}
            icon={<DollarSign className="w-5 h-5" />}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            label="Goals"
            value={user?.profile.goals.length || 0}
            icon={<Target className="w-5 h-5" />}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
        </div>
      </section>

      {/* Current Journey Progress */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary-600" />
          Your Journey Progress
        </h2>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium text-gray-900">Today&apos;s Mission</p>
                <p className="text-sm text-gray-500">{mockTodaysMission.description}</p>
              </div>
              <Badge variant="primary">{mockTodaysMission.progress}%</Badge>
            </div>
            <ProgressBar value={mockTodaysMission.progress} size="md" showLabel />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-gray-500">Complete Lesson 3 to unlock next step</span>
              <Button size="sm" variant="outline" onClick={() => navigate('/learn')}>
                Continue Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* AI Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            AI Recommendations
          </h2>
          <div className="space-y-3">
            {recommendations.slice(0, 2).map((rec) => (
              <Card key={rec.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-100">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-0.5 rounded">
                          {rec.type}
                        </span>
                        <Badge variant="success" size="sm">{Math.round(rec.confidence)}% match</Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                      <p className="text-xs text-gray-500 mt-2"><strong>Why:</strong> {rec.reason}</p>
                    </div>
                    <Button size="sm" variant="primary" onClick={() => navigate(rec.actionRoute)}>
                      {rec.actionLabel}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Recommended Opportunities */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            Recommended Opportunities
          </h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/explore')}>
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        {oppLoading ? (
          <LoadingState variant="skeleton" count={3} />
        ) : opportunities && opportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {opportunities.slice(0, 3).map((opp) => (
              <OpportunityCard
                key={opp.id}
                {...opp}
                onExplore={() => navigate(`/explore/${opp.id}`)}
                onLearn={() => navigate(`/learn?skill=${opp.requiredSkills[0]}`)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<TrendingUp className="w-12 h-12" />}
            title="No opportunities yet"
            description="Complete your profile to get personalized recommendations"
            action={{ label: 'Complete Profile', onClick: () => navigate('/profile'), variant: 'primary' }}
          />
        )}
      </section>

      {/* Continue Learning */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-secondary-600" />
            Continue Learning
          </h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/learn')}>
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        {lpLoading ? (
          <LoadingState variant="skeleton" count={2} />
        ) : learningPaths && learningPaths.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningPaths.slice(0, 2).map((lp) => (
              <CourseCard
                key={lp.id}
                {...lp}
                onContinue={() => navigate(`/learn/${lp.id}`)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<BookOpen className="w-12 h-12" />}
            title="No learning paths yet"
            description="Explore courses to start your learning journey"
            action={{ label: 'Browse Courses', onClick: () => navigate('/learn'), variant: 'primary' }}
          />
        )}
      </section>

      {/* Funding Opportunities */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Funding Opportunities
          </h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/funding')}>
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        {schemesLoading ? (
          <LoadingState variant="skeleton" count={2} />
        ) : schemes && schemes.length > 0 ? (
          <div className="space-y-3">
            {schemes.slice(0, 2).map((scheme) => (
              <SchemeCard
                key={scheme.id}
                {...scheme}
                onCheckEligibility={() => navigate(`/funding/${scheme.id}`)}
                onApply={() => navigate(`/funding/${scheme.id}/apply`)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<DollarSign className="w-12 h-12" />}
            title="No schemes matched yet"
            description="Complete your financial profile to find relevant funding"
            action={{ label: 'Update Profile', onClick: () => navigate('/profile'), variant: 'primary' }}
          />
        )}
      </section>

      {/* AI Assistant */}
      <section id="ai-assistant" className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary-600" />
          AI Assistant
        </h2>
        <Card>
          <CardContent className="p-4">
            <div className="bg-primary-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">RozgarSetu AI Assistant</p>
                  <p className="text-sm text-gray-500">Ask me anything about your journey</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setChatOpen(true)} className="p-3 rounded-lg bg-white text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors touch-target border border-gray-100">
                  <span className="font-medium">What business can I start?</span>
                </button>
                <button onClick={() => setChatOpen(true)} className="p-3 rounded-lg bg-white text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors touch-target border border-gray-100">
                  <span className="font-medium">How to get funding?</span>
                </button>
                <button onClick={() => setChatOpen(true)} className="p-3 rounded-lg bg-white text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors touch-target border border-gray-100">
                  <span className="font-medium">Next learning step?</span>
                </button>
                <button onClick={() => setChatOpen(true)} className="p-3 rounded-lg bg-white text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors touch-target border border-gray-100">
                  <span className="font-medium">Find buyers for my products</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}