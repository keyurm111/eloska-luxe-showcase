import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import scarfsImage from '@/assets/scarfs-collection.jpg';

const Scarfs = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Scarfs' },
    { id: 'bandhani', name: 'Cotton Hand Printed Bandhani Scarf' },
    { id: 'batik', name: 'Ladies Batik Printed Silk Scarf' },
    { id: 'striped', name: 'Striped Cotton Scarf' },
    { id: 'white', name: 'White Scarf' },
    { id: 'baby', name: 'Baby Scarfs' },
  ];

  const products = [
    {
      id: 1,
      name: 'Bandhani Cotton Scarf',
      category: 'bandhani',
      price: '₹450/piece',
      image: scarfsImage,
      description: 'Traditional hand-printed Bandhani cotton scarf with vibrant colors',
      features: ['100% Cotton', 'Hand-printed design', 'Color-fast dyes'],
      rating: 4.9
    },
    {
      id: 2,
      name: 'Silk Batik Printed Scarf',
      category: 'batik',
      price: '₹1,200/piece',
      image: scarfsImage,
      description: 'Luxurious silk scarf with intricate Batik print patterns',
      features: ['Pure silk material', 'Batik printing', 'Elegant finish'],
      rating: 4.8
    },
    {
      id: 3,
      name: 'Striped Cotton Scarf',
      category: 'striped',
      price: '₹320/piece',
      image: scarfsImage,
      description: 'Classic striped cotton scarf perfect for casual wear',
      features: ['Soft cotton blend', 'Multiple color options', 'Breathable fabric'],
      rating: 4.6
    },
    {
      id: 4,
      name: 'Pure White Scarf',
      category: 'white',
      price: '₹380/piece',
      image: scarfsImage,
      description: 'Elegant white scarf suitable for formal and casual occasions',
      features: ['Premium white fabric', 'Versatile styling', 'Easy care'],
      rating: 4.7
    },
    {
      id: 5,
      name: 'Baby Cotton Scarf',
      category: 'baby',
      price: '₹180/piece',
      image: scarfsImage,
      description: 'Soft and gentle scarf designed specifically for babies',
      features: ['Hypoallergenic material', 'Baby-safe dyes', 'Extra soft texture'],
      rating: 4.9
    },
    {
      id: 6,
      name: 'Designer Bandhani Scarf',
      category: 'bandhani',
      price: '₹680/piece',
      image: scarfsImage,
      description: 'Premium Bandhani scarf with contemporary design elements',
      features: ['Designer patterns', 'Premium cotton', 'Gift packaging'],
      rating: 4.8
    },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 luxury-gradient text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 animate-fade-in">
              Luxury <span className="text-white">Scarfs</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 animate-slide-up">
              Explore our exquisite collection of premium scarfs - from traditional Bandhani 
              to contemporary silk designs that add elegance to every outfit.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-background border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="transition-luxury text-xs sm:text-sm"
                size="sm"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
              Premium <span className="text-luxury">Scarfs Collection</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each scarf is carefully crafted using traditional techniques and premium materials to ensure comfort, style, and durability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group bg-card hover:shadow-luxury transition-luxury overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-luxury"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-luxury" />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-white">
                      ★ {product.rating}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-luxury">
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-white text-primary hover:bg-white/90">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-playfair font-semibold group-hover:text-primary transition-luxury">
                      {product.name}
                    </h3>
                    <span className="text-lg font-semibold text-primary">
                      {product.price}
                    </span>
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
              Bulk Orders & <span className="text-luxury">Custom Designs</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Looking for bulk quantities or custom designs? We offer competitive pricing for wholesale orders 
              and can create custom patterns according to your specifications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-glow">
                <Link to="/contact">Request Bulk Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/about">Our Manufacturing Process</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Scarfs;