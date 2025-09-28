import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";
import { warmupBackend, checkBackendHealth } from "./lib/backend-warmup";

const queryClient = new QueryClient();

// BackendStatus component to monitor backend health
const BackendStatus = () => {
  useEffect(() => {
    // Show welcome message
    console.log('%c🚀 Eloska World - Luxury Manufacturing Excellence', 'color: #8B0000; font-weight: bold; font-size: 16px;');
    console.log('%c🔥 Starting backend warmup to prevent cold starts...', 'color: #F59E0B; font-weight: bold;');
    
    // Initial warmup when app loads
    warmupBackend();

    // Check backend health every 30 seconds for the first 2 minutes
    const initialChecks = setInterval(async () => {
      await checkBackendHealth();
    }, 30000);

    // Clear initial checks after 2 minutes
    setTimeout(() => {
      clearInterval(initialChecks);
      console.log('%c✅ Initial backend warmup period completed', 'color: #10B981; font-weight: bold;');
      console.log('%c📊 Backend will continue monitoring every 5 minutes', 'color: #3B82F6; font-weight: bold;');
    }, 120000);

    return () => {
      clearInterval(initialChecks);
    };
  }, []);

  return null;
};

// ScrollToTop component to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediately scroll to top without animation
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <BackendStatus />
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products/:category" element={<Products />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
