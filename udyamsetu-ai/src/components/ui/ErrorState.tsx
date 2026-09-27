
import { classNames } from '../../utils/helpers';
import { Button } from './Button';
import { AlertTriangle, RefreshCw, WifiOff, Server } from 'lucide-react';

export function ErrorState({ 
  title, 
  message, 
  type = 'error', 
  onRetry, 
  onAction, 
  size = 'md', 
  className, 
  ...props 
}) {
  const icons = {
    error: <AlertTriangle className="w-12 h-12 text-red-500" />,
    network: <WifiOff className="w-12 h-12 text-orange-500" />,
    server: <Server className="w-12 h-12 text-purple-500" />,
    'not-found': <AlertTriangle className="w-12 h-12 text-gray-500" />,
    unauthorized: <AlertTriangle className="w-12 h-12 text-blue-500" />,
  };

  const defaultMessages = {
    error: { title: 'Something went wrong', message: 'We encountered an unexpected error. Please try again.' },
    network: { title: 'Connection lost', message: 'Please check your internet connection and try again.' },
    server: { title: 'Server error', message: 'Our servers are having trouble. Please try again in a moment.' },
    'not-found': { title: 'Not found', message: 'The page you\'re looking for doesn\'t exist or has been moved.' },
    unauthorized: { title: 'Access denied', message: 'You don\'t have permission to access this page. Please log in.' },
  };

  const defaultText = defaultMessages[type];
  const displayTitle = title || defaultText.title;
  const displayMessage = message || defaultText.message;

  const sizeClasses = {
    sm: 'py-6 px-4',
    md: 'py-12 px-6',
    lg: 'py-16 px-8',
  };

  return (
    <div
      className={classNames('flex flex-col items-center text-center', sizeClasses[size], className)}
      {...props}
      role="alert"
    >
      <div className="mb-4">{icons[type]}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{displayTitle}</h3>
      <p className="text-gray-500 max-w-sm mb-6">{displayMessage}</p>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        {onRetry && (
          <Button variant="primary" onClick={onRetry} className="w-full sm:w-auto" leftIcon={<RefreshCw className="w-4 h-4" />}>
            Try Again
          </Button>
        )}
        {onAction && (
          <Button variant="outline" onClick={onAction.onClick} className="w-full sm:w-auto">
            {onAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}