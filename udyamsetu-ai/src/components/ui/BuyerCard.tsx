import { HTMLAttributes } from 'react';
import { Building2, MapPin, Package, Users, ArrowRight, CheckCircle, Phone, Mail, DollarSign } from 'lucide-react';
import { classNames } from '../../utils/helpers';
import { Badge } from './Badge';
import { Button } from './Button';

interface BuyerCardProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  type: 'individual' | 'business' | 'wholesaler' | 'retailer' | 'exporter';
  location: string;
  requiredProduct: string;
  quantity: number;
  budget: number;
  matchPercentage: number;
  contactInfo?: { phone?: string; email?: string; address?: string };
  verified: boolean;
  onConnect?: () => void;
  onContact?: () => void;
  className?: string;
}

export function BuyerCard({ name, type, location, requiredProduct, quantity, budget, matchPercentage, contactInfo, verified, onConnect, onContact, className = '', ...props }: BuyerCardProps) {
  const typeLabels: Record<string, string> = {
    individual: 'Individual Buyer',
    business: 'Business',
    wholesaler: 'Wholesaler',
    retailer: 'Retailer',
    exporter: 'Exporter',
  };

  return (
    <div
      className={classNames('card overflow-hidden group', className)}
      role="article"
      aria-label={`Buyer: ${name}`}
      {...props}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-1">{name}</h3>
              <span className="text-xs text-gray-500">{typeLabels[type]}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-xs text-gray-500">Match</div>
            <div className="font-bold text-green-600 text-lg">{matchPercentage}%</div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            {location}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="w-4 h-4 text-gray-400" />
            Needs: {requiredProduct}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-gray-400" />
            Quantity: {quantity.toLocaleString()} units
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4 text-gray-400" />
            Budget: ₹{budget.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {verified ? (
            <Badge variant="success" size="sm">
              <CheckCircle className="w-3 h-3 mr-1" /> Verified
            </Badge>
          ) : (
            <Badge variant="warning" size="sm">Pending Verification</Badge>
          )}
          <Badge variant="primary" size="sm">{typeLabels[type]}</Badge>
        </div>

        {contactInfo && (
          <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
            {contactInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" /> {contactInfo.phone}
              </span>
            )}
            {contactInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" /> {contactInfo.email}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          {onConnect && (
            <Button variant="primary" size="sm" onClick={onConnect} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Connect
            </Button>
          )}
          {onContact && (
            <Button variant="outline" size="sm" onClick={onContact}>
              Contact
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}