import { forwardRef, HTMLAttributes } from 'react';
import { classNames } from '../../utils/helpers';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', hover = false, className, children, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-white border border-gray-100 shadow-sm',
      outlined: 'bg-white border border-gray-200',
      elevated: 'bg-white border border-gray-100 shadow-lg',
    };

    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={classNames(
          'rounded-xl transition-shadow duration-200',
          variantClasses[variant],
          paddingClasses[padding],
          hover && 'hover:shadow-md',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={classNames('mb-4', className)} {...props}>{children}</div>
  )
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3 ref={ref} className={classNames('text-lg font-semibold text-gray-900', className)} {...props}>{children}</h3>
  )
);

CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={classNames('mt-1 text-sm text-gray-500', className)} {...props}>{children}</p>
  )
);

CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={classNames('', className)} {...props}>{children}</div>
  )
);

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={classNames('mt-4 pt-4 border-t border-gray-100 flex items-center gap-3', className)} {...props}>{children}</div>
  )
);

CardFooter.displayName = 'CardFooter';