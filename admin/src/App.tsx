import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import ProductInquiries from './pages/ProductInquiries';
import NormalInquiries from './pages/NormalInquiries';
import Newsletter from './pages/Newsletter';
import Products from './pages/Products';

function AppContent() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <Navigate to="/admin/products" replace />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <Products />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/product-inquiries" element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <ProductInquiries />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/normal-inquiries" element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <NormalInquiries />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/newsletter" element={
          <ProtectedRoute>
            <Layout onLogout={handleLogout}>
              <Newsletter />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
