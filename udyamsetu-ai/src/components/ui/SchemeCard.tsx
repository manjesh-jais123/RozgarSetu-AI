import { HTMLAttributes } from 'react';
import { FileText, CheckCircle, Clock, ArrowRight, Badge as BadgeIcon } from 'lucide-react';
import { classNames } from '../../utils/helpers';
import { Badge } from './Badge';
import { Button } from './Button';

interface SchemeCardProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  requiredDocuments: string[];
  applicationProcess: string[];
  matchPercentage: number;
  category: string;
  deadline?: string;
  officialWebsite?: string;
  onApply?: () => void;
  onCheckEligibility?: () => void;
  className?: string;
}

export function SchemeCard({ name, description, eligibility, benefits, requiredDocuments, matchPercentage, category, deadline, onApply, onCheckEligibility, className = '', ...props }: SchemeCardProps) {
  return (
    <div
      className={classNames('card overflow-hidden group', className)}
      role="article"
      aria-labelledby={`scheme-${name}`}
      {...props}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center">
              <BadgeIcon className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <h3 id={`scheme-${name}`} className="font-semibold text-gray-900 line-clamp-1">{name}</h3>
              <span className="text-sm text-gray-500">{category}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-xs text-gray-500">Match Score</div>
            <div className="font-bold text-green-600 text-lg">{matchPercentage}%</div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs text-green-600 mb-1">
              <CheckCircle className="w-3.5 h-3.5" /> Benefits
            </div>
            <div className="font-semibold text-green-700 text-sm">{benefits.length} benefits</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs text-blue-600 mb-1">
              <FileText className="w-3.5 h-3.5" /> Documents
            </div>
            <div className="font-semibold text-blue-700 text-sm">{requiredDocuments.length} needed</div>
          </div>
        </div>

        {deadline && (
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-orange-600 font-medium">Deadline: {deadline}</span>
          </div>
        )}

        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-2">Eligibility Highlights</div>
          <ul className="space-y-1.5">
            {eligibility.slice(0, 3).map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-2">Why this matches you?</div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            <Badge variant="success" size="sm">Location Match</Badge>
            <Badge variant="primary" size="sm">Skill Match</Badge>
            <Badge variant="warning" size="sm">Budget Match</Badge>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          {onCheckEligibility && (
            <Button variant="outline" size="sm" onClick={onCheckEligibility}>
              Check Eligibility
            </Button>
          )}
          {onApply && (
            <Button variant="primary" size="sm" onClick={onApply} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Apply Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}