import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, ShoppingCart, Star, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Import images
import mirrorsImage from '@/assets/mirrors-collection.jpg';
import scarfsImage from '@/assets/scarfs-collection.jpg';
import bagFabricImage from '@/assets/bag-fabric-collection.jpg';

const Products = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // All product data organized by category
  const productData = {
    'regular-silver': {
      title: 'Regular Silver Mirrors',
      description: 'High-quality regular silver mirrors with crystal clear reflection and premium finish.',
      products: [
        {
          id: 1,
          name: 'Round Shape Silver Mirrors for Art (4mm to 60mm)',
          category: 'regular-silver',
          price: '₹81.00',
          originalPrice: '₹199.00',
          image: mirrorsImage,
          description: 'Round shape silver mirrors for art ranging from 4mm to 60mm',
          features: ['Round Shape', '4mm to 60mm', 'Art Quality'],
          rating: 4.8
        }
        // Add more products here
      ]
    },
    'fancy': {
      title: 'Fancy Mirrors',
      description: 'Unique and decorative fancy mirrors with artistic designs and special shapes.',
      products: [
        {
          id: 1,
          name: 'Fancy Butterfly Shape Silver Mirror 1421',
          category: 'fancy',
          price: '₹450/piece',
          image: mirrorsImage,
          description: 'Artistic butterfly-shaped mirror perfect for decorative purposes',
          features: ['Butterfly Shape', 'Decorative', 'Artistic Design'],
          rating: 4.7
        }
        // Add more products here
      ]
    }
    // Add more categories here
  };

  const currentCategory = productData[category as keyof typeof productData];

  useEffect(() => {
    if (!currentCategory) {
      navigate('/');
    }
  }, [category, currentCategory, navigate]);

  if (!currentCategory) {
    return null;
  }

  const filteredProducts = currentCategory.products;
  
  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Products Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
              <span className="text-luxury">{currentCategory.title}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each product is crafted with precision and attention to detail, ensuring perfect quality and lasting durability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProducts.map((product) => (
              <Card key={product.id} className="group bg-card hover:shadow-luxury transition-luxury overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Badge className="bg-primary text-primary-foreground">
                      {product.rating} ⭐
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-playfair font-semibold group-hover:text-primary transition-luxury">
                      {product.name}
                    </h3>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-primary">
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          {product.originalPrice}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    {product.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-semibold">Key Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Star className="h-3 w-3 text-primary mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-primary hover:bg-primary-glow">
                      Get Quote
                    </Button>
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center space-x-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 ${
                          currentPage === page
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-primary/10'
                        }`}
                      >
                        {page}
                      </Button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return <span key={page} className="px-2 text-muted-foreground">...</span>;
                  }
                  return null;
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Page Info */}
          {totalPages > 1 && (
            <div className="text-center mt-4 text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;
