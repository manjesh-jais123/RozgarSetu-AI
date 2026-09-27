import { HTMLAttributes } from 'react';
import { Edit, Trash2, Eye, Package, ArrowRight, DollarSign, Tag } from 'lucide-react';
import { classNames } from '../../utils/helpers';
import { Badge } from './Badge';
import { Button } from './Button';

interface ProductCardProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  description: string;
  category: string;
  materials: string[];
  dimensions: string;
  price: number;
  minimumOrderQuantity: number;
  productionCapacity: number;
  images: string[];
  tags: string[];
  status: 'draft' | 'active' | 'inactive';
  onEdit?: () => void;
  onDelete?: () => void;
  onPreview?: () => void;
  onOrder?: () => void;
  className?: string;
}

export function ProductCard({ name, description, category, materials, dimensions: _dimensions, price, minimumOrderQuantity, productionCapacity, images, tags, status, onEdit, onDelete, onPreview, onOrder, className = '', ...props }: ProductCardProps) {
  const statusVariant = status === 'active' ? 'success' : status === 'draft' ? 'warning' : 'gray';
  void _dimensions;
  const statusLabel = status === 'active' ? 'Active' : status === 'draft' ? 'Draft' : 'Inactive';

  return (
    <div
      className={classNames('card overflow-hidden group', className)}
      role="article"
      aria-label={`Product: ${name}`}
      {...props}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={images[0]}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={statusVariant} size="sm">
            {statusLabel}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="primary" size="sm">
            <Tag className="w-3 h-3 mr-1" />
            {category}
          </Badge>
        </div>
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onPreview && (
            <button
              onClick={onPreview}
              className="p-2 rounded-lg bg-white/90 text-gray-700 hover:bg-white transition-colors touch-target"
              aria-label="Preview"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 rounded-lg bg-white/90 text-gray-700 hover:bg-white transition-colors touch-target"
              aria-label="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 rounded-lg bg-white/90 text-red-600 hover:bg-red-50 transition-colors touch-target"
              aria-label="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{name}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-gray-500">Price</div>
            <div className="font-bold text-primary-600">₹{price.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">MOQ</div>
            <div className="font-semibold text-gray-900">{minimumOrderQuantity}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Package className="w-3.5 h-3.5" />
            Capacity: {productionCapacity}
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" />
            {materials.length} materials
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.slice(0, 3).map((tag, i) => (
            <Badge key={i} variant="gray" size="sm">{tag}</Badge>
          ))}
        </div>

        {onOrder && status === 'active' && (
          <Button variant="primary" size="sm" onClick={onOrder} className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Request Order
          </Button>
        )}
      </div>
    </div>
  );
}