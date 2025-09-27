import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart, Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import bagFabricImage from '@/assets/bag-fabric-collection.jpg';

const BagFabric = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Fabrics' },
    { id: 'digital', name: 'Digital Print Fabric' },
    { id: 'school', name: 'School Bag Fabric' },
    { id: 'waterproof', name: 'Waterproof PU Coated Antifree Fabric' },
  ];

  const products = [
    {
      id: 1,
      name: 'Digital Print Canvas Fabric',
      category: 'digital',
      price: '₹85/meter',
      image: bagFabricImage,
      description: 'High-resolution digital print fabric perfect for trendy bags and accessories',
      features: ['HD digital printing', 'Fade-resistant colors', 'Durable canvas base'],
      rating: 4.8,
      specs: { weight: '350 GSM', width: '58 inches', composition: '100% Cotton Canvas' }
    },
    {
      id: 2,
      name: 'School Bag Oxford Fabric',
      category: 'school',
      price: '₹65/meter',
      image: bagFabricImage,
      description: 'Sturdy Oxford fabric designed specifically for school bags and backpacks',
      features: ['Extra strength', 'Easy to clean', 'Child-safe materials'],
      rating: 4.9,
      specs: { weight: '400 GSM', width: '60 inches', composition: 'Polyester Oxford' }
    },
    {
      id: 3,
      name: 'Waterproof PU Coated Fabric',
      category: 'waterproof',
      price: '₹120/meter',
      image: bagFabricImage,
      description: 'Premium waterproof fabric with PU coating and antifree properties',
      features: ['100% waterproof', 'Antifree coating', 'Temperature resistant'],
      rating: 4.7,
      specs: { weight: '450 GSM', width: '58 inches', composition: 'PU Coated Polyester' }
    },
    {
      id: 4,
      name: 'Custom Digital Print Fabric',
      category: 'digital',
      price: '₹95/meter',
      image: bagFabricImage,
      description: 'Custom digital print fabric with your own designs and patterns',
      features: ['Custom designs', 'Minimum order 50m', 'Quick turnaround'],
      rating: 4.6,
      specs: { weight: '320 GSM', width: '58 inches', composition: 'Cotton-Poly Blend' }
    },
    {
      id: 5,
      name: 'Heavy Duty School Fabric',
      category: 'school',
      price: '₹75/meter',
      image: bagFabricImage,
      description: 'Extra heavy-duty fabric for premium school bags and sports bags',
      features: ['Tear-resistant', 'Reinforced weave', 'Long-lasting'],
      rating: 4.8,
      specs: { weight: '500 GSM', width: '60 inches', composition: 'Ripstop Nylon' }
    },
    {
      id: 6,
      name: 'Marine Grade Waterproof Fabric',
      category: 'waterproof',
      price: '₹150/meter',
      image: bagFabricImage,
      description: 'Marine-grade waterproof fabric for extreme weather conditions',
      features: ['Marine grade quality', 'UV resistant', 'Extreme durability'],
      rating: 4.9,
      specs: { weight: '520 GSM', width: '58 inches', composition: 'PVC Coated Polyester' }
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
              Bag <span className="text-white">Fabrics</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 animate-slide-up">
              Discover our comprehensive range of premium bag fabrics - from digital prints 
              to waterproof materials, designed for durability and style.
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
              Premium <span className="text-luxury">Bag Fabrics</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our bag fabrics are engineered for strength, durability, and style. Perfect for manufacturers 
              and designers looking for reliable materials.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group bg-card hover:shadow-luxury transition-luxury overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="relative md:w-1/3 h-64 md:h-auto overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-luxury"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary text-white">
                        ★ {product.rating}
                      </Badge>
                    </div>
                    {product.category === 'waterproof' && (
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-blue-600 text-white">
                          <Shield className="h-3 w-3 mr-1" />
                          Waterproof
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="flex-1 p-6">
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
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Key Features:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <Star className="h-3 w-3 text-primary mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Specifications:</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>Weight: {product.specs.weight}</div>
                          <div>Width: {product.specs.width}</div>
                          <div>Material: {product.specs.composition}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-primary hover:bg-primary-glow">
                        Request Sample
                      </Button>
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
              Technical <span className="text-luxury">Specifications</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              All our fabrics meet international quality standards and are tested for durability and performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card text-center">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-playfair font-semibold mb-2">Quality Assurance</h3>
                <p className="text-sm text-muted-foreground">
                  All fabrics undergo rigorous quality testing including tear strength, 
                  color fastness, and durability tests.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card text-center">
              <CardContent className="p-6">
                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-playfair font-semibold mb-2">Custom Solutions</h3>
                <p className="text-sm text-muted-foreground">
                  We offer custom fabric solutions including specific weights, 
                  colors, and coating requirements.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card text-center">
              <CardContent className="p-6">
                <Eye className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-playfair font-semibold mb-2">Sample Service</h3>
                <p className="text-sm text-muted-foreground">
                  Free samples available for bulk orders. Test our quality 
                  before making large purchases.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
              Ready for Your <span className="text-luxury">Next Project?</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you're a bag manufacturer, designer, or retailer, we have the perfect fabric solution 
              for your needs. Contact us for samples and bulk pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-glow">
                <Link to="/contact">Request Samples</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/about">Manufacturing Capabilities</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BagFabric;