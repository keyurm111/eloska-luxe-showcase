import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, ShoppingCart, Star, Search, Filter, Grid, List, X, Send, User, Mail, Phone, MessageSquare, Loader2, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { usePageTitle } from '@/hooks/use-page-title';
import { getProducts, getOrganizedCategories, getCollections, Product, ProductFilters, OrganizedCategories } from '@/services/products';

const Products = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Helper function to construct proper image URLs
  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    if (imagePath.startsWith('/uploads/')) {
      return `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5004'}${imagePath}`;
    }
    return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5004/api'}${imagePath}`;
  };
  usePageTitle('Products - Eloska World');

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<OrganizedCategories | null>(null);
  const [collections, setCollections] = useState<string[]>([]);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // Quote dialog
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    quantity: 1,
    message: ''
  });
  const [submittingQuote, setSubmittingQuote] = useState(false);
  
  // Image gallery dialog
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch categories and collections
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [categoriesResponse, collectionsResponse] = await Promise.all([
          getOrganizedCategories(),
          getCollections()
        ]);
        setCategories(categoriesResponse.data);
        setCollections(collectionsResponse.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: ProductFilters = {
        page: currentPage,
        limit: 10,
        status: 'active'
      };

      // If category is selected from URL, enforce strict filtering
      if (selectedCategory) {
        // Always filter by the specific category
        filters.category = selectedCategory;
        // Always filter by the collection for this category
        if (categories) {
          for (const [collectionName, collectionData] of Object.entries(categories)) {
            const categoryData = collectionData.categories.find(cat => cat.name === selectedCategory);
            if (categoryData) {
              filters.collection = collectionName;
              break;
            }
          }
        }
      } else {
        // Only apply collection filter if no category is selected
        if (selectedCollection) filters.collection = selectedCollection;
      }
      
      if (searchQuery) filters.search = searchQuery;
      if (selectedSubcategory) filters.subcategory = selectedSubcategory;
      if (priceRange[0] > 0) filters.minPrice = priceRange[0];
      if (priceRange[1] < 10000) filters.maxPrice = priceRange[1];
      if (sortBy) filters.sortBy = sortBy as any;
      if (sortOrder) filters.sortOrder = sortOrder as any;

      const response = await getProducts(filters);
      setProducts(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalProducts(response.data.total);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchQuery, selectedCollection, selectedCategory, selectedSubcategory, priceRange, minPrice, maxPrice, sortBy, sortOrder]);

  // Get available categories based on selected collection
  const getAvailableCategories = () => {
    if (!categories || !selectedCollection) return [];
    return categories[selectedCollection as keyof OrganizedCategories]?.categories || [];
  };

  // Get available subcategories based on selected category
  const getAvailableSubcategories = () => {
    if (!categories || !selectedCollection || !selectedCategory) return [];
    const collectionData = categories[selectedCollection as keyof OrganizedCategories];
    const categoryData = collectionData?.categories.find(cat => cat.name === selectedCategory);
    return categoryData?.subcategories || [];
  };

  // Handle quote submission
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setSubmittingQuote(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5004/api'}/product-inquiries/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: quoteForm.name,
          email: quoteForm.email,
          phone: quoteForm.phone,
          productName: selectedProduct.name,
          productCode: selectedProduct._id,
          category: selectedProduct.category,
          subcategory: selectedProduct.subcategory || '',
          quantity: quoteForm.quantity,
          message: quoteForm.message
        }),
      });

      if (response.ok) {
        toast({
          title: 'Quote Request Sent!',
          description: 'We will get back to you within 24 hours.',
        });
        setIsQuoteDialogOpen(false);
        setQuoteForm({ name: '', email: '', phone: '', quantity: 1, message: '' });
      } else {
        throw new Error('Failed to submit quote request');
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit quote request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmittingQuote(false);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCollection('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setPriceRange([0, 10000]);
    setMinPrice(0);
    setMaxPrice(10000);
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const handleMinPriceChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setMinPrice(numValue);
    setPriceRange([numValue, priceRange[1]]);
  };

  const handleMaxPriceChange = (value: string) => {
    const numValue = parseInt(value) || 10000;
    setMaxPrice(numValue);
    setPriceRange([priceRange[0], numValue]);
  };

  // Open quote dialog
  const openQuoteDialog = (product: Product) => {
    setSelectedProduct(product);
    setQuoteForm(prev => ({ ...prev, quantity: product.minimumQuantity }));
    setIsQuoteDialogOpen(true);
  };

  // Open image gallery
  const openImageGallery = (product: Product, imageIndex: number = 0) => {
    setSelectedProduct(product);
    setCurrentImageIndex(imageIndex);
    setIsImageDialogOpen(true);
  };

  // Navigate images
  const nextImage = () => {
    if (selectedProduct) {
      setCurrentImageIndex((prev) => 
        prev < selectedProduct.images.length - 1 ? prev + 1 : 0
      );
    }
  };

  const prevImage = () => {
    if (selectedProduct) {
      setCurrentImageIndex((prev) => 
        prev > 0 ? prev - 1 : selectedProduct.images.length - 1
      );
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchProducts}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold mb-6">
              {category ? (
                <>
                  <span className="text-black">{category.split(' ')[0]}</span>
                  <span className="text-primary"> {category.split(' ').slice(1).join(' ')} Products</span>
                </>
              ) : (
                <>
                  <span className="text-black">Our</span>
                  <span className="text-primary"> Products</span>
                </>
              )}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {category 
                ? `Discover our premium ${category.toLowerCase()} products. Each item is carefully crafted to meet the highest standards of quality.`
                : 'Discover our premium collection of high-quality products. Each item is carefully crafted to meet the highest standards of quality.'
              }
            </p>
            {category && (
              <div className="mt-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                  {category} Collection
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500"
              />
            </div>

            {/* Collection */}
            <Select value={selectedCollection} onValueChange={setSelectedCollection}>
              <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                <SelectValue placeholder="Collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Collections</SelectItem>
                {collections.map((collection) => (
                  <SelectItem key={collection} value={collection}>
                    {collection}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category */}
            <Select 
              value={selectedCategory} 
              onValueChange={(value) => {
                setSelectedCategory(value);
                setSelectedSubcategory('');
              }}
              disabled={!selectedCollection}
            >
              <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {getAvailableCategories().map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Min Price */}
            <div className="relative">
              <Input
                type="number"
                value={minPrice}
                onChange={(e) => handleMinPriceChange(e.target.value)}
                min="0"
                max="10000"
                step="100"
                className="h-9 text-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                placeholder="Min Price"
              />
            </div>

            {/* Max Price */}
            <div className="relative">
              <Input
                type="number"
                value={maxPrice}
                onChange={(e) => handleMaxPriceChange(e.target.value)}
                min="0"
                max="10000"
                step="100"
                className="h-9 text-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                placeholder="Max Price"
              />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Subcategory */}
              <Select 
                value={selectedSubcategory} 
                onValueChange={setSelectedSubcategory}
                disabled={!selectedCategory}
              >
                <SelectTrigger className="w-32 h-8 text-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                  <SelectValue placeholder="Subcategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Subcategories</SelectItem>
                  {getAvailableSubcategories().map((subcategory) => (
                    <SelectItem key={subcategory} value={subcategory}>
                      {subcategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-28 h-8 text-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Newest</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-24 h-8 text-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Desc</SelectItem>
                  <SelectItem value="asc">Asc</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={clearFilters} size="sm" className="h-8 text-sm border-gray-300 hover:bg-gray-50 hover:border-gray-400">
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`h-8 w-8 p-0 ${viewMode === 'grid' ? 'bg-gray-900 hover:bg-gray-800 text-white' : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'}`}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`h-8 w-8 p-0 ${viewMode === 'list' ? 'bg-gray-900 hover:bg-gray-800 text-white' : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {products.length} of {totalProducts} products
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Products Grid/List */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 lg:grid-cols-2 gap-8'
          : 'space-y-8'
        }>
            {products.map((product) => (
              <Card key={product._id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 bg-white">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Product Image - Left Side */}
                    <div className="relative w-full lg:w-2/5 h-64 lg:h-auto overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={getImageUrl(product.images[0])}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          onError={(e) => {
                            console.error('Image load error:', getImageUrl(product.images[0]));
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Hover Actions */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => openImageGallery(product, 0)}
                            className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Images
                          </Button>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.featured && (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs bg-white/90 text-gray-700 border-gray-200">
                          {product.collection}
                        </Badge>
                      </div>
                    </div>

                    {/* Product Details - Right Side */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        {/* Product Title and Description */}
                        <div className="mb-4">
                          <h3 className="font-playfair font-semibold text-xl mb-2 text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-3 mb-4">{product.description}</p>
                        </div>

                        {/* Category Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="outline" className="text-xs border-gray-300 text-gray-700 bg-gray-50">
                            {product.category}
                          </Badge>
                          {product.subcategory && (
                            <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                              {product.subcategory}
                            </Badge>
                          )}
                        </div>

                        {/* Price and Stock Info */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                            <span className="text-sm text-gray-500">per piece</span>
                          </div>
                          <Badge 
                            variant={product.inStock ? 'default' : 'destructive'}
                            className={product.inStock ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}
                          >
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </div>

                        {/* Minimum Quantity */}
                        <div className="text-sm text-gray-600 mb-6">
                          <span className="font-medium">Minimum Quantity:</span> <span className="text-gray-900 font-semibold">{product.minimumQuantity}</span> pieces
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button
                          onClick={() => openQuoteDialog(product)}
                          disabled={!product.inStock}
                          className="flex-1 bg-primary hover:bg-primary-glow text-primary-foreground shadow-sm h-12"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Get Quote
                        </Button>
                        {product.images && product.images.length > 1 && (
                          <Button
                            variant="outline"
                            onClick={() => openImageGallery(product, 0)}
                            className="border-gray-300 hover:bg-gray-50 hover:border-gray-400 h-12 px-4"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>

      {/* Quote Dialog */}
      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Quote</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <form onSubmit={handleQuoteSubmit} className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium">{selectedProduct.name}</h4>
                <p className="text-sm text-gray-600">₹{selectedProduct.price} per piece</p>
                <p className="text-sm text-gray-600">Min. Quantity: {selectedProduct.minimumQuantity} pieces</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <Input
                    value={quoteForm.name}
                    onChange={(e) => setQuoteForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <Input
                    type="tel"
                    value={quoteForm.phone}
                    onChange={(e) => setQuoteForm(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <Input
                  type="email"
                  value={quoteForm.email}
                  onChange={(e) => setQuoteForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Quantity *</label>
                <Input
                  type="number"
                  min={selectedProduct.minimumQuantity}
                  value={quoteForm.quantity}
                  onChange={(e) => setQuoteForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || selectedProduct.minimumQuantity }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <Textarea
                  value={quoteForm.message}
                  onChange={(e) => setQuoteForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Any specific requirements or questions..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsQuoteDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submittingQuote}
                  className="flex-1"
                >
                  {submittingQuote ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send Quote Request
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Gallery Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-auto p-4">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-xl">{selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          {selectedProduct && selectedProduct.images && selectedProduct.images.length > 0 && (
            <div className="relative flex justify-center items-center">
              <img
                src={getImageUrl(selectedProduct.images[currentImageIndex])}
                alt={`${selectedProduct.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-auto object-contain rounded-lg"
                style={{ minHeight: '500px', maxHeight: '70vh' }}
                onError={(e) => {
                  console.error('Image load error:', getImageUrl(selectedProduct.images[currentImageIndex]));
                }}
              />
              
              {selectedProduct.images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;