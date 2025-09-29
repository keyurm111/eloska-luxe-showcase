import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import ProductInquiries from './pages/ProductInquiries';
import NormalInquiries from './pages/NormalInquiries';
import Newsletter from './pages/Newsletter';

function App() {
  // Removed authentication - admin panel opens directly
  const handleLogout = () => {
    // No logout needed since there's no authentication
    console.log('Logout clicked - but no authentication required');
  };

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
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
