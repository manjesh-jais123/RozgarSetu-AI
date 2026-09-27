import { HTMLAttributes } from 'react';
import { classNames } from '../../utils/helpers';

interface LoadingStateProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'spinner' | 'skeleton' | 'dots';
  fullScreen?: boolean;
  className?: string;
  count?: number;
}

export function LoadingState({ size = 'md', text, variant = 'spinner', fullScreen = false, className, ...props }: LoadingStateProps) {
  const sizeClasses = {
    spinner: { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' },
    dots: { sm: 'w-1.5 h-1.5', md: 'w-3 h-3', lg: 'w-4 h-4' },
  };

  if (variant === 'spinner') {
    return (
      <div
        className={classNames(
          'flex flex-col items-center justify-center gap-3',
          fullScreen ? 'fixed inset-0 bg-white/80 z-50' : 'py-8',
          className
        )}
        {...props}
        role="status"
        aria-live="polite"
        aria-label={text || 'Loading'}
      >
        <svg className={sizeClasses.spinner[size]} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path
            className="opacity-75"
            d="M12 2C12 2 12 2 12 2"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 12 12"
              to="360 12 12"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
        {text && <p className="text-sm text-gray-500">{text}</p>}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div
        className={classNames(
          'flex items-center justify-center gap-1.5',
          fullScreen ? 'fixed inset-0 bg-white/80 z-50 flex-col' : '',
          text && 'flex-col',
          className
        )}
        {...props}
        role="status"
        aria-live="polite"
        aria-label={text || 'Loading'}
      >
        <div className="flex gap-1.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={classNames(
                'rounded-full bg-primary-600 animate-bounce',
                sizeClasses.dots[size]
              )}
              style={{ animationDelay: `${i * 150}ms` }}
              aria-hidden="true"
            />
          ))}
        </div>
        {text && <p className="text-sm text-gray-500 mt-3">{text}</p>}
      </div>
    );
  }

  return (
    <div
      className={classNames('space-y-3', fullScreen ? 'fixed inset-0 bg-white/80 z-50 p-8' : 'p-8', className)}
      {...props}
      role="status"
      aria-live="polite"
      aria-label={text || 'Loading'}
    >
      <div className="space-y-3">
        <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
      </div>
      {text && <p className="text-sm text-gray-500 text-center">{text}</p>}
    </div>
  );
}

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4" role="status" aria-label="Loading cards">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-1/3" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 5 }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 animate-pulse">
          <div className="w-10 h-10 bg-gray-100 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-1/3" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}