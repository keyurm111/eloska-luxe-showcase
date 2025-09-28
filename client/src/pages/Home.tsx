import { Link } from 'react-router-dom';
import { ArrowRight, Star, Award, Globe, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect, useRef } from 'react';
import heroImage from '@/assets/hero-image.jpg';
import mirrorsImage from '@/assets/mirrors-collection.jpg';
import scarfsImage from '@/assets/scarfs-collection.jpg';
import bagFabricImage from '@/assets/bag-fabric-collection.jpg';

// New Arrivals Section Component
const NewArrivalsSection = () => {
  const [newArrivalsRef, newArrivalsVisible] = useScrollAnimation();
  // Product data - All mirror categories plus other categories
  const products = [
    {
      id: 1,
      name: "Fancy Butterfly shape silver mirror 1421",
      description: "ONLY MIRROR - Premium silver finish with butterfly design",
      price: "₹1,323.00",
      image: "/eloska images/9.png",
      category: "Regular Silver Mirrors",
      categoryLink: "/products/regular-silver"
    },
    {
      id: 2,
      name: "Hand-painted Artistic Mirror",
      description: "Custom hand-painted mirror with artistic flair",
      price: "₹899.00",
      image: "/eloska images/12.png",
      category: "Artistic Mirrors",
      categoryLink: "/products/artistic"
    },
    {
      id: 3,
      name: "Lightweight Acrylic Mirror",
      description: "Shatterproof acrylic mirror for safety",
      price: "₹599.00",
      image: "/eloska images/15.png",
      category: "Acrylic Mirror",
      categoryLink: "/products/acrylic"
    },
    {
      id: 4,
      name: "Premium Mirror Catalog",
      description: "Comprehensive catalog of all mirror products",
      price: "₹299.00",
      image: "/eloska images/9.png",
      category: "Mirror Catalogues",
      categoryLink: "/products/catalogues"
    },
    {
      id: 5,
      name: "Mirror Sheet 4x8",
      description: "Large format mirror sheet for custom applications",
      price: "₹1,999.00",
      image: "/eloska images/12.png",
      category: "Mirror Sheets",
      categoryLink: "/products/mirror-sheet"
    },
    {
      id: 6,
      name: "BLACK BANDHANI SCARF",
      description: "Traditional black bandhani scarf with authentic tie-dye patterns",
      price: "₹160.00/piece",
      image: "/BANDHANI SCARF/BLACK BANDHANI SCARF/1.jpg",
      category: "Bandhani Scarf",
      categoryLink: "/products/bandhani"
    },
    {
      id: 7,
      name: "2 BOX SCARF",
      description: "Classic white scarf with elegant box pattern design",
      price: "₹200.00/piece",
      image: "/WHITE SCARF/2 BOX SCARF/1.jpeg",
      category: "White Scarf",
      categoryLink: "/products/white-scarf"
    },
    {
      id: 8,
      name: "BLACK DHINGLI BABY SCARF",
      description: "Soft baby scarf with dhingli pattern - perfect for little ones",
      price: "₹175.00/piece",
      image: "/BABY SCARF/BLACK DHINGLI BABY SCARF/1.jpg",
      category: "Baby Scarf",
      categoryLink: "/products/baby-scarf"
    },
    {
      id: 9,
      name: "Digital Printed Fabric",
      description: "High-quality digital printed fabric with customised design",
      price: "₹69.00/meter",
      image: "/Digital Print Fabric/Digital Printed Fabric.webp",
      category: "Digital Print Fabric",
      categoryLink: "/products/digital"
    }
  ];

  // Triple the products for seamless infinite scroll
  const extendedProducts = [...products, ...products, ...products];

  const ProductCard = ({ product }: { product: any }) => (
    <div className="flex-shrink-0 w-64 sm:w-72 h-80 sm:h-96 bg-white rounded-lg shadow-xl hover:shadow-luxury transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col mx-1 sm:mx-2 lg:mx-3 my-4">
      <div className="h-40 sm:h-48 overflow-hidden relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-95 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-300"></div>
      </div>
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div className="flex-1">
          <div className="mb-2">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-playfair font-semibold mb-2 text-primary group-hover:text-foreground transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
            {product.description}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto gap-2 sm:gap-0">
          <span className="text-primary font-bold text-sm sm:text-lg">
            {product.price}
          </span>
          <Link to={product.categoryLink}>
            <Button size="sm" className="bg-primary hover:bg-primary-glow text-white text-xs sm:text-sm w-full sm:w-auto">
              Explore More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <section ref={newArrivalsRef} className="py-12 sm:py-16 lg:py-20 bg-background w-full">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${
          newArrivalsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold mb-4 text-foreground">
            <span className="text-black">New</span> <span className="text-luxury">Arrivals</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Fresh designs and latest additions to our luxury collection
          </p>
        </div>

        {/* Infinite Scrolling Container - Full Width */}
        <div className={`relative overflow-hidden w-full transition-all duration-1000 delay-300 ${
          newArrivalsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Scrolling Container */}
          <div 
            className="flex animate-infinite-scroll pl-2 sm:pl-4 lg:pl-6"
            style={{ width: `calc((256px + 8px) * ${extendedProducts.length})` }}
          >
            {extendedProducts.map((product, index) => (
              <ProductCard key={`${product.id}-${index}`} product={product} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

// Client Testimonials Component
const ClientTestimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonialsRef, testimonialsVisible] = useScrollAnimation();

  const testimonials = [
    {
      id: 1,
      name: 'Ankush Kedia',
      role: 'Customer',
      review: 'Bole to jhkaas wonderful item'
    },
    {
      id: 2,
      name: 'Yogesh Lakhani',
      role: 'Customer',
      review: 'Excellent and good products'
    },
    {
      id: 3,
      name: 'Citi Kidds Shah',
      role: 'Customer',
      review: 'Good'
    },
    {
      id: 4,
      name: 'Irshad Ansari',
      role: 'Local Guide',
      review: 'Best bag and mirror all of surat'
    },
    {
      id: 5,
      name: 'Vanzara Jagdish',
      role: 'Customer',
      review: 'Nice'
    },
    {
      id: 6,
      name: 'Tanveer Alam',
      role: 'Customer',
      review: 'Aap ka kaam bahot hi acha hai prashant bhai aur mai yahi duwa karta hu aap ka business aur bada ho jaye'
    },
    {
      id: 7,
      name: 'Dharam Dabhi',
      role: 'Local Guide',
      review: 'Best place and good owner'
    },
    {
      id: 8,
      name: 'Pradeep Yadav',
      role: 'Customer',
      review: 'All mirror best and bag fabric'
    },
    {
      id: 9,
      name: 'Ashish Gupta',
      role: 'Local Guide',
      review: 'Bought digital printed fabrics and mirrors for business purpose.. Quality is good and reasonable rates.. timely delievery made me put a 5 star review for the same..'
    },
    {
      id: 10,
      name: 'Rigal Dharam',
      role: 'Customer',
      review: 'Excellent service.'
    },
    {
      id: 11,
      name: 'Jayesh Gadhiya',
      role: 'Customer',
      review: 'Good'
    },
    {
      id: 12,
      name: 'Nashim Shah',
      role: 'Customer',
      review: 'Good quality'
    },
    {
      id: 13,
      name: 'Kirtibhai Gadhiya',
      role: 'Customer',
      review: 'Excellent product'
    },
    {
      id: 14,
      name: 'Nikhare Mayur',
      role: 'Customer',
      review: 'Excellent product ND gud person all fabric product to'
    },
    {
      id: 15,
      name: 'Manoj Jethva',
      role: 'Local Guide',
      review: 'Super collection'
    },
    {
      id: 16,
      name: 'Vishavadiya Jagdish',
      role: 'Local Guide',
      review: 'Good sarvis'
    },
    {
      id: 17,
      name: 'Dipakbhai Patel',
      role: 'Customer',
      review: 'Excellent work. Accurate time to time service. Creative team'
    },
    {
      id: 18,
      name: 'Dipali Vaghani',
      role: 'Customer',
      review: 'Quality of mirrors are absolutely fine. There are all shapes and sizes of mirror available. You can use these mirrors in many ways such as in embroidery, lipan art, mandala'
    },
    {
      id: 19,
      name: 'Yogesh Moradiya',
      role: 'Customer',
      review: 'Excellent product nd gud person'
    },
    {
      id: 20,
      name: 'Satyam Singh',
      role: 'Customer',
      review: 'Bahut aacha kam hai'
    },
    {
      id: 21,
      name: 'Mahipal Tamsa',
      role: 'Customer',
      review: 'Super fine artical work very good'
    },
    {
      id: 22,
      name: 'Bhavesh Gadhiya',
      role: 'Customer',
      review: 'We ordered from Eloska world Mirror and the experience was excellent. The mirrors came in many unique designs, all with premium finishing and export quality shine. Everything arrived safely with no damage. We are really impressed and will definitely buy again. Highly recommend to anyone looking for beautiful and durable mirrors!'
    },
    {
      id: 23,
      name: 'Nirav Gadhiya',
      role: 'Customer',
      review: 'Very good service, excellent products.'
    },
    {
      id: 24,
      name: 'Alauddin Shah',
      role: 'Customer',
      review: 'Good quility'
    },
    {
      id: 25,
      name: 'Kunal Gadhia',
      role: 'Customer',
      review: 'Ek dam badiya kam he jo maal aata hai o grahak happy raheta hai our pura new collection raheta hai'
    },
    {
      id: 26,
      name: 'Ved Kanani',
      role: 'Customer',
      review: 'We are very happy customers of Eloska World Mirror. The designs are beautiful, the quality is truly export level, and every mirror we received was in perfect condition with no damage. The variety is amazing, and it really adds style and elegance to our work. We highly recommend Eloska World Mirror to everyone looking for the best mirrors!'
    }
  ];

  // Auto-rotate testimonials every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section ref={testimonialsRef} className="py-16 sm:py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${
          testimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold mb-4 text-foreground">
            What Our <span className="text-luxury">Clients Say</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Hear from our satisfied customers who trust us for their luxury manufacturing needs
          </p>
        </div>

        {/* Testimonial Slider */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-[50px_1fr_50px] gap-4 sm:gap-6 items-center">
            {/* Previous Button - Hidden on Mobile, Visible on Desktop */}
            <button
              onClick={prevSlide}
              className="hidden sm:block justify-self-end text-foreground hover:text-primary transition-all duration-300 hover:scale-125 focus:scale-125 border-none outline-none ring-0 bg-transparent"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Testimonial Card */}
            <div className="relative w-full transition-all duration-500">
              <div className="relative min-h-64 sm:min-h-80 text-white border border-gray-300 rounded-xl bg-black overflow-hidden">
                <div className="relative h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8">
                  {/* Stars Rating */}
                  <div className="flex items-center gap-1 mb-3 sm:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-4 h-4 sm:w-5 sm:h-5 fill-primary text-primary" 
                      />
                    ))}
                  </div>
                  
                  <blockquote className="text-base sm:text-lg lg:text-xl leading-relaxed font-inter text-white flex-1 mb-4 sm:mb-6 px-2 sm:px-0">
                    "{testimonials[currentSlide].review}"
                  </blockquote>
                  
                  <div className="flex items-center gap-3 sm:gap-4 mt-auto">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/30 bg-primary/20 flex items-center justify-center">
                      <span className="text-white font-bold text-sm sm:text-lg">
                        {testimonials[currentSlide].name.charAt(0)}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">
                        {testimonials[currentSlide].name}
                      </p>
                      <p className="text-xs text-white/80">
                        {testimonials[currentSlide].role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Button - Hidden on Mobile, Visible on Desktop */}
            <button
              onClick={nextSlide}
              className="hidden sm:block justify-self-start text-foreground hover:text-primary transition-all duration-300 hover:scale-125 focus:scale-125 border-none outline-none ring-0 bg-transparent"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

// Interactive Card Carousel Component
const ProductCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const categories = [
    {
      name: 'Mirror Collection',
      code: 'M001',
      desc: 'Exquisite mirrors crafted with precision and elegance. From classic silver designs to contemporary artistic masterpieces.',
      image: mirrorsImage,
      angle: 4,
      href: '/products/mirrors'
    },
    {
      name: 'Luxury Scarfs',
      code: 'S001', 
      desc: 'Premium silk and cotton scarfs featuring intricate patterns. Handcrafted with attention to detail and luxury finishing.',
      image: scarfsImage,
      angle: -8,
      href: '/products/scarfs'
    },
    {
      name: 'Bag Fabrics',
      code: 'B001',
      desc: 'Durable and stylish fabrics designed for all bag types. High-quality materials that combine functionality with fashion.',
      image: bagFabricImage,
      angle: 16,
      href: '/products/bag-fabric'
    }
  ];

  // Auto-rotate cards every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [categories.length]);

  return (
    <div className="cards">
      {categories.map((category, index) => (
        <div key={index}>
          <input 
            type="radio" 
            id={`radio-${index + 1}`} 
            name="radio-card" 
            checked={currentIndex === index}
            onChange={() => setCurrentIndex(index)}
            className="sr-only"
          />
          <article 
            className="card" 
            style={{ '--angle': `${category.angle}deg` } as React.CSSProperties}
          >
            <img 
              className="card-img" 
              src={category.image} 
              alt={category.name}
            />
            <div className="card-data">
              <span className="card-num">{index + 1}/{categories.length}</span>
              <h2 className="text-2xl font-playfair font-bold text-foreground">{category.name}</h2>
              <p className="text-muted-foreground font-inter">{category.desc}</p>
              <div className="mt-4">
                <Button asChild className="bg-primary hover:bg-primary-glow text-white shadow-luxury transition-luxury group">
                  <Link to={category.href}>
                    Explore Collection
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        </div>
      ))}
    </div>
  );
};

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

const Home = () => {
  const [ctaImageIndex, setCtaImageIndex] = useState(0);
  
  // Scroll animation hooks for different sections
  const [heroRef, heroVisible] = useScrollAnimation();
  const [collectionsRef, collectionsVisible] = useScrollAnimation();
  const [newArrivalsRef, newArrivalsVisible] = useScrollAnimation();
  const [whyChooseRef, whyChooseVisible] = useScrollAnimation();
  const [testimonialsRef, testimonialsVisible] = useScrollAnimation();
  const [ctaRef, ctaVisible] = useScrollAnimation();

  // CTA Images for rotation
  const ctaImages = [
    mirrorsImage,
    scarfsImage,
    bagFabricImage,
    heroImage
  ];

  // Auto-rotate CTA images every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCtaImageIndex((prev) => (prev + 1) % ctaImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [ctaImages.length]);

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side - Text and Button */}
        <div className="w-full lg:w-1/2 bg-black flex items-center justify-center p-4 sm:p-6 lg:p-12 min-h-[60vh] lg:h-screen">
          <div className={`max-w-lg text-center lg:text-left transition-all duration-1000 ${
            heroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-playfair font-bold text-white mb-4 lg:mb-6 leading-tight">
              Luxury in Every Detail
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 mb-6 lg:mb-8 font-inter leading-relaxed">
              <span className="text-primary font-semibold">Eloska World</span> - Leading manufacturer of premium 
              Face Masks, Ladies Kurtis, Scarfs, Bag Fabrics, and Sari Mirrors
            </p>
            <div className="transition-all duration-1000 delay-300">
              <Button size="lg" className="bg-primary hover:bg-primary-glow text-white shadow-luxury transition-luxury group w-full sm:w-auto">
                Explore Our Collection
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side - Bento Grid Images */}
        <div className="w-full lg:w-1/2 p-3 sm:p-4 lg:p-8 bg-gray-50 min-h-[40vh] lg:h-screen flex items-center">
          <div className={`w-full grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 h-full max-h-96 lg:max-h-none transition-all duration-1000 delay-200 ${
            heroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            {/* Large Image - Top Left */}
            <div className="row-span-2 rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/scarf.png" 
                alt="Scarf Collection"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Medium Image - Top Right */}
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/mirror.png" 
                alt="Mirror Collection"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Small Image - Bottom Right */}
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/bag.png" 
                alt="Bag Collection"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section ref={collectionsRef} className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${
            collectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold mb-4">
              Our <span className="text-luxury">Premium Collections</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Discover our carefully curated range of luxury products, each crafted with precision and elegance
            </p>
          </div>

          <div className="flex justify-center">
            <ProductCarousel />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section ref={whyChooseRef} className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${
            whyChooseVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold mb-4">
              Why Choose <span className="text-luxury">Eloska World?</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Experience the difference of working with industry leaders in luxury manufacturing
            </p>
          </div>

          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 transition-all duration-1000 delay-300 ${
            whyChooseVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4 group-hover:bg-primary/20 transition-luxury">
                  <div className="text-primary scale-75 sm:scale-90 lg:scale-100">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-playfair font-semibold mb-1 sm:mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-tight">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <NewArrivalsSection />

      {/* Client Testimonials Section */}
      <ClientTestimonials />

      {/* CTA Section */}
      <section ref={ctaRef} className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className={`bg-white rounded-2xl shadow-luxury p-6 sm:p-8 lg:p-12 transition-all duration-1000 ${
              ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left Side - Content */}
                <div className="space-y-4 sm:space-y-6 order-1 lg:order-1">
                  {/* Headline - Always on top on mobile */}
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-foreground text-center lg:text-left">
                    Ready to Experience <span className="text-luxury">Luxury?</span>
                  </h2>

                  {/* Avatars */}
                  <div className="flex -space-x-2 justify-center lg:justify-start">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-md overflow-hidden">
                      <img 
                        src="https://i.pravatar.cc/150?img=1" 
                        alt="Client 1" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-md overflow-hidden">
                      <img 
                        src="https://i.pravatar.cc/150?img=2" 
                        alt="Client 2" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-md overflow-hidden">
                      <img 
                        src="https://i.pravatar.cc/150?img=3" 
                        alt="Client 3" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-center lg:text-left">
                    Discover how you can transform your manufacturing with experts from Eloska World in just 30 minutes
                  </p>

                  {/* CTA Button */}
                  <div className="pt-2 sm:pt-4 flex justify-center lg:justify-start">
                    <Button asChild size="lg" className="bg-primary hover:bg-primary-glow text-white shadow-luxury transition-luxury group w-full sm:w-auto">
                      <Link to="/contact">
                        Try for Free
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Right Side - Rotating Images */}
                <div className="relative flex justify-center lg:justify-end order-2 lg:order-2">
                  <div className="relative">
                    {/* Image Container */}
                    <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                      <img 
                        src={ctaImages[ctaImageIndex]} 
                        alt=""
                        className="w-full h-full object-cover transition-opacity duration-500"
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

export default Home;