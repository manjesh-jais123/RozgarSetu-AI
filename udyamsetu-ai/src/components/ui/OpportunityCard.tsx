import { HTMLAttributes } from 'react';
import { DollarSign, Clock, TrendingUp, MapPin, Users, ArrowRight } from 'lucide-react';
import { classNames } from '../../utils/helpers';
import { Badge } from './Badge';
import { Button } from './Button';

interface OpportunityCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  category: string;
  requiredInvestment: { min: number; max: number };
  requiredSkills: string[];
  learningDuration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  incomeScenarios: { conservative: number; expected: number; optimistic: number; currency: string; period: string };
  customerSegments: string[];
  matchPercentage: number;
  tags: string[];
  onExplore?: () => void;
  onLearn?: () => void;
  className?: string;
}

export function OpportunityCard({ title, description, category, requiredInvestment, requiredSkills, learningDuration, difficulty, incomeScenarios, customerSegments, matchPercentage, tags, onExplore, onLearn, className = '', ...props }: OpportunityCardProps) {
  const difficultyVariant = difficulty === 'easy' ? 'success' : difficulty === 'medium' ? 'warning' : 'danger';
  const difficultyLabel = difficulty === 'easy' ? 'Easy' : difficulty === 'medium' ? 'Medium' : 'Hard';

  return (
    <div
      className={classNames('card overflow-hidden group', className)}
      role="article"
      aria-labelledby={`opp-${title}`}
      {...props}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 id={`opp-${title}`} className="font-semibold text-gray-900 line-clamp-1">{title}</h3>
              <span className="text-sm text-gray-500">{category}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-right">
              <div className="text-xs text-gray-500">Match Score</div>
              <div className="font-bold text-green-600 text-lg">{matchPercentage}%</div>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
              <DollarSign className="w-3.5 h-3.5" /> Investment
            </div>
            <div className="font-semibold text-gray-900 text-sm">
              ₹{requiredInvestment.min.toLocaleString()} - ₹{requiredInvestment.max.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
              <Clock className="w-3.5 h-3.5" /> Learning Time
            </div>
            <div className="font-semibold text-gray-900 text-sm">{learningDuration}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Badge variant={difficultyVariant} size="sm">
            {difficultyLabel}
          </Badge>
          <Badge variant="primary" size="sm">
            <MapPin className="w-3 h-3 mr-1" />
            {customerSegments.length} segments
          </Badge>
          {tags.slice(0, 2).map((tag, i) => (
            <Badge key={i} variant="gray" size="sm">{tag}</Badge>
          ))}
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 mb-4">
          <div className="text-xs text-gray-500 mb-2">Estimated Monthly Income (INR)</div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-xs text-gray-500">Conservative</div>
              <div className="font-semibold text-gray-700">₹{incomeScenarios.conservative.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Expected</div>
              <div className="font-semibold text-green-600">₹{incomeScenarios.expected.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Optimistic</div>
              <div className="font-semibold text-blue-600">₹{incomeScenarios.optimistic.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">Skills needed:</span>
          <div className="flex flex-wrap gap-1">
            {requiredSkills.slice(0, 3).map((skill, i) => (
              <Badge key={i} variant="gray" size="sm">{skill}</Badge>
            ))}
            {requiredSkills.length > 3 && (
              <Badge variant="gray" size="sm">+{requiredSkills.length - 3} more</Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          {onExplore && (
            <Button variant="primary" size="sm" onClick={onExplore} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore
            </Button>
          )}
          {onLearn && (
            <Button variant="outline" size="sm" onClick={onLearn}>
              Learn Skills
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}