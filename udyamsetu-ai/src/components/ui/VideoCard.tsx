import { HTMLAttributes } from 'react';
import { Play, Clock, CheckCircle, Lock } from 'lucide-react';
import { classNames } from '../../utils/helpers';
import { Badge } from './Badge';
import { ProgressBar } from './ProgressBar';

interface VideoCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  thumbnail: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed?: boolean;
  progress?: number;
  locked?: boolean;
  onPlay?: () => void;
}

export function VideoCard({ title, thumbnail, duration, difficulty, completed = false, progress = 0, locked = false, onPlay, className, ...props }: VideoCardProps) {
  const difficultyVariant = difficulty === 'easy' ? 'success' : difficulty === 'medium' ? 'warning' : 'danger';
  const difficultyLabel = difficulty === 'easy' ? 'Easy' : difficulty === 'medium' ? 'Medium' : 'Hard';

  return (
    <div
      className={classNames('card overflow-hidden group cursor-pointer', className)}
      onClick={onPlay}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPlay?.();
        }
      }}
      aria-label={`Watch: ${title}`}
      {...props}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {locked ? (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Play className="w-6 h-6 text-primary-600 ml-1" />
            </div>
          </div>
        )}
        
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <Badge variant={difficultyVariant} size="sm" className="bg-black/70 text-white">
            {difficultyLabel}
          </Badge>
          <Badge variant="gray" size="sm" className="bg-black/70 text-white">
            <Clock className="w-3 h-3 mr-1" />
            {duration}
          </Badge>
        </div>
        
        {completed && (
          <div className="absolute top-2 right-2">
            <CheckCircle className="w-6 h-6 text-green-400 drop-shadow" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{title}</h3>
        {progress > 0 && !completed && (
          <div className="mt-2">
            <ProgressBar value={progress} size="sm" showLabel={false} />
          </div>
        )}
        {progress > 0 && !completed && (
          <p className="mt-1.5 text-xs text-gray-500">{progress}% complete</p>
        )}
      </div>
    </div>
  );
}