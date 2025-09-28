import Navigation from './Navigation';
import Footer from './Footer';
import FloatingButtons from './WhatsAppButton';
import BackendStatusIndicator from './BackendStatusIndicator';

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
      <BackendStatusIndicator />
    </div>
  );
};

export default Layout;