import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for your inquiry. We'll get back to you soon.",
    });
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      details: "info@eloskaworld.com",
      subtitle: "We'll respond within 24 hours"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      details: "+91 XXXXX XXXXX",
      subtitle: "Mon-Fri, 9AM-6PM IST"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Visit Us",
      details: "Your Business Address",
      subtitle: "Manufacturing Facility"
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 luxury-gradient text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 animate-fade-in">
              Get in <span className="text-white">Touch</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 animate-slide-up">
              Ready to discuss your manufacturing needs? We're here to help bring your vision to life 
              with our premium quality products and exceptional service.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="bg-card hover:shadow-luxury transition-luxury text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-primary">
                      {info.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-playfair font-semibold mb-2">
                    {info.title}
                  </h3>
                  <p className="text-lg font-semibold text-primary mb-1">
                    {info.details}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {info.subtitle}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6">
                Send us a <span className="text-luxury">Message</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Whether you're looking for custom manufacturing solutions, bulk orders, or have questions 
                about our products, we're here to help. Fill out the form and we'll get back to you promptly.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-playfair font-semibold text-lg mb-2">Business Hours</h3>
                  <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                  <p className="text-muted-foreground">Saturday: 9:00 AM - 1:00 PM IST</p>
                  <p className="text-muted-foreground">Sunday: Closed</p>
                </div>
                
                <div>
                  <h3 className="font-playfair font-semibold text-lg mb-2">Response Time</h3>
                  <p className="text-muted-foreground">
                    We typically respond to all inquiries within 24 hours during business days.
                  </p>
                </div>
              </div>
            </div>

            <Card className="bg-card shadow-luxury">
              <CardHeader>
                <CardTitle className="text-2xl font-playfair">Contact Form</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                        className="bg-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                        className="bg-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="bg-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        required
                        className="bg-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your requirements..."
                      rows={6}
                      required
                      className="bg-input"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary-glow transition-luxury group">
                    Send Message
                    <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
              Find Our <span className="text-luxury">Location</span>
            </h2>
            <p className="text-muted-foreground">
              Visit our manufacturing facility to see our processes and meet our team
            </p>
          </div>
          
          <div className="bg-muted rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-playfair font-semibold mb-2">Interactive Map</h3>
              <p className="text-muted-foreground">
                Google Maps integration will be added here<br />
                showing your actual business location
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;