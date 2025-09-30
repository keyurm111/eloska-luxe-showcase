import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, ShoppingCart, Share2, Download } from 'lucide-react';
import { getProduct, getProductsByCategory, Product } from '@/services/products';
import { toast } from '@/hooks/use-toast';
import { usePageTitle } from '@/hooks/use-page-title';

const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('specifications');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  // Helper function to construct image URLs
  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5004';
    return `${baseUrl}${imagePath}`;
  };

  // Fetch related products
  const fetchRelatedProducts = async (category: string, currentProductId: string) => {
    try {
      setRelatedLoading(true);
      const response = await getProductsByCategory(category, 4);
      
      if (response.success && response.data) {
        // Filter out the current product from related products
        const filtered = response.data.data.filter(p => p._id !== currentProductId);
        setRelatedProducts(filtered.slice(0, 3)); // Show max 3 related products
      }
    } catch (err) {
      console.error('Error fetching related products:', err);
    } finally {
      setRelatedLoading(false);
    }
  };

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        const response = await getProduct(productId);
        
        if (response.success && response.data) {
          setProduct(response.data);
          // Fetch related products after getting the main product
          fetchRelatedProducts(response.data.category, response.data._id);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Set page title when product is loaded
  useEffect(() => {
    if (product) {
      const pageTitle = `${product.name} - ${product.category} | Eloska World`;
      const pageDescription = product.description || `Discover ${product.name} from our ${product.category} collection. Premium quality manufacturing with luxury finishes.`;
      
      document.title = pageTitle;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', pageDescription);
      }
      
      // Update Open Graph title
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', pageTitle);
      }
      
      // Update Open Graph description
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', pageDescription);
      }
    } else if (error) {
      document.title = 'Product Not Found | Eloska World';
    } else {
      document.title = 'Product Details | Eloska World';
    }
  }, [product, error]);


  // Handle download
  const handleDownload = () => {
    if (product && product.images && product.images.length > 0) {
      const imageUrl = getImageUrl(product.images[selectedImageIndex]);
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${product.name.replace(/\s+/g, '_')}_image.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Product image is being downloaded.",
      });
    }
  };

  // Handle inquiry submission
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5004/api'}/product-inquiries/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: product.name,
          productCode: product.productCode || product._id?.slice(-6) || 'N/A',
          category: product.category,
          subcategory: product.subcategory || '',
          company: inquiryData.company,
          name: inquiryData.name,
          email: inquiryData.email,
          phone: inquiryData.phone,
          message: inquiryData.message,
          quantity: 1
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Inquiry submitted successfully! We will contact you soon.",
        });
        setIsInquiryOpen(false);
        setInquiryData({ name: '', email: '', phone: '', company: '', message: '' });
      } else {
        throw new Error('Failed to submit inquiry');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast({
        title: "Error",
        description: "Failed to submit inquiry. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Button onClick={() => navigate(-1)} className="bg-primary hover:bg-primary-glow">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
                  </li>
                  <li className="text-gray-400">/</li>
                  <li>
                    <Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
                  </li>
                  <li className="text-gray-400">/</li>
                  <li className="text-gray-900 font-medium">{product.name}</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Product Images Section */}
        <div className="mb-6 sm:mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-[3/3] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={getImageUrl(product.images[selectedImageIndex])}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">No Image Available</span>
                  </div>
                )}
              </div>

            </div>

            {/* Product Basic Information */}
            <div className="space-y-4 sm:space-y-6">
              {/* Product Header */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary text-xs sm:text-sm">
                    {product.category}
                  </Badge>
                  {product.featured && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs sm:text-sm">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-gray-900 mb-2 leading-tight">
                  {product.name}
                </h1>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  ₹{product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg sm:text-xl text-gray-500 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
                <span className="text-xs sm:text-sm text-gray-600">per piece</span>
              </div>

              {/* Stock Status */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {product.inStock ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      In Stock
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                  {product.stockQuantity > 0 && (
                    <span className="text-sm text-gray-600">
                      {product.stockQuantity} pieces available
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Minimum Order:</span> {product.minimumQuantity} pieces
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setIsInquiryOpen(true)}
                  className="flex-1 bg-primary hover:bg-primary-glow text-white h-10 sm:h-12 text-sm sm:text-base"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Get Quote
                </Button>
                <div className="flex gap-2 sm:gap-3">
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="flex-1 sm:flex-none h-10 sm:h-12 px-3 sm:px-4 border-primary text-primary hover:bg-primary hover:text-white transition-colors text-sm sm:text-base"
                  >
                    <Download className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 sm:h-12 sm:w-12 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index
                          ? 'border-primary'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation - Desktop Only */}
        <div className="hidden sm:block mb-6 lg:mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'specifications', label: 'Specifications' },
                { id: 'pricing', label: 'Pricing Details' },
                { id: 'features', label: 'Features' },
                { id: 'additional', label: 'Additional Info' },
                { id: 'product-info', label: 'Product Info' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-6 sm:mb-8">
          {/* Mobile: Show all cards stacked */}
          <div className="block sm:hidden space-y-4">
            {/* Specifications Card */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                {product.specifications && Object.values(product.specifications).some(value => value) ? (
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(product.specifications).map(([key, value]) => {
                      if (!value) return null;
                      return (
                        <div key={key} className="space-y-1">
                          <span className="text-sm font-medium text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <p className="text-sm text-gray-900">{value}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500">No specifications available for this product.</p>
                )}
              </CardContent>
            </Card>

            {/* Pricing Details Card */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Details</h3>
                <div className="space-y-3">
                  <div className="flex flex-col py-2 border-b border-gray-100 gap-1">
                    <span className="text-sm font-medium text-gray-600">Current Price</span>
                    <span className="text-lg font-bold text-primary">₹{product.price}</span>
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex flex-col py-2 border-b border-gray-100 gap-1">
                      <span className="text-sm font-medium text-gray-600">Original Price</span>
                      <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                    </div>
                  )}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex flex-col py-2 border-b border-gray-100 gap-1">
                      <span className="text-sm font-medium text-gray-600">You Save</span>
                      <span className="text-sm font-bold text-green-600">
                        ₹{product.originalPrice - product.price} ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%)
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col py-2 gap-1">
                    <span className="text-sm font-medium text-gray-600">Price per piece</span>
                    <span className="text-sm text-gray-900">₹{product.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Card */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                {product.features && product.features.length > 0 ? (
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No features listed for this product.</p>
                )}
              </CardContent>
            </Card>

            {/* Additional Information Card */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Description</span>
                    <p className="text-sm text-gray-700 mt-1 leading-relaxed">{product.description}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 pt-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Created</span>
                      <p className="text-sm text-gray-700">
                        {new Date(product.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Last Updated</span>
                      <p className="text-sm text-gray-700">
                        {new Date(product.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Information Card */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Product Code</span>
                      <p className="text-sm text-gray-900 font-mono">{product.productCode || product._id?.slice(-6) || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Category</span>
                      <p className="text-sm text-gray-900">{product.category}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Collection</span>
                      <p className="text-sm text-gray-900">{product.collection}</p>
                    </div>
                    {product.subcategory && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Subcategory</span>
                        <p className="text-sm text-gray-900">{product.subcategory}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Status</span>
                      <p className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Minimum Order</span>
                      <p className="text-sm text-gray-900">{product.minimumQuantity} pieces</p>
                    </div>
                    {product.stockQuantity > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Available Stock</span>
                        <p className="text-sm text-gray-900">{product.stockQuantity} pieces</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Desktop: Show only active tab */}
          <div className="hidden sm:block">
            {activeTab === 'specifications' && (
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                {product.specifications && Object.values(product.specifications).some(value => value) ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => {
                      if (!value) return null;
                      return (
                        <div key={key} className="space-y-1">
                          <span className="text-sm font-medium text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <p className="text-sm text-gray-900">{value}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500">No specifications available for this product.</p>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'pricing' && (
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Details</h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-1 sm:gap-0">
                    <span className="text-sm font-medium text-gray-600">Current Price</span>
                    <span className="text-lg font-bold text-primary">₹{product.price}</span>
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-1 sm:gap-0">
                      <span className="text-sm font-medium text-gray-600">Original Price</span>
                      <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                    </div>
                  )}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-1 sm:gap-0">
                      <span className="text-sm font-medium text-gray-600">You Save</span>
                      <span className="text-sm font-bold text-green-600">
                        ₹{product.originalPrice - product.price} ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%)
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-1 sm:gap-0">
                    <span className="text-sm font-medium text-gray-600">Price per piece</span>
                    <span className="text-sm text-gray-900">₹{product.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'features' && (
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                {product.features && product.features.length > 0 ? (
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No features listed for this product.</p>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'additional' && (
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Description</span>
                    <p className="text-sm text-gray-700 mt-1 leading-relaxed">{product.description}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Created</span>
                      <p className="text-sm text-gray-700">
                        {new Date(product.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Last Updated</span>
                      <p className="text-sm text-gray-700">
                        {new Date(product.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'product-info' && (
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Product Code</span>
                      <p className="text-sm text-gray-900 font-mono">{product.productCode || product._id?.slice(-6) || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Collection</span>
                      <p className="text-sm text-gray-900">{product.collection}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Category</span>
                      <p className="text-sm text-gray-900">{product.category}</p>
                    </div>
                    {product.subcategory && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Subcategory</span>
                        <p className="text-sm text-gray-900">{product.subcategory}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Minimum Order</span>
                      <p className="text-sm text-gray-900">{product.minimumQuantity} pieces</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Stock Status</span>
                      <p className="text-sm text-gray-900">
                        {product.inStock ? `${product.stockQuantity} pieces available` : 'Out of Stock'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Status</span>
                      <p className="text-sm text-gray-900 capitalize">{product.status}</p>
                    </div>
                    {product.tags && product.tags.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Tags</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-playfair font-bold">
                <span className="text-black">Related</span> <span className="text-primary">Products</span>
              </h2>
            {product?.category && (
              <Link 
                to={`/products?category=${product.category}`}
                className="text-primary hover:text-primary-glow font-medium text-sm self-start sm:self-auto"
              >
                View All in {product.category} →
              </Link>
            )}
          </div>
            
          {relatedLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
                  <CardContent className="p-3 sm:p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct._id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <Link to={`/products/${relatedProduct._id}`}>
                    <div className="aspect-[4/3] bg-white overflow-hidden">
                      {relatedProduct.images && relatedProduct.images.length > 0 ? (
                        <img
                          src={getImageUrl(relatedProduct.images[0])}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                          {relatedProduct.category}
                        </Badge>
                        {relatedProduct.featured && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors text-sm sm:text-base">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                        {relatedProduct.description}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                        <span className="text-base sm:text-lg font-bold text-primary">
                          ₹{relatedProduct.price}
                        </span>
                        {relatedProduct.originalPrice && relatedProduct.originalPrice > relatedProduct.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{relatedProduct.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          {relatedProduct.inStock ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                              In Stock
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-xs">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          Min: {relatedProduct.minimumQuantity} pcs
                        </span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No related products found in this category.</p>
              <p className="text-gray-400 text-sm mt-2">Check back later for more products!</p>
            </div>
          )}
        </div>
      </div>

      {/* Inquiry Modal */}
      {isInquiryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Get Quote</h2>
                <button
                  onClick={() => setIsInquiryOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryData.name}
                    onChange={(e) => setInquiryData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={inquiryData.email}
                    onChange={(e) => setInquiryData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={inquiryData.phone}
                    onChange={(e) => setInquiryData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={inquiryData.company}
                    onChange={(e) => setInquiryData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={inquiryData.message}
                    onChange={(e) => setInquiryData(prev => ({ ...prev, message: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tell us about your requirements..."
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsInquiryOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary-glow"
                  >
                    Submit Inquiry
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
