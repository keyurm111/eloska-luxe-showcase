import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './pages/Login';
import ProductInquiries from './pages/ProductInquiries';
import NormalInquiries from './pages/NormalInquiries';
import Newsletter from './pages/Newsletter';
import BackendStatusIndicator from './components/BackendStatusIndicator';
import { authApi } from './services/api';
import { warmupBackend, checkBackendHealth } from './lib/backend-warmup';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await authApi.verifyToken();
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token verification error:', error);
        localStorage.removeItem('adminToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Backend warmup effect
  useEffect(() => {
    // Show welcome message for admin panel
    console.log('%c🔐 Eloska Admin Panel - Backend Management', 'color: #8B0000; font-weight: bold; font-size: 16px;');
    console.log('%c🔥 Starting backend warmup for admin operations...', 'color: #F59E0B; font-weight: bold;');
    
    // Initial warmup when admin panel loads
    warmupBackend();

    // Check backend health every 30 seconds for the first 2 minutes
    const initialChecks = setInterval(async () => {
      await checkBackendHealth();
    }, 30000);

    // Clear initial checks after 2 minutes
    setTimeout(() => {
      clearInterval(initialChecks);
      console.log('%c✅ Initial admin backend warmup period completed', 'color: #10B981; font-weight: bold;');
      console.log('%c📊 Backend will continue monitoring every 5 minutes', 'color: #3B82F6; font-weight: bold;');
    }, 120000);

    return () => {
      clearInterval(initialChecks);
    };
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <BackendStatusIndicator />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Layout onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Navigate to="/product-inquiries" replace />} />
            <Route path="/product-inquiries" element={<ProductInquiries />} />
            <Route path="/normal-inquiries" element={<NormalInquiries />} />
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="*" element={<Navigate to="/product-inquiries" replace />} />
          </Routes>
        </Layout>
        <BackendStatusIndicator />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
