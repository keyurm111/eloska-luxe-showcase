import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, ShoppingCart, Star, ArrowLeft, ChevronLeft, ChevronRight, Search, Filter, Grid, List, X, Send, User, Mail, Phone, MessageSquare, Loader2 } from 'lucide-react';
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
import { getProducts, getCategories, Product, ProductFilters } from '@/services/products';

// Import images
import mirrorsImage from '@/assets/mirrors-collection.jpg';
import scarfsImage from '@/assets/scarfs-collection.jpg';
import bagFabricImage from '@/assets/bag-fabric-collection.jpg';

// Custom hook for scroll animations
const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible] as const;
};

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
  const [ref, isVisible] = useScrollAnimation();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Quote form
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    productName: ''
  });

  // Set page title
  usePageTitle({
    title: category ? `${category.charAt(0).toUpperCase() + category.slice(1)} - Products | Eloska World` : "Products - Eloska World",
    description: category ? `Explore our premium ${category} collection at Eloska World. High-quality manufacturing with luxury finishes and designs.` : "Discover our complete range of premium products including Face Masks, Ladies Kurtis, Scarfs, Bag Fabrics, Sarees Mirrors and more."
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const filters: ProductFilters = {
        page: currentPage,
        limit: 10,
        status: 'active'
      };

      if (selectedCategory && selectedCategory !== 'all') filters.category = selectedCategory;
      if (searchQuery) filters.search = searchQuery;
      if (sortBy) filters.sortBy = sortBy;
      if (sortOrder) filters.sortOrder = sortOrder;

      const response = await getProducts(filters);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory('all');
    }
  }, [category]);

  // Handle quote submission
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5004/api'}/product-inquiries/submit`;
      console.log('Making request to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: quoteForm.name,
          email: quoteForm.email,
          phone: quoteForm.phone,
          productName: selectedProduct?.name || quoteForm.productName,
          productCode: selectedProduct?._id || '',
          category: selectedProduct?.category || '',
          subcategory: selectedProduct?.subcategory || '',
          quantity: quoteForm.quantity || 1,
          message: quoteForm.message
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Quote submitted successfully:', result);

      toast({
        title: "Quote Request Sent!",
        description: "Thank you for your interest. We'll get back to you within 24 hours.",
      });

      setQuoteForm({ name: '', email: '', phone: '', message: '', productName: '' });
      setIsQuoteDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast({
        title: "Error",
        description: "Failed to submit quote request. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle product click
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setQuoteForm(prev => ({ ...prev, productName: product.name }));
    setIsQuoteDialogOpen(true);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 10000]);
    setSelectedCategory('all');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  // Get category display name
  const getCategoryDisplayName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'regular-silver': 'Regular Silver Mirrors',
      'bandhani': 'Bandhani Scarf',
      'digital': 'Digital Print Fabric',
      'mirrors': 'Mirrors',
      'scarfs': 'Scarfs',
      'bag-fabric': 'Bag Fabric'
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-glow text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {selectedCategory ? (
              <>
                <span className="text-black">{getCategoryDisplayName(selectedCategory).split(' ')[0]}</span>
                <span className="text-primary"> {getCategoryDisplayName(selectedCategory).split(' ').slice(1).join(' ')}</span>
              </>
            ) : (
              <>
                <span className="text-black">Our</span>
                <span className="text-primary"> Products</span>
              </>
            )}
          </h1>
          <p className="text-white/90 text-lg">
            {selectedCategory 
              ? `Explore our premium ${getCategoryDisplayName(selectedCategory).toLowerCase()} collection`
              : 'Discover our complete range of premium products'
            }
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {getCategoryDisplayName(cat)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort By */}
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Newest First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price">Price Low-High</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid/List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading products...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ShoppingCart className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedCategory 
                ? 'Try adjusting your search or filter criteria'
                : 'No products available at the moment'
              }
            </p>
            {(searchQuery || selectedCategory) && (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {products.map((product) => (
              <Card 
                key={product._id} 
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
                onClick={() => handleProductClick(product)}
              >
                <div className={`relative ${viewMode === 'grid' ? 'aspect-square' : 'h-48'}`}>
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={getImageUrl(product.images[0])}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.error('Image load error:', getImageUrl(product.images[0]));
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <div className="text-gray-400 text-center">
                        <ShoppingCart className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">No Image</p>
                      </div>
                    </div>
                  )}
                  
                  {product.featured && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  
                  {product.originalPrice && product.originalPrice > product.price && (
                    <Badge variant="destructive" className="absolute top-2 right-2">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">
                        ₹{product.price}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">
                        {getCategoryDisplayName(product.category)}
                      </Badge>
                      {product.subcategory && (
                        <Badge variant="outline" className="text-xs">
                          {product.subcategory}
                        </Badge>
                      )}
                    </div>

                    {product.features && product.features.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {product.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {product.features.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{product.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <Badge variant={product.inStock ? 'default' : 'destructive'}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                      
                      <Button size="sm" className="group-hover:bg-primary group-hover:text-white">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
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
                {totalPages > 5 && (
                  <>
                    <span className="px-2">...</span>
                    <Button
                      variant={currentPage === totalPages ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Quote Dialog */}
      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Quote</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleQuoteSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product</label>
              <Input
                value={quoteForm.productName}
                onChange={(e) => setQuoteForm(prev => ({ ...prev, productName: e.target.value }))}
                required
                readOnly
                className="bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <Input
                value={quoteForm.name}
                onChange={(e) => setQuoteForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
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
              <label className="block text-sm font-medium mb-1">Phone *</label>
              <Input
                type="tel"
                value={quoteForm.phone}
                onChange={(e) => setQuoteForm(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <Textarea
                value={quoteForm.message}
                onChange={(e) => setQuoteForm(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
                placeholder="Tell us about your requirements..."
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsQuoteDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Send Quote Request
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;