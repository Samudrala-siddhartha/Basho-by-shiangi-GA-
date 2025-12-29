import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatAssistant from './components/ChatAssistant';
import CartDrawer from './components/CartDrawer';
import ToastNotification from './components/ToastNotification'; // Import ToastNotification
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Workshops from './pages/Workshops';
import CustomOrder from './pages/CustomOrder';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OrderSuccess from './pages/OrderSuccess'; // Import the new OrderSuccess page
import Wishlist from './pages/Wishlist'; // Import the new Wishlist page
import AdminAnalytics from './pages/AdminAnalytics'; // Import AdminAnalytics
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute'; // Import AdminProtectedRoute
import { ShippingReturns, CareInstructions, PrivacyPolicy } from './pages/InfoPages';
import { trackEvent } from './services/analytics'; // Import trackEvent

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  useEffect(() => {
    // Track a visit when the app component mounts
    trackEvent('totalVisits');
  }, []);

  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-terracotta selection:text-white">
          <Navbar />
          <CartDrawer />
          <ToastNotification /> {/* Render ToastNotification globally */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/workshops" element={<Workshops />} />
              <Route path="/custom" element={<CustomOrder />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/order-success" element={<OrderSuccess />} /> {/* New Route */}
              <Route path="/wishlist" element={<Wishlist />} /> {/* New Wishlist Route */}
              <Route path="/admin-analytics" element={
                <AdminProtectedRoute>
                  <AdminAnalytics />
                </AdminProtectedRoute>
              } /> {/* Protected Admin Analytics Route */}
              
              <Route path="/shipping-returns" element={<ShippingReturns />} />
              <Route path="/care-instructions" element={<CareInstructions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
          </main>
          <ChatAssistant />
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;