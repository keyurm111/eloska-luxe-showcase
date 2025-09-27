import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import eloskLogo from '@/assets/eloska-logo.png';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const mirrorItems = [
    { title: 'Regular Silver Mirrors', href: '/mirrors/silver' },
    { title: 'Fancy Mirrors', href: '/mirrors/fancy' },
    { title: 'Artistic Mirrors', href: '/mirrors/artistic' },
    { title: 'Kit Mirrors for Art', href: '/mirrors/kit' },
    { title: 'Acrylic Mirror', href: '/mirrors/acrylic' },
    { title: 'Catalogues', href: '/mirrors/catalogues' },
    { title: 'Mirror Sheets', href: '/mirrors/sheets' },
  ];

  const scarfItems = [
    { title: 'Cotton Hand Printed Bandhani Scarf', href: '/scarfs/bandhani' },
    { title: 'Ladies Batik Printed Silk Scarf', href: '/scarfs/batik' },
    { title: 'Striped Cotton Scarf', href: '/scarfs/striped' },
    { title: 'White Scarf', href: '/scarfs/white' },
    { title: 'Baby Scarfs', href: '/scarfs/baby' },
  ];

  const bagFabricItems = [
    { title: 'Digital Print Fabric', href: '/bag-fabric/digital' },
    { title: 'School Bag Fabric', href: '/bag-fabric/school' },
    { title: 'Waterproof PU Coated Antifree Fabric', href: '/bag-fabric/waterproof' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      to={href}
      className={`text-sm font-inter font-medium transition-luxury relative group ${
        isActive(href) ? 'text-primary' : 'text-foreground hover:text-primary'
      }`}
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
    </Link>
  );

  const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      to={href}
      className={`block px-6 py-3 text-sm font-medium transition-luxury ${
        isActive(href) ? 'text-primary bg-secondary/20' : 'text-foreground hover:text-primary hover:bg-secondary/10'
      }`}
      onClick={() => setIsOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 transition-luxury hover:scale-105">
            <img src={eloskLogo} alt="Eloska World" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLink href="/">Home</NavLink>
            
            <NavigationMenu>
              <NavigationMenuList className="space-x-6">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-foreground hover:text-primary data-[state=open]:text-primary">
                    Mirror Collection
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-background border shadow-luxury">
                    <div className="grid w-[400px] gap-1 p-4">
                      {mirrorItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="block px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-secondary/10 rounded-md transition-smooth"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-foreground hover:text-primary data-[state=open]:text-primary">
                    Scarfs
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-background border shadow-luxury">
                    <div className="grid w-[400px] gap-1 p-4">
                      {scarfItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="block px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-secondary/10 rounded-md transition-smooth"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-foreground hover:text-primary data-[state=open]:text-primary">
                    Bag Fabric
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-background border shadow-luxury">
                    <div className="grid w-[400px] gap-1 p-4">
                      {bagFabricItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="block px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-secondary/10 rounded-md transition-smooth"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <NavLink href="/about">About Us</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-background border-l">
              <div className="flex flex-col space-y-1 mt-8">
                <MobileNavLink href="/">Home</MobileNavLink>
                
                <div className="space-y-1">
                  <div className="px-6 py-3 text-sm font-medium text-muted-foreground">Mirror Collection</div>
                  {mirrorItems.map((item) => (
                    <MobileNavLink key={item.href} href={item.href}>
                      {item.title}
                    </MobileNavLink>
                  ))}
                </div>

                <div className="space-y-1">
                  <div className="px-6 py-3 text-sm font-medium text-muted-foreground">Scarfs</div>
                  {scarfItems.map((item) => (
                    <MobileNavLink key={item.href} href={item.href}>
                      {item.title}
                    </MobileNavLink>
                  ))}
                </div>

                <div className="space-y-1">
                  <div className="px-6 py-3 text-sm font-medium text-muted-foreground">Bag Fabric</div>
                  {bagFabricItems.map((item) => (
                    <MobileNavLink key={item.href} href={item.href}>
                      {item.title}
                    </MobileNavLink>
                  ))}
                </div>

                <MobileNavLink href="/about">About Us</MobileNavLink>
                <MobileNavLink href="/contact">Contact</MobileNavLink>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;