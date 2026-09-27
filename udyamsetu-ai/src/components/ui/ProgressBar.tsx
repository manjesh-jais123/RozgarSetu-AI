import { forwardRef, HTMLAttributes } from 'react';
import { classNames } from '../../utils/helpers';

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  striped?: boolean;
  animated?: boolean;
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ value, max = 100, size = 'md', showLabel = false, label, variant = 'primary', striped = false, animated = false, className, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const sizeClasses = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    };

    const variantClasses = {
      primary: 'bg-primary-600',
      secondary: 'bg-secondary-600',
      success: 'bg-green-600',
      warning: 'bg-yellow-500',
    };

    return (
      <div ref={ref} className={classNames('w-full', className)} {...props}>
        {(showLabel || label) && (
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="font-medium text-gray-700">{label || 'Progress'}</span>
            <span className="text-gray-500">{Math.round(percentage)}%</span>
          </div>
        )}
        <div className={classNames('w-full bg-gray-100 rounded-full overflow-hidden', sizeClasses[size])}>
          <div
            className={classNames(
              'h-full rounded-full transition-all duration-500 ease-out',
              variantClasses[variant],
              striped && 'bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[size:1rem_1rem]',
              animated && 'animate-[progress-bar-stripes_1s_linear_infinite]'
            )}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-label={label || 'Progress'}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

export const CircularProgress = forwardRef<HTMLDivElement, { value: number; max?: number; size?: number; strokeWidth?: number; variant?: 'primary' | 'secondary' | 'success' | 'warning'; showLabel?: boolean; label?: string; className?: string }>(
  ({ value, max = 100, size = 60, strokeWidth = 4, variant = 'primary', showLabel = true, label, className }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const variantClasses = {
      primary: 'text-primary-600',
      secondary: 'text-secondary-600',
      success: 'text-green-600',
      warning: 'text-yellow-500',
    };

    return (
      <div ref={ref} className={classNames('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            className="text-gray-100"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className={classNames('transition-all duration-500 ease-out', variantClasses[variant])}
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-900">{label || `${Math.round(percentage)}%`}</span>
          </div>
        )}
      </div>
    );
  }
);

CircularProgress.displayName = 'CircularProgress';