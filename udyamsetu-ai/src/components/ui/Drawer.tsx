import { useEffect, forwardRef } from 'react';
import { classNames } from '../../utils/helpers';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'full';
  closeOnOverlayClick?: boolean;
}

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  ({ isOpen, onClose, title, description, children, position = 'right', size = 'md', closeOnOverlayClick = true }, ref) => {
    useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
      sm: position === 'bottom' ? 'h-[30vh] max-h-[30vh]' : 'w-64',
      md: position === 'bottom' ? 'h-[50vh] max-h-[50vh]' : 'w-80',
      lg: position === 'bottom' ? 'h-[70vh] max-h-[70vh]' : 'w-96',
      full: position === 'bottom' ? 'h-[90vh] max-h-[90vh]' : 'w-full max-w-md',
    };

    const positionClasses = {
      left: 'left-0 top-0 h-full',
      right: 'right-0 top-0 h-full',
      bottom: 'left-0 right-0 bottom-0',
    };

    return (
      <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby={title ? 'drawer-title' : undefined} aria-describedby={description ? 'drawer-description' : undefined}>
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity" 
          aria-hidden="true" 
          onClick={closeOnOverlayClick ? onClose : undefined} 
        />
        <div
          ref={ref}
          className={classNames(
            'fixed bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col',
            positionClasses[position],
            sizeClasses[size]
          )}
        >
          {(title || description) && (
            <div className="flex items-start justify-between p-4 border-b border-gray-100 flex-shrink-0">
              <div>
                {title && (
                  <h2 id="drawer-title" className="text-lg font-semibold text-gray-900">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id="drawer-description" className="mt-1 text-sm text-gray-500">
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors touch-target"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </div>
      </div>
    );
  }
);

Drawer.displayName = 'Drawer';
