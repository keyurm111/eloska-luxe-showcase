import Navigation from './Navigation';
import Footer from './Footer';
import FloatingButtons from './WhatsAppButton';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>{children}</main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Layout;