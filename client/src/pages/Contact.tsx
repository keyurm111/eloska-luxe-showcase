import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { usePageTitle } from '@/hooks/use-page-title';

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

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isVisible] as const;
};

const Contact = () => {
  // Set page title
  usePageTitle({
    title: "Contact Us - Eloska World | Get in Touch",
    description: "Contact Eloska World for inquiries about our premium manufacturing services. Reach us via phone, email, or visit our facility. We're here to help with your luxury product needs."
  });
  
  // Scroll animation hooks for different sections
  const [heroRef, heroVisible] = useScrollAnimation();
  const [contactInfoRef, contactInfoVisible] = useScrollAnimation();
  const [formRef, formVisible] = useScrollAnimation();
  const [mapRef, mapVisible] = useScrollAnimation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    console.log('Submitting contact form:', formData);
    
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/normal-inquiries/submit`;
      console.log('Making request to:', apiUrl);
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Response data:', result);

      if (result.success) {
        toast({
          title: "Message Sent!",
          description: "Thank you for your inquiry. We'll get back to you soon.",
        });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      let errorMessage = 'Failed to send message. Please try again.';
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.message) {
        errorMessage = `Failed to send message: ${error.message}`;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
      details: "+91 9978064763",
      subtitle: "Mon-Fri, 9AM-6PM IST",
      additionalDetails: "+91 9924747157"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Visit Us",
      details: "PLOT NO,3,GR FLOOR,OPP KATARGAM POLICE STATION,HAZRAT PALNAPIR DARGAH, Surat, Gujarat 395004",
      subtitle: "Manufacturing Facility",
      link: "https://maps.app.goo.gl/rETatoTSsivLE3mV6?g_st=aw"
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Header Section */}
      <section ref={heroRef} className="py-20 bg-background">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className={`text-center transition-all duration-1000 ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6">
              Get in <span className="text-luxury">Touch</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Get in touch with us for your manufacturing needs. We're here to help bring your vision to life.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Details Section */}
      <section ref={contactInfoRef} className="py-20 bg-background">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 transition-all duration-1000 ${
            contactInfoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Left Side - Contact Form */}
            <div ref={formRef} className={`transition-all duration-1000 delay-300 ${
              contactInfoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h2 className="text-3xl font-playfair font-bold mb-6">
                Send us a <span className="text-luxury">Message</span>
              </h2>
              
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

                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary-glow transition-luxury group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                      <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Contact Details */}
            <div className={`flex flex-col h-full transition-all duration-1000 delay-500 ${
              contactInfoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h2 className="text-3xl font-playfair font-bold mb-6">
                <span className="text-black">Reach</span> <span className="text-luxury">Us</span>
              </h2>

              <Card className="bg-card shadow-luxury flex-1">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="space-y-4 flex-1">
                    {contactInfo.map((info, index) => (
                      <div key={index} className={`flex items-start space-x-4 p-4 bg-background rounded-lg transition-all duration-700 ${
                        contactInfoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`} style={{
                        transitionDelay: contactInfoVisible ? `${index * 200}ms` : '0ms'
                      }}>
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <div className="text-primary">
                            {info.icon}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-playfair font-semibold mb-1">
                            {info.title}
                          </h3>
                          {info.link ? (
                            <a 
                              href={info.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-base font-semibold text-primary mb-1 hover:text-primary-glow transition-colors"
                            >
                              {info.details}
                            </a>
                          ) : (
                            <p className="text-base font-semibold text-primary mb-1">
                              {info.details}
                              {info.additionalDetails && `, ${info.additionalDetails}`}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {info.subtitle}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-start space-x-4 p-4 bg-background rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="text-primary">
                          <Clock className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-playfair font-semibold mb-1">Business Hours</h3>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                          <p className="text-xs text-muted-foreground">Saturday: 9:00 AM - 1:00 PM IST</p>
                          <p className="text-xs text-muted-foreground">Sunday: Closed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section ref={mapRef} className="py-16 bg-background">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className={`text-center mb-8 transition-all duration-1000 ${
            mapVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
              Find Our <span className="text-luxury">Location</span>
            </h2>
            <p className="text-muted-foreground">
              Visit our manufacturing facility to see our processes and meet our team
            </p>
          </div>
          
          <div className={`rounded-lg overflow-hidden shadow-luxury transition-all duration-1000 delay-300 ${
            mapVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.1234567890!2d72.8318763!3d21.2164815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f64f1383abf%3A0xdeb4c1cda8a4b7cf!2sELOSKA%20WORLD!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Eloska World Location - Surat, Gujarat"
            ></iframe>
          </div>
          
          <div className="mt-6 text-center">
            <a 
              href="https://maps.app.goo.gl/rETatoTSsivLE3mV6?g_st=aw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:text-primary-glow transition-colors"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;