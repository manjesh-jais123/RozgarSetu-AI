import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearningPaths, useRecommendedLearningPaths } from '../hooks/useQueries';
import { useAuthStore } from '../hooks/useStores';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { X } from 'lucide-react';
import { CourseCard } from '../components/ui/CourseCard';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { BookOpen, TrendingUp, Target, Users, Filter } from 'lucide-react';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'Handicrafts & Artisans', label: 'Handicrafts & Artisans' },
  { value: 'Food Processing', label: 'Food Processing' },
  { value: 'Textile & Tailoring', label: 'Textile & Tailoring' },
  { value: 'Agriculture & Farming', label: 'Agriculture & Farming' },
  { value: 'Bamboo & Cane', label: 'Bamboo & Cane' },
];

const DIFFICULTY_OPTIONS = [
  { value: '', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export function Learn() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { data: allPaths, isLoading: allLoading } = useLearningPaths();
  const { data: recommendedPaths, isLoading: recLoading } = useRecommendedLearningPaths(user?.id || '');

  const filteredPaths = allPaths?.filter(path => {
    const catMatch = !selectedCategory || path.category === selectedCategory;
    const diffMatch = !selectedDifficulty || path.difficulty === selectedDifficulty;
    return catMatch && diffMatch;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary-600 to-primary-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Learn & Build</h1>
        <p className="text-secondary-100 mt-1">Personalized learning paths to build your skills and business</p>
      </div>

      {/* Recommended Section */}
      {recommendedPaths && recommendedPaths.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-secondary-600" />
              Recommended for You
            </h2>
          </div>
          {recLoading ? (
            <LoadingState variant="skeleton" count={2} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedPaths.slice(0, 3).map((lp) => (
                <CourseCard
                  key={lp.id}
                  title={lp.title}
                  description={lp.description}
                  category={lp.category}
                  difficulty={lp.difficulty}
                  estimatedDuration={lp.estimatedDuration}
                  progress={lp.progress}
                  thumbnail={lp.thumbnail}
                  totalLessons={lp.lessons.length}
                  completedLessons={lp.lessons.filter(l => l.completed).length}
                  onContinue={() => navigate(`/learn/${lp.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">All Courses</h3>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} leftIcon={<Filter className="w-4 h-4" />}>
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                label="Category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={CATEGORIES}
              />
              <Select
                label="Difficulty"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                options={DIFFICULTY_OPTIONS}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Courses */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">All Courses</h2>
        {(selectedCategory || selectedDifficulty) && (
          <Badge variant="primary" onClick={() => { setSelectedCategory(''); setSelectedDifficulty(''); }}>
            <X className="w-3.5 h-3.5" /> Clear Filters
          </Badge>
        )}
      </div>

      {allLoading ? (
        <LoadingState variant="skeleton" count={6} />
      ) : filteredPaths && filteredPaths.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPaths.map((lp) => (
            <CourseCard
              key={lp.id}
              title={lp.title}
              description={lp.description}
              category={lp.category}
              difficulty={lp.difficulty}
              estimatedDuration={lp.estimatedDuration}
              progress={lp.progress}
              thumbnail={lp.thumbnail}
              totalLessons={lp.lessons.length}
              completedLessons={lp.lessons.filter(l => l.completed).length}
              onContinue={() => navigate(`/learn/${lp.id}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<BookOpen className="w-12 h-12" />}
          title="No courses found"
          description="Try adjusting your filters"
          action={{ label: 'Clear Filters', onClick: () => { setSelectedCategory(''); setSelectedDifficulty(''); }, variant: 'outline' }}
        />
      )}

      {/* Learning Path Benefits */}
      <Card className="bg-gradient-to-r from-secondary-50 to-primary-50 border-secondary-100">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Why Learn with RozgarSetu AI?</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center mx-auto mb-2">
                <BookOpen className="w-6 h-6 text-secondary-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Video Lessons</p>
              <p className="text-xs text-gray-500">Step-by-step videos in your language</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Practical Projects</p>
              <p className="text-xs text-gray-500">Hands-on exercises with real examples</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-2">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Assessments</p>
              <p className="text-xs text-gray-500">Quizzes to test your understanding</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Community</p>
              <p className="text-xs text-gray-500">Connect with fellow learners</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}