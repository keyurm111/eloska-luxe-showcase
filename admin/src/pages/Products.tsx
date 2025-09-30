import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Star, Image as ImageIcon } from 'lucide-react';
import { productsApi, categoriesApi, Product, OrganizedCategories } from '@/services/api';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<OrganizedCategories | null>(null);
  const [collections, setCollections] = useState<string[]>([]);
  const [subcategorySuggestions, setSubcategorySuggestions] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    collection: '' as string,
    category: '',
    subcategory: '',
    minimumQuantity: '1',
    images: [] as string[],
    features: [] as string[],
    specifications: {
      size: '',
      quantity: '',
      finish: '',
      material: '',
      color: '',
      weight: '',
      dimensions: ''
    } as any,
    status: 'active' as 'active' | 'inactive' | 'draft',
    featured: false,
    inStock: true,
    stockQuantity: 0,
    tags: [] as string[]
  });

  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newImage, setNewImage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Helper functions
  const getAvailableCategories = () => {
    if (!categories || !formData.collection) return [];
    return (categories as any)[formData.collection]?.categories || [];
  };

  // Fetch subcategory suggestions
  const fetchSubcategorySuggestions = async (collection: string, category: string) => {
    if (!collection || !category) {
      setSubcategorySuggestions([]);
      return;
    }
    
    try {
      const response = await categoriesApi.getSubcategorySuggestions(collection, category);
      setSubcategorySuggestions(response.data);
    } catch (error) {
      console.error('Error fetching subcategory suggestions:', error);
      setSubcategorySuggestions([]);
    }
  };


  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      
      if (searchQuery) filters.search = searchQuery;
      if (categoryFilter) filters.collection = categoryFilter;
      if (statusFilter) filters.status = statusFilter;

      const response = await productsApi.getAll(currentPage, 12, filters);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      if (error.response?.status === 429) {
        toast.error('Too many requests. Please wait a moment and try again.');
      } else {
        toast.error('Failed to fetch products');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const [categoriesResponse, collectionsResponse] = await Promise.all([
        categoriesApi.getAll(),
        categoriesApi.getCollections()
      ]);
      setCategories(categoriesResponse.data);
      setCollections(collectionsResponse.data);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      if (error.response?.status === 429) {
        toast.error('Too many requests. Please wait a moment and try again.');
      } else {
        toast.error('Failed to fetch categories');
      }
    }
  };

  // Fetch subcategory suggestions when category changes
  useEffect(() => {
    if (formData.collection && formData.category) {
      fetchSubcategorySuggestions(formData.collection, formData.category);
    } else {
      setSubcategorySuggestions([]);
    }
  }, [formData.collection, formData.category]);

  // Debounce search and filters to reduce API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchQuery, categoryFilter, statusFilter]);

  useEffect(() => {
    fetchCategories();
  }, []);


  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Check if category is new and add it to categories
      if (formData.category && formData.collection) {
        const existingCategories = getAvailableCategories().map((c: any) => c.name);
        if (!existingCategories.includes(formData.category)) {
          try {
            await categoriesApi.create({
              collection: formData.collection as 'Mirror Collection' | 'Scarfs' | 'Bag Fabric',
              category: formData.category,
              subcategory: undefined,
              isActive: true,
              sortOrder: 0
            });
            // Refresh categories after adding new category
            await fetchCategories();
            toast.success(`New category "${formData.category}" added successfully!`);
          } catch (error) {
            console.error('Error adding new category:', error);
            // Continue with product creation even if category creation fails
          }
        }
      }

      // Add subcategory to categories if provided
      if (formData.subcategory && formData.collection && formData.category) {
        try {
          await categoriesApi.create({
            collection: formData.collection as 'Mirror Collection' | 'Scarfs' | 'Bag Fabric',
            category: formData.category,
            subcategory: formData.subcategory,
            isActive: true,
            sortOrder: 0
          });
          // Refresh categories after adding subcategory
          await fetchCategories();
          toast.success(`Subcategory "${formData.subcategory}" added successfully!`);
        } catch (error) {
          console.error('Error adding subcategory:', error);
          // Continue with product creation even if subcategory creation fails
        }
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        minimumQuantity: parseInt(formData.minimumQuantity) || 1,
        stockQuantity: parseInt(formData.stockQuantity.toString()),
        collection: formData.collection as 'Mirror Collection' | 'Scarfs' | 'Bag Fabric'
      };

      if (editingProduct) {
        await productsApi.update(editingProduct._id, productData);
        toast.success('Product updated successfully');
        setIsEditDialogOpen(false);
      } else {
        await productsApi.create(productData);
        toast.success('Product created successfully');
        setIsAddDialogOpen(false);
      }

      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      collection: '',
      category: '',
      subcategory: '',
      minimumQuantity: '1',
      images: [],
      features: [],
      specifications: {
        size: '',
        quantity: '',
        finish: '',
        material: '',
        color: '',
        weight: '',
        dimensions: ''
      },
      status: 'active',
      featured: false,
      inStock: true,
      stockQuantity: 0,
      tags: []
    });
    setEditingProduct(null);
  };

  // Handle edit
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      collection: product.collection,
      category: product.category,
      subcategory: product.subcategory || '',
      minimumQuantity: product.minimumQuantity.toString(),
      images: product.images,
      features: product.features,
      specifications: product.specifications || {
        size: '',
        quantity: '',
        finish: '',
        material: '',
        color: '',
        weight: '',
        dimensions: ''
      },
      status: product.status,
      featured: product.featured,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
      tags: product.tags
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsApi.delete(id);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await productsApi.updateStatus(id, newStatus as 'active' | 'inactive' | 'draft');
      toast.success(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      fetchProducts();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update product status');
    }
  };

  // Add feature
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  // Remove feature
  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  // Add image
  const addImage = () => {
    if (newImage.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
      setNewImage('');
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      Array.from(uploadedFiles).forEach((file) => {
        formData.append('images', file);
      });

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5004/api'}/products/upload-images`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      // Add uploaded images to form data
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...result.data.images]
      }));

      // Clear uploaded files
      setUploadedFiles(null);
      
      toast.success(`${result.data.images.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Collection Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Collections</option>
            {collections.map((collection) => (
              <option key={collection} value={collection}>{collection}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('');
              setStatusFilter('');
            }}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="aspect-square relative">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].startsWith('http') 
                      ? product.images[0] 
                      : product.images[0].startsWith('/uploads/')
                        ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5004'}${product.images[0]}`
                        : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5004/api'}${product.images[0]}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-full h-full bg-gray-100 flex items-center justify-center ${product.images && product.images.length > 0 ? 'hidden' : ''}`}>
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  {product.featured && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Featured
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded ${
                    product.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">₹{product.price}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {product.collection}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {product.category}
                    </span>
                    {product.subcategory && (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        {product.subcategory}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Min. Quantity: {product.minimumQuantity} pieces
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    <span className="text-sm text-gray-500">
                      Qty: {product.stockQuantity}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleStatusToggle(product._id, product.status)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                    >
                      {product.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="flex items-center px-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {(isAddDialogOpen || isEditDialogOpen) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              if (isAddDialogOpen) {
                setIsAddDialogOpen(false);
              }
              if (isEditDialogOpen) {
                setIsEditDialogOpen(false);
              }
              resetForm();
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => {
                  if (isAddDialogOpen) {
                    setIsAddDialogOpen(false);
                  }
                  if (isEditDialogOpen) {
                    setIsEditDialogOpen(false);
                  }
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Collection *</label>
                  <select
                    value={formData.collection}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      collection: e.target.value,
                      category: '',
                      subcategory: ''
                    }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Collection</option>
                    {collections.map((collection) => (
                      <option key={collection} value={collection}>
                        {collection}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Collection and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <div className="relative">
                    <input
                      key={`category-${formData.collection}`}
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        category: e.target.value,
                        subcategory: ''
                      }))}
                      placeholder="Type or select category"
                      required
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        formData.category && !getAvailableCategories().map((c: any) => c.name).includes(formData.category)
                          ? 'border-orange-300 focus:ring-orange-500 bg-orange-50'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      disabled={!formData.collection}
                      list={`category-options-${formData.collection}`}
                    />
                    <datalist id={`category-options-${formData.collection}`}>
                      {getAvailableCategories().map((category: any) => (
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </datalist>
                    {formData.category && !getAvailableCategories().map((c: any) => c.name).includes(formData.category) && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                          New
                        </span>
                      </div>
                    )}
                  </div>
                  {formData.collection && getAvailableCategories().length > 0 && (
                    <div className="mt-1 text-xs text-gray-500">
                      Available: {getAvailableCategories().map((c: any) => c.name).join(', ')}
                    </div>
                  )}
                  {formData.category && !getAvailableCategories().map((c: any) => c.name).includes(formData.category) && (
                    <div className="mt-1 text-xs text-orange-600">
                      ✨ This will create a new category
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subcategory</label>
                  <div className="relative">
                    <input
                      key={`subcategory-${formData.category}`}
                      type="text"
                      value={formData.subcategory}
                      onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                      placeholder="Type subcategory"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!formData.category}
                      list={`subcategory-suggestions-${formData.collection}-${formData.category}`}
                    />
                    <datalist id={`subcategory-suggestions-${formData.collection}-${formData.category}`}>
                      {subcategorySuggestions.map((suggestion) => (
                        <option key={suggestion} value={suggestion}>
                          {suggestion}
                        </option>
                      ))}
                    </datalist>
                    {subcategorySuggestions.length > 0 && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {subcategorySuggestions.length} suggestions
                        </span>
                      </div>
                    )}
                  </div>
                  {subcategorySuggestions.length > 0 && (
                    <div className="mt-1 text-xs text-gray-500">
                      Suggestions: {subcategorySuggestions.join(', ')}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price per Piece (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Minimum Quantity *</label>
                  <input
                    type="text"
                    value={formData.minimumQuantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow numbers and empty string
                      if (value === '' || /^\d+$/.test(value)) {
                        setFormData(prev => ({ ...prev, minimumQuantity: value }));
                      }
                    }}
                    onBlur={(e) => {
                      // Ensure we have a valid value when user leaves the field
                      const value = e.target.value;
                      if (value === '' || parseInt(value) < 1) {
                        setFormData(prev => ({ ...prev, minimumQuantity: '1' }));
                      }
                    }}
                    placeholder="Enter minimum quantity"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium mb-1">Images</label>
                
                {/* File Upload Section */}
                <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setUploadedFiles(e.target.files)}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Choose Images from Computer
                    </label>
                    {uploadedFiles && uploadedFiles.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          {uploadedFiles.length} file(s) selected
                        </p>
                        <button
                          type="button"
                          onClick={handleFileUpload}
                          disabled={isUploading}
                          className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                          {isUploading ? 'Uploading...' : 'Upload Images'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* URL Input Section */}
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Or enter image URL"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" onClick={addImage} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Add URL
                  </button>
                </div>

                {/* Image Preview */}
                <div className="flex flex-wrap gap-2">
                  {formData.images.map((image, index) => {
                    // Construct proper image URL
                    const imageUrl = image.startsWith('http') 
                      ? image 
                      : image.startsWith('/uploads/')
                        ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5004'}${image}`
                        : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5004/api'}${image}`;
                    
                    
                    return (
                      <div key={index} className="relative">
                        <img 
                          src={imageUrl} 
                          alt={`Product ${index + 1}`} 
                          className="w-16 h-16 object-cover rounded border" 
                          onError={(e) => {
                            console.error('Image load error:', imageUrl);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium mb-1">Features</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add feature"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" onClick={addFeature} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm flex items-center gap-1">
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div>
                <label className="block text-sm font-medium mb-3">Product Specifications</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Size</label>
                    <input
                      type="text"
                      value={formData.specifications.size}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        specifications: { ...prev.specifications, size: e.target.value }
                      }))}
                      placeholder="e.g., 12x12 inches"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Quantity</label>
                    <input
                      type="text"
                      value={formData.specifications.quantity}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        specifications: { ...prev.specifications, quantity: e.target.value }
                      }))}
                      placeholder="e.g., 1 piece, 10 meters, 1 set"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Finish</label>
                    <input
                      type="text"
                      value={formData.specifications.finish}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        specifications: { ...prev.specifications, finish: e.target.value }
                      }))}
                      placeholder="e.g., Matte, Glossy, Brushed"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Material</label>
                    <input
                      type="text"
                      value={formData.specifications.material}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        specifications: { ...prev.specifications, material: e.target.value }
                      }))}
                      placeholder="e.g., Silver, Cotton, Acrylic"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Color</label>
                    <input
                      type="text"
                      value={formData.specifications.color}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        specifications: { ...prev.specifications, color: e.target.value }
                      }))}
                      placeholder="e.g., Black, White, Multi-color"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Weight</label>
                    <input
                      type="text"
                      value={formData.specifications.weight}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        specifications: { ...prev.specifications, weight: e.target.value }
                      }))}
                      placeholder="e.g., 500g, 1kg, 2.5 lbs"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Dimensions</label>
                    <input
                      type="text"
                      value={formData.specifications.dimensions}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        specifications: { ...prev.specifications, dimensions: e.target.value }
                      }))}
                      placeholder="e.g., 30cm x 20cm x 5cm"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Status and Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="featured">Featured</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={formData.inStock}
                    onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="inStock">In Stock</label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (isAddDialogOpen) {
                      setIsAddDialogOpen(false);
                    }
                    if (isEditDialogOpen) {
                      setIsEditDialogOpen(false);
                    }
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;