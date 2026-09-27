import { forwardRef } from 'react';
import { classNames } from '../../utils/helpers';

interface StepperProps {
  steps: Array<{ id: string; label: string; description?: string; icon?: React.ReactNode }>;
  currentStep: number;
  onStepClick?: (index: number) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'numbered';
  className?: string;
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  ({ steps, currentStep, onStepClick, orientation = 'horizontal', variant = 'default', className }, ref) => {
    return (
      <div ref={ref} className={classNames('w-full', className)} role="navigation" aria-label="Progress steps">
        <ol className={classNames('flex', orientation === 'horizontal' ? 'items-center' : 'flex-col')}>
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isLast = index === steps.length - 1;

            return (
              <li key={step.id} className={classNames('relative flex', orientation === 'horizontal' ? 'flex-1' : 'w-full')}>
                <div className={classNames('flex items-center', orientation === 'horizontal' ? 'flex-col' : 'flex-row')}>
                  <button
                    onClick={() => onStepClick?.(index)}
                    disabled={index > currentStep}
                    className={classNames(
                      'relative z-10 flex items-center justify-center transition-all duration-200',
                      orientation === 'horizontal' ? 'w-full' : 'w-10 h-10 flex-shrink-0'
                    )}
                    aria-current={isCurrent ? 'step' : undefined}
                    aria-disabled={index > currentStep}
                  >
                    <div
                      className={classNames(
                        'flex items-center justify-center rounded-full transition-all duration-200',
                        orientation === 'horizontal' ? 'w-10 h-10' : 'w-10 h-10',
                        isCompleted
                          ? 'bg-primary-600 text-white'
                          : isCurrent
                          ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                          : 'bg-gray-100 text-gray-400'
                      )}
                    >
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : variant === 'numbered' ? (
                        <span className="font-semibold">{index + 1}</span>
                      ) : (
                        step.icon
                      )}
                    </div>
                    <div className={classNames('text-center', orientation === 'horizontal' ? 'mt-2' : 'ml-3')}>
                      <p className={classNames('font-medium text-sm', isCurrent || isCompleted ? 'text-gray-900' : 'text-gray-500')}>
                        {step.label}
                      </p>
                      {step.description && (
                        <p className={classNames('text-xs', isCurrent || isCompleted ? 'text-gray-500' : 'text-gray-400')}>
                          {step.description}
                        </p>
                      )}
                    </div>
                  </button>
                  {!isLast && (
                    <div
                      className={classNames(
                        'absolute z-0 transition-colors duration-200',
                        orientation === 'horizontal'
                          ? 'top-5 left-1/2 w-full h-0.5 -translate-x-1/2'
                          : 'left-5 top-1/2 h-full w-0.5 -translate-y-1/2'
                      )}
                    >
                      <div
                        className={classNames(
                          'h-full rounded-full transition-colors duration-200',
                          isCompleted ? 'bg-primary-600' : 'bg-gray-100'
                        )}
                        style={{ width: orientation === 'horizontal' ? '50%' : '100%', height: orientation === 'horizontal' ? '100%' : '50%' }}
                      />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }
);

Stepper.displayName = 'Stepper';