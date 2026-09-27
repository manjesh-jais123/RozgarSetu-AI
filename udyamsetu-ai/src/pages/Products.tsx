import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useQueries';
import { useAuthStore } from '../hooks/useStores';
import { ProductCard } from '../components/ui/ProductCard';

import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { Plus, Package, X } from 'lucide-react';

const PRODUCT_CATEGORIES = ['Handicrafts', 'Food Products', 'Textiles', 'Bamboo Products', 'Pottery', 'Woodwork', 'Organic Produce', 'Spices & Condiments', 'Personal Care', 'Home Decor', 'Accessories', 'Stationery'];

export function Products() {
  const { user } = useAuthStore();
  void user;
  const { addToast } = useToast();
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '', description: '', category: '', materials: '', dimensions: '',
    price: '', minimumOrderQuantity: '', productionCapacity: '', tags: '', images: '', status: 'draft' as const
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', category: '', materials: '', dimensions: '', price: '', minimumOrderQuantity: '', productionCapacity: '', tags: '', images: '', status: 'draft' });
    setEditingProduct(null);
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const productFormData = {
    ...formData,
    materials: formData.materials ? formData.materials.split('\n') : [],
    tags: formData.tags ? formData.tags.split('\n') : [],
    images: formData.images ? formData.images.split('\n') : [],
    price: Number(formData.price) || 0,
    minimumOrderQuantity: Number(formData.minimumOrderQuantity) || 1,
    productionCapacity: Number(formData.productionCapacity) || 0,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, data: productFormData });
        addToast({ type: 'success', title: 'Updated', message: 'Product updated successfully' });
      } else {
        await createProduct.mutateAsync({ ...productFormData, status: 'draft' });
        addToast({ type: 'success', title: 'Created', message: 'Product added successfully' });
      }
      resetForm();
      setShowForm(false);
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Failed to save product' });
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name, description: product.description, category: product.category,
      materials: Array.isArray(product.materials) ? product.materials.join('\n') : '',
      dimensions: product.dimensions,
      price: String(product.price), minimumOrderQuantity: String(product.minimumOrderQuantity),
      productionCapacity: String(product.productionCapacity), tags: Array.isArray(product.tags) ? product.tags.join('\n') : '',
      images: Array.isArray(product.images) ? product.images.join('\n') : '',
      status: product.status || 'draft',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this product?')) {
      try {
        await deleteProduct.mutateAsync(id);
        addToast({ type: 'success', title: 'Deleted', message: 'Product removed' });
        } catch {
        addToast({ type: 'error', title: 'Error', message: 'Failed to delete' });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-500">Manage your product catalog</p>
        </div>
        <Button onClick={openCreateForm} leftIcon={<Plus className="w-4 h-4" />}>Add Product</Button>
      </div>

      {isLoading ? (
        <LoadingState variant="skeleton" count={6} />
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} {...product}
              onEdit={() => handleEdit(product)}
              onDelete={() => handleDelete(product.id)}
              onPreview={() => addToast({ type: 'info', title: 'Preview', message: 'Product preview coming soon' })}
              onOrder={() => addToast({ type: 'info', title: 'Order', message: 'Order request sent' })}
            />
          ))}
        </div>
      ) : (
        <EmptyState icon={<Package className="w-12 h-12" />} title="No products yet" description="Add your first product to start selling" action={{ label: 'Add Product', onClick: () => { resetForm(); setShowForm(true); }, variant: 'primary' }} />
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2><Button variant="ghost" size="sm" onClick={() => { setShowForm(false); resetForm(); }}><X className="w-5 h-5" /></Button></div></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input label="Product Name" placeholder="Enter product name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <Textarea label="Description" placeholder="Describe your product" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              <Select label="Category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} options={PRODUCT_CATEGORIES.map(c => ({value: c, label: c}))} placeholder="Select category" />
              <Textarea label="Materials (one per line)" placeholder="Cotton fabric\nThread\nDyes" value={formData.materials} onChange={(e) => setFormData({...formData, materials: e.target.value})} />
              <Input label="Dimensions" placeholder="e.g., 16 x 16 inches" value={formData.dimensions} onChange={(e) => setFormData({...formData, dimensions: e.target.value})} />
              <div className="grid grid-cols-3 gap-4"><Input label="Price (₹)" type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} /><Input label="MOQ" type="number" value={formData.minimumOrderQuantity} onChange={(e) => setFormData({...formData, minimumOrderQuantity: e.target.value})} /><Input label="Capacity/month" type="number" value={formData.productionCapacity} onChange={(e) => setFormData({...formData, productionCapacity: e.target.value})} /></div>
              <Textarea label="Tags (one per line)" placeholder="Handmade\nEco-friendly\nGift" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} />
              <Textarea label="Image URLs (one per line)" placeholder="https://example.com/image1.jpg" value={formData.images} onChange={(e) => setFormData({...formData, images: e.target.value})} />
              <div className="flex gap-3 pt-4"><Button variant="outline" type="button" onClick={() => { setShowForm(false); resetForm(); }} className="flex-1">Cancel</Button><Button variant="primary" type="submit" className="flex-1">{editingProduct ? 'Update' : 'Add Product'}</Button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';