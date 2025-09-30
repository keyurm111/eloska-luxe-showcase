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
import { getProducts, Product, ProductFilters } from '@/services/products';

// Static collections structure matching the frontend
const STATIC_COLLECTIONS = {
  'Mirror Collection': {
    categories: [
      { name: 'Regular Silver Mirrors', subcategories: ['Standard', 'Premium', 'Custom'] },
      { name: 'Artistic Mirrors', subcategories: ['Decorative', 'Vintage', 'Modern'] },
      { name: 'Acrylic Mirror', subcategories: ['Clear', 'Tinted', 'Safety'] },
      { name: 'Catalogues', subcategories: ['Product Catalog', 'Price List', 'Brochure'] },
      { name: 'Mirrors Sheet', subcategories: ['Thin', 'Medium', 'Thick'] }
    ]
  },
  'Scarfs': {
    categories: [
      { name: 'Bandhani Scarf', subcategories: ['Cotton', 'Silk', 'Georgette'] },
      { name: 'White Scarf', subcategories: ['Plain', 'Embroidered', 'Printed'] },
      { name: 'Baby Scarf', subcategories: ['Soft Cotton', 'Organic', 'Hypoallergenic'] }
    ]
  },
  'Bag Fabric': {
    categories: [
      { name: 'Digital Print Fabric', subcategories: ['Cotton', 'Polyester', 'Blend'] },
      { name: 'Water Resistant Antifree Fabric', subcategories: ['PVC', 'PU', 'Coated'] },
      { name: 'School Bag Fabric', subcategories: ['Canvas', 'Nylon', 'Leather'] }
    ]
  }
} as const;

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

  // Map URL category to category, subcategory and display name (static)
  const getCategoryMapping = (urlCategory: string) => {
    // Search through all collections to find the category
    for (const [collectionName, collectionData] of Object.entries(STATIC_COLLECTIONS)) {
      for (const categoryData of collectionData.categories) {
        const categorySlug = getCategorySlug(categoryData.name);
        if (categorySlug === urlCategory) {
          return {
            category: categoryData.name,
            subcategory: categoryData.subcategories[0] || '', // Use first subcategory as default
            displayName: categoryData.name,
            collection: collectionName
          };
        }
      }
    }
    
    return null;
  };

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert category name to URL slug (dynamic)
  const getCategorySlug = (categoryName: string) => {
    // For predefined categories, use specific slugs for better SEO
    const slugMap: { [key: string]: string } = {
      'Regular Silver Mirrors': 'regular-silver',
      'Artistic Mirrors': 'artistic',
      'Acrylic Mirror': 'acrylic',
      'Catalogues': 'catalogues',
      'Mirrors Sheet': 'mirror-sheet',
      'Bandhani Scarf': 'bandhani',
      'White Scarf': 'white-scarf',
      'Baby Scarf': 'baby-scarf',
      'Digital Print Fabric': 'digital',
      'Water Resistant Antifree Fabric': 'waterproof',
      'School Bag Fabric': 'school'
    };
    
    // Use predefined slug if available, otherwise generate from category name
    return slugMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '-');
  };

  // Set page title based on category
  const getPageTitle = () => {
    if (category) {
      const mapping = getCategoryMapping(category);
      if (mapping) {
        return `${mapping.displayName} - Eloska World`;
      }
    }
    return 'Products - Eloska World';
  };

  // Set initial page title
  usePageTitle({ title: 'Products - Eloska World' });
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>(undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
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

  // Set initial subcategory filter based on URL category (no default subcategory)
  useEffect(() => {
    if (category) {
      setSelectedSubcategory(undefined); // No default subcategory selection
    }
  }, [category]);

  // Set page title when category changes
  useEffect(() => {
    const pageTitle = getPageTitle();
    document.title = pageTitle;
  }, [category]);

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
      if (category) {
        const mapping = getCategoryMapping(category);
        if (mapping) {
          // Always filter by the specific category from URL
          filters.category = mapping.category;
          // Always filter by the collection for this category
          filters.collection = mapping.collection;
        }
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
  }, [currentPage, searchQuery, category, selectedSubcategory, priceRange, minPrice, maxPrice, sortBy, sortOrder]);


  // Get subcategories for the selected category from URL
  const getSubcategoriesForCategory = () => {
    if (!category) return [];
    
    const mapping = getCategoryMapping(category);
    if (!mapping) return [];
    
    // Find the category across all collections
    for (const collection of Object.values(STATIC_COLLECTIONS)) {
      const categoryData = collection.categories.find(cat => cat.name === mapping.category);
      if (categoryData) {
        return [...categoryData.subcategories].sort();
      }
    }
    
    return [];
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
    setSelectedSubcategory(undefined);
    setPriceRange([0, 10000]);
    setMinPrice(0);
    setMaxPrice(10000);
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
    
    // If we're on a category page, navigate to main products page
    if (category) {
      navigate('/products');
    }
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
                (() => {
                  const categoryName = getCategoryMapping(category)?.displayName || 'Products';
                  const words = categoryName.split(' ');
                  const firstWord = words[0];
                  const remainingWords = words.slice(1).join(' ');
                  return (
                    <>
                      <span className="text-black">{firstWord}</span>
                      {remainingWords && <span className="text-primary ml-2" style={{color: 'hsl(0 100% 27%)'}}>{remainingWords}</span>}
                    </>
                  );
                })()
              ) : (
                <>
                  <span className="text-black">Our</span>
                  <span className="text-primary ml-2" style={{color: 'hsl(0 100% 27%)'}}>Products</span>
                </>
              )}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {category 
                ? `Explore our premium ${getCategoryMapping(category)?.displayName.toLowerCase() || 'products'} collection. Each item is carefully crafted to meet the highest standards of quality and design.`
                : 'Discover our premium collection of high-quality products. Each item is carefully crafted to meet the highest standards of quality.'
              }
            </p>
            {category && (
              <div className="mt-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                  {getCategoryMapping(category)?.collection || 'Collection'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileFilters(false)}>
              <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowMobileFilters(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {/* Mobile Filter Content - Same as desktop but in mobile layout */}
                    {/* Search */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8 h-9 text-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>
                    </div>

                    {/* Subcategory */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                      <Select 
                        value={selectedSubcategory} 
                        onValueChange={(value) => setSelectedSubcategory(value || undefined)}
                      >
                        <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                          <SelectValue placeholder="Select Subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {getSubcategoriesForCategory().map((subcategory) => (
                            <SelectItem key={subcategory} value={subcategory}>
                              {subcategory}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Min Price (₹)</label>
                          <Input
                            type="number"
                            value={minPrice}
                            onChange={(e) => handleMinPriceChange(e.target.value)}
                            min="0"
                            max="10000"
                            step="100"
                            className="h-9 text-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Max Price (₹)</label>
                          <Input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => handleMaxPriceChange(e.target.value)}
                            min="0"
                            max="10000"
                            step="100"
                            className="h-9 text-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                            placeholder="10000"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                      <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                        <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="createdAt">Newest First</SelectItem>
                          <SelectItem value="name">Name A-Z</SelectItem>
                          <SelectItem value="price">Price Low-High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort Order */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                      <Select value={sortOrder} onValueChange={(value) => setSortOrder(value)}>
                        <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="desc">Descending</SelectItem>
                          <SelectItem value="asc">Ascending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Clear Filters */}
                    <Button 
                      variant="outline" 
                      onClick={clearFilters} 
                      className="w-full h-9 text-sm border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Sticky Sidebar Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
                
                {/* Search */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 h-9 text-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                    />
                  </div>
                </div>


                {/* Subcategory */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                  <Select 
                    value={selectedSubcategory} 
                    onValueChange={(value) => setSelectedSubcategory(value || undefined)}
                  >
                    <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                      <SelectValue placeholder="Select Subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubcategoriesForCategory().map((subcategory) => (
                        <SelectItem key={subcategory} value={subcategory}>
                          {subcategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Min Price (₹)</label>
                      <Input
                        type="number"
                        value={minPrice}
                        onChange={(e) => handleMinPriceChange(e.target.value)}
                        min="0"
                        max="10000"
                        step="100"
                        className="h-9 text-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Max Price (₹)</label>
                      <Input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => handleMaxPriceChange(e.target.value)}
                        min="0"
                        max="10000"
                        step="100"
                        className="h-9 text-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        placeholder="10000"
                      />
                    </div>
                  </div>
                </div>

                {/* Sort Options */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Newest</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="h-9 text-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                      <SelectValue placeholder="Order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Descending</SelectItem>
                      <SelectItem value="asc">Ascending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
                  <div className="flex gap-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={`flex-1 h-9 text-sm ${viewMode === 'grid' ? 'bg-gray-900 hover:bg-gray-800 text-white' : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'}`}
                    >
                      <Grid className="h-4 w-4 mr-2" />
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={`flex-1 h-9 text-sm ${viewMode === 'list' ? 'bg-gray-900 hover:bg-gray-800 text-white' : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'}`}
                    >
                      <List className="h-4 w-4 mr-2" />
                      List
                    </Button>
                  </div>
                </div>

                {/* Clear Filters */}
                <Button 
                  variant="outline" 
                  onClick={clearFilters} 
                  className="w-full h-9 text-sm border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">

            {/* Results Summary */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-gray-600 text-sm">
                  {category ? (
                    <>
                      Showing <span className="text-gray-900 font-semibold">{products.length}</span> of <span className="text-gray-900 font-semibold">{totalProducts}</span> products in <span className="text-gray-900 font-medium">{getCategoryMapping(category)?.displayName || 'this category'}</span>
                      {searchQuery && (
                        <span className="ml-2">
                          for <span className="text-gray-900 font-medium">"{searchQuery}"</span>
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      Showing <span className="text-gray-900 font-semibold">{products.length}</span> of <span className="text-gray-900 font-semibold">{totalProducts}</span> products
                      {searchQuery && (
                        <span className="ml-2">
                          for <span className="text-gray-900 font-medium">"{searchQuery}"</span>
                        </span>
                      )}
                    </>
                  )}
                </p>
                {products.length > 0 && (
                  <div className="hidden sm:block text-sm text-gray-600">
                    Viewing as <span className="text-gray-900 font-medium">{viewMode === 'grid' ? 'Grid' : 'List'}</span>
                  </div>
                )}
              </div>
            </div>

        {/* Products Grid/List */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
              <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-playfair font-semibold text-gray-900 mb-3">
                {category ? 'No products in this category' : 'No products found'}
              </h3>
              <p className="text-gray-600 mb-6">
                {category 
                  ? `There are currently no products available in the ${getCategoryMapping(category)?.displayName || 'selected'} category.`
                  : 'Try adjusting your filters or search terms to find what you\'re looking for.'
                }
              </p>
              <Button onClick={clearFilters} className="bg-primary hover:bg-primary-glow text-primary-foreground">
                {category ? 'View All Products' : 'Clear Filters'}
              </Button>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'
            : 'space-y-4 sm:space-y-6 lg:space-y-8'
          }>
            {products.map((product) => (
              <Card key={product._id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 bg-white">
                <CardContent className="p-0">
                  <div className="flex flex-col">
                    {/* Product Image - Top */}
                    <div className="relative w-full h-48 sm:h-56 overflow-hidden">
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
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.featured && (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <Badge 
                          variant={product.inStock ? 'default' : 'destructive'}
                          className={product.inStock ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}
                        >
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                    </div>

                    {/* Product Details - Bottom */}
                    <div className="p-4 flex flex-col justify-between flex-1">
                      <div>
                        {/* Product Title */}
                        <div className="mb-3">
                          <h3 className="font-playfair font-semibold text-lg mb-2 text-gray-900 group-hover:text-gray-700 transition-colors duration-200 line-clamp-2">
                            {product.name}
                          </h3>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                          <span className="text-sm text-gray-500">per piece</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => openQuoteDialog(product)}
                          disabled={!product.inStock}
                          className="w-full bg-primary hover:bg-primary-glow text-primary-foreground shadow-sm h-10"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Get Quote
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/product/${product._id}`)}
                          className="w-full border-primary text-primary hover:bg-primary hover:text-white hover:border-primary h-10 transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
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
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-6 sm:mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 w-full sm:w-auto"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page 
                          ? 'bg-gray-900 hover:bg-gray-800 text-white shadow-sm' 
                          : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                        }
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
                  className="border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 w-full sm:w-auto"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quote Dialog */}
      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogContent className="max-w-md bg-white border-gray-200 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-playfair font-semibold text-gray-900">Request Quote</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <form onSubmit={handleQuoteSubmit} className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                <h4 className="font-playfair font-semibold text-gray-900 mb-2">{selectedProduct.name}</h4>
                <p className="text-sm text-gray-900 font-medium">₹{selectedProduct.price} per piece</p>
                <p className="text-sm text-gray-600">Min. Quantity: <span className="text-gray-900 font-semibold">{selectedProduct.minimumQuantity}</span> pieces</p>
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

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsQuoteDialogOpen(false)}
                  className="flex-1 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submittingQuote}
                  className="flex-1 bg-primary hover:bg-primary-glow text-primary-foreground shadow-sm"
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
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-auto p-4 bg-white border-gray-200 shadow-lg">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-xl font-playfair font-semibold text-gray-900">{selectedProduct?.name}</DialogTitle>
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
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg border-gray-300"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg border-gray-300"
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