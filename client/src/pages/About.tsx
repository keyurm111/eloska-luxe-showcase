import { Award, Users, Globe, Clock, Building2, Shield, Truck, CreditCard, CheckCircle, Star, Factory, Warehouse, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

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

const About = () => {
  // Scroll animation hooks for different sections
  const [heroRef, heroVisible] = useScrollAnimation();
  const [overviewRef, overviewVisible] = useScrollAnimation();
  const [statsRef, statsVisible] = useScrollAnimation();
  const [basicInfoRef, basicInfoVisible] = useScrollAnimation();
  const [isoRef, isoVisible] = useScrollAnimation();
  const [whyChooseRef, whyChooseVisible] = useScrollAnimation();
  const [facilitiesRef, facilitiesVisible] = useScrollAnimation();
  const [ctaRef, ctaVisible] = useScrollAnimation();

  const stats = [
    { icon: <Clock className="h-8 w-8" />, value: "4+", label: "Years Experience" },
    { icon: <Users className="h-8 w-8" />, value: "26-50", label: "Employees" },
    { icon: <Globe className="h-8 w-8" />, value: "40L-1.5Cr", label: "Annual Turnover" },
    { icon: <Award className="h-8 w-8" />, value: "ISO 9001:2015", label: "Certified" },
  ];

  const basicInfo = [
    { label: "Nature of Business", value: "Manufacturer" },
    { label: "Additional Business", value: "Office / Sale Office" },
    { label: "Company CEO", value: "PRASHANT SAVAJIBHAI GADHIYA" },
    { label: "Total Number of Employees", value: "26 to 50 People" },
    { label: "GST Registration Date", value: "23-11-2020" },
    { label: "Legal Status of Firm", value: "Proprietorship" },
    { label: "Annual Turnover", value: "40 L - 1.5 Cr" },
  ];

  const statutoryInfo = [
    { label: "Import Export Code (IEC)", value: "CFZPG4693H" },
    { label: "GST No.", value: "24CFZPG4693H1ZT" },
  ];

  const banks = [
    "Sutex Co-operative Bank",
    "HDFC Bank"
  ];

  const paymentModes = [
    "Cash", "Credit Card", "Cheque", "DD", "Bank Transfer", "RTGS"
  ];

  const whyUsReasons = [
    "Adroit team of professionals",
    "Transparent dealings",
    "Positive records",
    "Well-equipped warehouse"
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section ref={heroRef} className="py-12 sm:py-16 lg:py-20 relative overflow-visible">
        
         <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
           <div className={`max-w-4xl mx-auto relative py-8 sm:py-12 lg:py-20 px-4 sm:px-8 lg:px-20 transition-all duration-1000 ${
             heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
           }`}>
             {/* Decorative Illustrations - 8 Directions Around Text */}
             <div className="absolute inset-0 pointer-events-none overflow-visible">
               {/* Top */}
               <img 
                 src="/eloska images/9.png" 
                 alt="Eloska World Product" 
                 className="absolute -top-8 sm:-top-12 lg:-top-16 left-1/2 transform -translate-x-1/2 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 object-cover rotate-12 hover:rotate-0 transition-transform duration-300"
               />

               {/* Top Right */}
               <img 
                 src="/eloska images/10.png" 
                 alt="Eloska World Product" 
                 className="absolute -top-6 sm:-top-8 lg:-top-12 -right-4 sm:-right-6 lg:-right-8 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 object-cover transform -rotate-12 hover:rotate-0 transition-transform duration-300"
               />

               {/* Right */}
               <img 
                 src="/eloska images/11.png" 
                 alt="Eloska World Product" 
                 className="absolute top-1/2 -right-6 sm:-right-8 lg:-right-12 transform -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 object-cover -rotate-90 hover:rotate-0 transition-transform duration-300"
               />

               {/* Bottom Right */}
               <img 
                 src="/eloska images/12.png" 
                 alt="Eloska World Product" 
                 className="absolute -bottom-6 sm:-bottom-8 lg:-bottom-12 -right-4 sm:-right-6 lg:-right-8 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 object-cover transform rotate-6 hover:rotate-0 transition-transform duration-300"
               />

               {/* Bottom */}
               <img 
                 src="/eloska images/13.png" 
                 alt="Eloska World Product" 
                 className="absolute -bottom-8 sm:-bottom-12 lg:-bottom-16 left-1/2 transform -translate-x-1/2 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 object-cover -rotate-12 hover:rotate-0 transition-transform duration-300"
               />

               {/* Bottom Left */}
               <img 
                 src="/eloska images/14.png" 
                 alt="Eloska World Product" 
                 className="absolute -bottom-6 sm:-bottom-8 lg:-bottom-12 -left-4 sm:-left-6 lg:-left-8 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 object-cover transform -rotate-6 hover:rotate-0 transition-transform duration-300"
               />

               {/* Left */}
               <img 
                 src="/eloska images/15.png" 
                 alt="Eloska World Product" 
                 className="absolute top-1/2 -left-6 sm:-left-8 lg:-left-12 transform -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 object-cover rotate-90 hover:rotate-0 transition-transform duration-300"
               />

               {/* Top Left */}
               <img 
                 src="/eloska images/16.png" 
                 alt="Eloska World Product" 
                 className="absolute -top-6 sm:-top-8 lg:-top-12 -left-4 sm:-left-6 lg:-left-8 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 object-cover transform rotate-12 hover:rotate-0 transition-transform duration-300"
               />
             </div>

             {/* Centered Content */}
             <div className="text-center relative z-10">
               <div className="text-xs sm:text-sm uppercase tracking-wider text-primary font-semibold mb-3 sm:mb-4">
                 About Us
               </div>
               <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-playfair font-bold mb-4 sm:mb-6 leading-tight">
                 About <span className="text-luxury">Eloska World</span>
               </h1>
               <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                 Established in 2020, we are a leading Manufacturer of Face Masks, Ladies Kurtis, Ladies Scarfs, and more.
               </p>
               <Badge variant="outline" className="text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
                 ISO 9001:2015 Certified Company
               </Badge>
             </div>
           </div>
        </div>
      </section>

      {/* Company Overview */}
      <section ref={overviewRef} className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center transition-all duration-1000 ${
              overviewVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="order-1 lg:order-1">
                <h2 className="text-2xl sm:text-3xl font-playfair font-bold mb-4 sm:mb-6 text-center lg:text-left">
                  Company <span className="text-luxury">Overview</span>
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-justify">
                  <p>
                    Established in the year 2020, we "Eloska World" are a leading Manufacturer of a wide range of Face Mask, Ladies Kurtis, Ladies Scarfs, etc.
                  </p>
                  
                  {/* Image after first paragraph on mobile */}
                  <div className="relative lg:hidden my-6">
                    <img 
                      src="https://5.imimg.com/data5/SELLER/Default/2022/9/HQ/EJ/OS/20984018/whatsapp-image-2022-09-24-at-3-01-59-pm-1000x1000.jpeg" 
                      alt="Eloska World Factory" 
                      className="w-full h-64 object-cover rounded-xl shadow-luxury"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                  </div>
                  
                  <p>
                    Eloska world is a range of bright & happy women's Indian wear. A unique fusion of sarees fashion fabric and eloska world – fashion, Eloska world brings out a line that is a fine blend of feminine cuts and beautiful shades in sync with the latest fashion trends. Eloska world provides high-end fashion at very attractive prices making it a perfect answer to every woman's wish of making every day exceptional.
                  </p>
                  <p>
                    With a wide range of beautiful kurtas, Anarkalis, churidars, dupattas, leggings and kurtis in pleasing prints, colors and patterns, the brand aims at bringing freshness, variety & style to every woman's closet. The Eloska world collection is sure to glorify your presence wherever you go and steal hearts by the millions. Wear it and feel draped in style.
                  </p>
                  <p className="font-semibold text-foreground">
                    Eloska world is government certified company. Its certificate no. 1127q130221 is verified on 27-11-2021. Government registered ISO 9001-2015 certified company.
                  </p>
                </div>
              </div>
              <div className="relative order-2 lg:order-2 hidden lg:block">
                <img 
                  src="https://5.imimg.com/data5/SELLER/Default/2022/9/HQ/EJ/OS/20984018/whatsapp-image-2022-09-24-at-3-01-59-pm-1000x1000.jpeg" 
                  alt="Eloska World Factory" 
                  className="w-full h-96 object-cover rounded-xl shadow-luxury"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-background">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 ${
            statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {stats.map((stat, index) => (
              <div key={index} className={`text-center transition-all duration-700 ${
                statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{
                transitionDelay: statsVisible ? `${index * 200}ms` : '0ms'
              }}>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl font-playfair font-bold text-black mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-black">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Basic Information */}
      <section ref={basicInfoRef} className="py-20 bg-background">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className={`text-center mb-12 transition-all duration-1000 ${
            basicInfoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
              Basic <span className="text-luxury">Information</span>
              </h2>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-1000 delay-300 ${
            basicInfoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <Card className="bg-card shadow-luxury">
              <CardContent className="p-6">
                <h3 className="text-xl font-playfair font-semibold mb-4 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-primary" />
                  Company Details
                </h3>
                <div className="space-y-3">
                  {basicInfo.map((info, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-muted-foreground">{info.label}:</span>
                      <span className="text-sm text-foreground font-medium">{info.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-luxury">
              <CardContent className="p-6">
                <h3 className="text-xl font-playfair font-semibold mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  Statutory Profile
                </h3>
                <div className="space-y-3">
                  {statutoryInfo.map((info, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-muted-foreground">{info.label}:</span>
                      <span className="text-sm text-foreground font-medium">{info.value}</span>
                    </div>
                  ))}
                  <div className="py-2">
                    <span className="text-sm font-medium text-muted-foreground">Banker:</span>
                    <div className="mt-2 space-y-1">
                      {banks.map((bank, index) => (
                        <div key={index} className="text-sm text-foreground font-medium">{bank}</div>
                      ))}
                    </div>
              </div>
            </div>
                </CardContent>
              </Card>
          </div>
        </div>
      </section>

      {/* ISO Certification */}
      <section ref={isoRef} className="py-20 bg-background">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className={`text-center mb-12 transition-all duration-1000 ${
            isoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
              ISO <span className="text-luxury">Certification</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Government approved quality management system certification
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center transition-all duration-1000 delay-300 ${
              isoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="space-y-6">
                <div className="bg-primary/10 p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-8 w-8 text-primary mr-3" />
                    <h3 className="text-2xl font-playfair font-bold text-foreground">ISO 9001:2015 Certified</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Eloska World has a Government Approved Certificate ISO 9001 : 2015. (CERTIFICATE NO. - 1127Q130221). 
                    It's Quality Management System Certificate and it's very important for manufacturing unit and as exporter.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Award className="h-6 w-6 text-primary mr-3" />
                    <span className="text-lg font-semibold text-foreground">Quality Management System</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-6 w-6 text-primary mr-3" />
                    <span className="text-lg font-semibold text-foreground">Government Approved</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-6 w-6 text-primary mr-3" />
                    <span className="text-lg font-semibold text-foreground">International Standards</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://5.imimg.com/data5/SELLER/Default/2023/7/326292332/QS/CT/HJ/20984018/iso-certificate-1000x1000.jpeg" 
                  alt="ISO 9001:2015 Certificate" 
                  className="w-full h-auto object-contain rounded-xl shadow-luxury"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section ref={whyChooseRef} className="py-20 bg-background">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className={`text-center mb-12 transition-all duration-1000 ${
            whyChooseVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
              Why <span className="text-luxury">Choose Us?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We are widely recognized in this sector due to our premium quality range of products
            </p>
          </div>

          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 transition-all duration-1000 delay-300 ${
            whyChooseVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {whyUsReasons.map((reason, index) => (
              <Card key={index} className={`bg-card hover:shadow-luxury transition-luxury transition-all duration-700 ${
                whyChooseVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{
                transitionDelay: whyChooseVisible ? `${index * 150}ms` : '0ms'
              }}>
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Star className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-playfair font-semibold leading-tight">{reason}</h3>
              </CardContent>
            </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing Unit & Warehouse */}
      <section ref={facilitiesRef} className="py-20 bg-background">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className={`text-center mb-12 transition-all duration-1000 ${
            facilitiesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
              Our <span className="text-luxury">Facilities</span>
            </h2>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-1000 delay-300 ${
            facilitiesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <Card className="bg-card shadow-luxury overflow-hidden">
              <div className="relative">
                <img 
                  src="https://5.imimg.com/data5/SELLER/Default/2022/9/GH/HB/WJ/20984018/whatsapp-image-2022-09-24-at-3-05-41-pm-1000x1000.jpeg" 
                  alt="Manufacturing Unit" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-playfair font-semibold text-white flex items-center">
                    <Factory className="h-5 w-5 mr-2 text-white" />
                    Manufacturing Unit
                  </h3>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-justify">
                  Our state-of-the-art manufacturing facility equipped with modern machinery and skilled professionals 
                  to ensure the highest quality standards in every product we create.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-luxury overflow-hidden">
              <div className="relative">
                <img 
                  src="https://5.imimg.com/data5/SELLER/Default/2022/9/TL/ZN/JM/20984018/whatsapp-image-2022-09-23-at-1-23-01-pm-1000x1000.jpeg" 
                  alt="Our Warehouse" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-playfair font-semibold text-white flex items-center">
                    <Warehouse className="h-5 w-5 mr-2 text-white" />
                    Our Warehouse
                  </h3>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-justify">
                  Well-equipped warehouse facility ensuring proper storage, inventory management, and timely 
                  delivery of products to our valued customers across the globe.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 bg-background">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className={`bg-white rounded-2xl shadow-luxury p-8 lg:p-12 transition-all duration-1000 ${
              ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left Side - Content */}
                <div className="space-y-6">
                  {/* Avatars */}
                  <div className="flex -space-x-2">
                    <div className="w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden">
                      <img src="https://i.pravatar.cc/150?img=1" alt="Client 1" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden">
                      <img src="https://i.pravatar.cc/150?img=2" alt="Client 2" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden">
                      <img src="https://i.pravatar.cc/150?img=3" alt="Client 3" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Headline */}
                  <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-foreground">
                    Ready to Experience <span className="text-luxury">Luxury?</span>
                  </h2>

                  {/* Description */}
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Discover how you can transform your manufacturing with experts from Eloska World in just 30 minutes
                  </p>

                  {/* CTA Button */}
                  <div className="pt-4">
                    <Button asChild size="lg" className="bg-primary hover:bg-primary-glow text-white shadow-luxury transition-luxury group">
                      <Link to="/contact">
                        Try for Free
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Right Side - Rotating Images */}
                <div className="relative flex justify-center lg:justify-end">
                  <div className="relative">
                    {/* Image Container */}
                    <div className="w-80 h-80 rounded-xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                      <img 
                        src="https://5.imimg.com/data5/SELLER/Default/2020/12/XD/BL/FM/20984018/eloska-world-logo-1000x1000.jpg" 
                        alt="Eloska World Logo"
                        className="w-full h-full object-contain transition-opacity duration-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;