import { HTMLAttributes } from 'react';
import { BookOpen, Clock, Users, Star, ChevronRight } from 'lucide-react';
import { classNames } from '../../utils/helpers';
import { Badge } from './Badge';
import { ProgressBar } from './ProgressBar';

interface CourseCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
  progress: number;
  totalLessons?: number;
  completedLessons?: number;
  thumbnail?: string;
  rating?: number;
  studentCount?: number;
  onContinue?: () => void;
}

export function CourseCard({ title, description, category, difficulty, estimatedDuration, progress, totalLessons, completedLessons, thumbnail, rating, studentCount, onContinue, className, ...props }: CourseCardProps) {
  const difficultyVariant = difficulty === 'beginner' ? 'success' : difficulty === 'intermediate' ? 'warning' : 'danger';
  const difficultyLabel = difficulty === 'beginner' ? 'Beginner' : difficulty === 'intermediate' ? 'Intermediate' : 'Advanced';

  return (
    <div
      className={classNames('card overflow-hidden group cursor-pointer', className)}
      onClick={onContinue}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onContinue?.();
        }
      }}
      aria-label={`Continue learning: ${title}`}
      {...props}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge variant={difficultyVariant} size="sm">
            {difficultyLabel}
          </Badge>
          <Badge variant="gray" size="sm" className="bg-black/70 text-white">
            <Clock className="w-3 h-3 mr-1" />
            {estimatedDuration}
          </Badge>
        </div>
        
        <div className="absolute top-3 right-3">
          <Badge variant="primary" size="sm" className="bg-black/70 text-white">
            {category}
          </Badge>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {studentCount || 0}
          </span>
          {rating && (
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {rating}
            </span>
          )}
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {completedLessons}/{totalLessons}
          </span>
        </div>
        
        <div className="mt-2">
          <ProgressBar value={progress} size="sm" showLabel={false} />
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-primary-600">
            {completedLessons} of {totalLessons} lessons done
          </span>
          <span className="inline-flex items-center text-primary-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
            Continue
            <ChevronRight className="w-4 h-4 ml-1" />
          </span>
        </div>
      </div>
    </div>
  );
}