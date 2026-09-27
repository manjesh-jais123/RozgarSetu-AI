import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecommendedOpportunities, useOpportunityCategories } from '../hooks/useQueries';
import { useAuthStore } from '../hooks/useStores';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { OpportunityCard } from '../components/ui/OpportunityCard';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { 
  TrendingUp, Search, Filter, X, DollarSign, 
  Wrench, Brain, ArrowRight 
} from 'lucide-react';

const DIFFICULTY_OPTIONS = [
  { value: '', label: 'All Difficulties' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export function Explore() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [budget, setBudget] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [skill, setSkill] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { data: opportunities, isLoading, refetch } = useRecommendedOpportunities(user?.id || '');
  const { data: categories } = useOpportunityCategories();

  const handleSearch = () => {
    refetch();
  };

  const clearFilters = () => {
    setBudget('');
    setDifficulty('');
    setSkill('');
    refetch();
  };

  const hasActiveFilters = budget || difficulty || skill;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">What Can I Do?</h1>
        <p className="text-primary-100 mt-1">Discover opportunities based on your skills, budget, and interests</p>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="e.g., I have ₹50,000 and want to start candle business"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <Button
              variant="primary"
              onClick={handleSearch}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Find
            </Button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={showFilters ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={<Filter className="w-4 h-4" />}
              >
                Filters {hasActiveFilters && <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full">3</span>}
              </Button>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} leftIcon={<X className="w-4 h-4" />}>
                  Clear
                </Button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
              <Input
                label="Budget (₹)"
                type="number"
                placeholder="e.g., 50000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                leftIcon={<DollarSign className="w-5 h-5" />}
              />
              <Select
                label="Difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                options={DIFFICULTY_OPTIONS}
                placeholder="All Difficulties"
              />
              <Input
                label="Skill"
                type="text"
                placeholder="e.g., tailoring"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                leftIcon={<Wrench className="w-5 h-5" />}
              />
              <Select
                label="Category"
                value=""
                onChange={() => {}}
                options={[
                  { value: '', label: 'All Categories' },
                  ...(categories || []).map(c => ({ value: c, label: c })),
                ]}
                placeholder="All Categories"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Budget Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Quick Budget:</span>
        {[10000, 25000, 50000, 100000, 200000].map((amt) => (
          <Button
            key={amt}
            variant="outline"
            size="sm"
            onClick={() => { setBudget(String(amt)); handleSearch(); }}
            className="whitespace-nowrap"
          >
            ₹{amt.toLocaleString()}
          </Button>
        ))}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Opportunities</h2>
        {hasActiveFilters && (
          <Badge variant="primary" className="gap-1">
            <Filter className="w-3.5 h-3.5" />
            Filters Applied
          </Badge>
        )}
      </div>

      {isLoading ? (
        <LoadingState variant="skeleton" count={6} />
      ) : opportunities && opportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.map((opp) => (
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
          title="No opportunities found"
          description="Try adjusting your filters or search terms"
          action={{ label: 'Clear Filters', onClick: clearFilters, variant: 'outline' }}
        />
      )}

      {/* AI Recommendation Section */}
      <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-100">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Get Personalized AI Recommendations</h3>
              <p className="text-gray-600 mt-1">Answer a few questions and our AI will find the best opportunities for your profile.</p>
              <Button variant="primary" size="sm" onClick={() => navigate('/onboarding')}>
                Start AI Assessment
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}