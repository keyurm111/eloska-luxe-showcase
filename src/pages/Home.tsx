import { Link } from 'react-router-dom';
import { ArrowRight, Star, Award, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import heroImage from '@/assets/hero-image.jpg';
import mirrorsImage from '@/assets/mirrors-collection.jpg';
import scarfsImage from '@/assets/scarfs-collection.jpg';
import bagFabricImage from '@/assets/bag-fabric-collection.jpg';

const Home = () => {
  const features = [
    {
      icon: <Star className="h-8 w-8" />,
      title: "Premium Quality",
      description: "Crafted with the finest materials and attention to detail"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Award Winning",
      description: "Recognized for excellence in manufacturing and design"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Reach",
      description: "Serving customers worldwide with reliable delivery"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Trusted Partner",
      description: "Preferred choice of retailers and fashion brands"
    }
  ];

  const productCategories = [
    {
      title: "Mirror Collection",
      description: "Exquisite mirrors from silver to artistic designs",
      image: mirrorsImage,
      link: "/mirrors",
      items: "7+ Categories"
    },
    {
      title: "Luxury Scarfs",
      description: "Premium silk and cotton scarfs with intricate designs",
      image: scarfsImage,
      link: "/scarfs",
      items: "5+ Varieties"
    },
    {
      title: "Bag Fabrics",
      description: "Durable and stylish fabrics for all bag types",
      image: bagFabricImage,
      link: "/bag-fabric",
      items: "3+ Types"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(139, 0, 0, 0.4)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6 animate-fade-in">
            Luxury in Every Detail
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 font-inter animate-slide-up">
            <span className="text-luxury font-semibold">Eloska World</span> - Leading manufacturer of premium 
            Face Masks, Ladies Kurtis, Scarfs, Bag Fabrics, and Sari Mirrors
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <Button size="lg" className="bg-primary hover:bg-primary-glow text-white shadow-luxury transition-luxury group">
              Explore Our Collection
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary transition-luxury">
              <Link to="/about">Learn About Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">
              Our <span className="text-luxury">Premium Collections</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our carefully curated range of luxury products, each crafted with precision and elegance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productCategories.map((category, index) => (
              <Card key={index} className="group bg-card border hover:shadow-luxury transition-luxury overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-luxury"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-sm font-inter bg-primary px-2 py-1 rounded">
                      {category.items}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-playfair font-semibold mb-2 group-hover:text-primary transition-luxury">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  <Button asChild variant="ghost" className="p-0 h-auto text-primary hover:text-primary-glow">
                    <Link to={category.link} className="flex items-center">
                      View Collection
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">
              Why Choose <span className="text-luxury">Eloska World?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the difference of working with industry leaders in luxury manufacturing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-luxury">
                  <div className="text-primary">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-playfair font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow opacity-90" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">
              Ready to Experience Luxury?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Contact us today to discuss your manufacturing needs and discover how we can bring your vision to life
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 shadow-elegant">
                <Link to="/contact">Get in Touch</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;