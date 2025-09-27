import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import mirrorsImage from '@/assets/mirrors-collection.jpg';

const Mirrors = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Mirrors' },
    { id: 'silver', name: 'Regular Silver Mirrors' },
    { id: 'fancy', name: 'Fancy Mirrors' },
    { id: 'artistic', name: 'Artistic Mirrors' },
    { id: 'kit', name: 'Kit Mirrors for Art' },
    { id: 'acrylic', name: 'Acrylic Mirror' },
    { id: 'catalogues', name: 'Catalogues' },
    { id: 'sheets', name: 'Mirror Sheets' },
  ];

  const products = [
    {
      id: 1,
      name: 'Premium Silver Mirror',
      category: 'silver',
      price: '₹250/sq ft',
      image: mirrorsImage,
      description: 'High-quality silver mirror with crystal clear reflection',
      features: ['Anti-scratch coating', 'Moisture resistant', 'Easy installation'],
      rating: 4.8
    },
    {
      id: 2,
      name: 'Artistic Decorative Mirror',
      category: 'artistic',
      price: '₹850/piece',
      image: mirrorsImage,
      description: 'Handcrafted artistic mirror perfect for home décor',
      features: ['Unique design', 'Premium frame', 'Wall mounting kit'],
      rating: 4.9
    },
    {
      id: 3,
      name: 'Fancy Beveled Mirror',
      category: 'fancy',
      price: '₹420/sq ft',
      image: mirrorsImage,
      description: 'Elegant beveled edge mirror for luxury interiors',
      features: ['Beveled edges', 'Safety backing', 'Custom sizes'],
      rating: 4.7
    },
    {
      id: 4,
      name: 'Art Kit Mirror Tiles',
      category: 'kit',
      price: '₹180/set',
      image: mirrorsImage,
      description: 'Mirror tiles perfect for DIY art projects',
      features: ['Self-adhesive', 'Various shapes', 'Easy to cut'],
      rating: 4.6
    },
    {
      id: 5,
      name: 'Acrylic Safety Mirror',
      category: 'acrylic',
      price: '₹320/sq ft',
      image: mirrorsImage,
      description: 'Shatterproof acrylic mirror for safe environments',
      features: ['Unbreakable', 'Lightweight', 'UV resistant'],
      rating: 4.5
    },
    {
      id: 6,
      name: 'Mirror Sheet Roll',
      category: 'sheets',
      price: '₹150/sq ft',
      image: mirrorsImage,
      description: 'Flexible mirror sheet for industrial applications',
      features: ['Flexible material', 'Easy application', 'Bulk available'],
      rating: 4.4
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
              Mirror <span className="text-white">Collection</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 animate-slide-up">
              Discover our premium range of mirrors - from regular silver mirrors to artistic 
              masterpieces that transform any space into a work of art.
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
                className="transition-luxury"
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
              Premium <span className="text-luxury">Mirrors</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each mirror is crafted with precision and attention to detail, ensuring perfect reflection and lasting durability.
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
              Need Custom <span className="text-luxury">Mirrors?</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              We specialize in custom mirror solutions. Whether you need specific sizes, shapes, or finishes, 
              our team can create the perfect mirror for your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-glow">
                <Link to="/contact">Request Custom Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/about">Learn About Our Process</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mirrors;