import { HTMLAttributes } from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { classNames } from '../../utils/helpers';

interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  change?: { value: number; type: 'increase' | 'decrease' | 'neutral' };
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  showArrow?: boolean;
  className?: string;
}

export function StatCard({ label, value, change, icon, iconBg = 'bg-primary-100', iconColor = 'text-primary-600', trend, subtitle, showArrow = false, className, ...props }: StatCardProps) {

  return (
    <div
      className={classNames('card p-5', className)}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-2 text-sm">
              <>
                {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                {trend === 'neutral' && <Minus className="w-4 h-4 text-gray-400" />}
              </>
              <span className={change.type === 'increase' ? 'text-green-600' : change.type === 'decrease' ? 'text-red-600' : 'text-gray-500'}>
                {change.value}%
              </span>
            </div>
          )}
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className={classNames('w-11 h-11 rounded-xl flex items-center justify-center', iconBg)}>
            <span className={iconColor}>{icon}</span>
          </div>
        )}
      </div>
      {showArrow && (
        <div className="mt-3 flex items-center text-primary-600 text-sm font-medium">
          View details
          <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      )}
    </div>
  );
}