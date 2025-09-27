import { Award, Users, Globe, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const stats = [
    { icon: <Clock className="h-8 w-8" />, value: "15+", label: "Years Experience" },
    { icon: <Users className="h-8 w-8" />, value: "500+", label: "Happy Clients" },
    { icon: <Globe className="h-8 w-8" />, value: "25+", label: "Countries Served" },
    { icon: <Award className="h-8 w-8" />, value: "50+", label: "Products Manufactured" },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 luxury-gradient text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 animate-fade-in">
              About <span className="text-white">Eloska World</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 animate-slide-up">
              Crafting excellence in manufacturing since our inception, we are your trusted partner 
              for premium quality products that define luxury and sophistication.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-playfair font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6">
                Our <span className="text-luxury">Story</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded with a vision to revolutionize the manufacturing industry, Eloska World has 
                  grown from a small workshop to a leading manufacturer serving clients across the globe. 
                  Our journey began with a simple belief: every product deserves to be crafted with 
                  passion, precision, and perfection.
                </p>
                <p>
                  Today, we specialize in manufacturing premium Face Masks, Ladies Kurtis, elegant Scarfs, 
                  durable Bag Fabrics, and exquisite Sari Mirrors. Each product reflects our commitment 
                  to quality, innovation, and customer satisfaction.
                </p>
                <p>
                  Our state-of-the-art manufacturing facilities, combined with our skilled artisans and 
                  modern technology, enable us to deliver products that not only meet but exceed 
                  international quality standards.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-card">
                <CardContent className="p-6 text-center">
                  <h3 className="font-playfair font-semibold text-lg mb-2">Our Mission</h3>
                  <p className="text-sm text-muted-foreground">
                    To deliver exceptional quality products that enhance the lives of our customers while 
                    maintaining ethical manufacturing practices.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card mt-8">
                <CardContent className="p-6 text-center">
                  <h3 className="font-playfair font-semibold text-lg mb-2">Our Vision</h3>
                  <p className="text-sm text-muted-foreground">
                    To be the world's most trusted and innovative manufacturing partner, setting new 
                    standards of excellence in every product we create.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
              Our <span className="text-luxury">Values</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card hover:shadow-luxury transition-luxury">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-playfair font-semibold mb-4">Quality Excellence</h3>
                <p className="text-muted-foreground">
                  We never compromise on quality. Every product undergoes rigorous testing to ensure 
                  it meets our high standards and exceeds customer expectations.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-luxury transition-luxury">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-playfair font-semibold mb-4">Customer Focus</h3>
                <p className="text-muted-foreground">
                  Our customers are at the heart of everything we do. We listen, understand, and 
                  deliver solutions that truly meet their needs and aspirations.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card hover:shadow-luxury transition-luxury">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-playfair font-semibold mb-4">Sustainability</h3>
                <p className="text-muted-foreground">
                  We are committed to sustainable manufacturing practices that protect our environment 
                  while delivering products that last for generations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;