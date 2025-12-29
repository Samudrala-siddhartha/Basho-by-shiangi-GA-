import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Package, Heart, BarChart } from 'lucide-react'; // Import BarChart
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getWishlist, isAdmin } from '../services/storage'; // Import isAdmin

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const location = useLocation();
  const { toggleCart, cartCount } = useCart();
  const currentUserIsAdmin = isAdmin(); // Check admin status

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Workshops', path: '/workshops' },
    { name: 'Custom', path: '/custom' },
    { name: 'About', path: '/' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Function to update wishlist count
  const updateWishlistCount = () => {
    setWishlistCount(getWishlist().length);
  };

  useEffect(() => {
    updateWishlistCount(); // Set initial count

    // Listen for changes to localStorage (e.g., from shop page)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'basho_wishlist') {
        updateWishlistCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen to custom event if you were dispatching one on wishlist changes
    // window.addEventListener('wishlist-updated', updateWishlistCount);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      // window.removeEventListener('wishlist-updated', updateWishlistCount);
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <nav className="fixed w-full z-50 bg-stone-100/90 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center" title="Home">
            <span className="font-serif text-3xl text-stone-900 tracking-tight font-light">Bashō.</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-sans text-sm tracking-widest uppercase hover:text-terracotta transition-colors ${isActive(link.path) ? 'text-terracotta font-medium' : 'text-stone-600'}`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Icons Group */}
            <div className="flex items-center space-x-6 border-l border-stone-300 pl-6 ml-4">
               {/* Wishlist Icon */}
               <Link to="/wishlist" className="text-stone-600 hover:text-red-500 transition-colors relative" title="View Wishlist">
                  <Heart size={20} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                      {wishlistCount}
                    </span>
                  )}
               </Link>

               <Link to="/dashboard" className="text-stone-600 hover:text-terracotta transition-colors flex items-center gap-2" title="Order History">
                  <Package size={20} />
               </Link>

                {/* Admin Analytics Link - Conditional Rendering */}
                {currentUserIsAdmin && (
                  <Link to="/admin-analytics" className="text-stone-600 hover:text-blue-600 transition-colors flex items-center gap-2" title="Admin Analytics">
                      <BarChart size={20} />
                  </Link>
                )}
                
                <button 
                  onClick={toggleCart}
                  className="text-stone-800 hover:text-terracotta transition-colors relative"
                  title="View Cart"
                >
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-terracotta text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                      {cartCount}
                    </span>
                  )}
                </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {/* Wishlist Icon */}
            <Link to="/wishlist" className="text-stone-800 relative" title="View Wishlist">
                <Heart size={20} />
                {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                    </span>
                )}
            </Link>

             <Link to="/dashboard" className="text-stone-800" title="Order History">
                <Package size={20} />
             </Link>

             {/* Admin Analytics Link - Mobile - Conditional Rendering */}
             {currentUserIsAdmin && (
               <Link to="/admin-analytics" className="text-stone-800" title="Admin Analytics">
                  <BarChart size={20} />
              </Link>
             )}
             
             <button onClick={toggleCart} className="text-stone-800 relative" title="View Cart">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-stone-800 hover:text-terracotta focus:outline-none"
              title={isOpen ? "Close Menu" : "Open Menu"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-stone-50 border-t border-stone-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-center font-serif text-xl text-stone-700 hover:text-terracotta hover:bg-stone-100"
              >
                {link.name}
              </Link>
            ))}
            <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-center font-serif text-xl text-stone-700 hover:text-terracotta hover:bg-stone-100 border-t border-stone-200"
            >
                Order History
            </Link>
             <Link
                to="/wishlist" 
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-center font-serif text-xl text-stone-700 hover:text-red-500 hover:bg-stone-100 border-t border-stone-200"
            >
                Wishlist ({wishlistCount})
            </Link>
            {currentUserIsAdmin && (
              <Link
                  to="/admin-analytics"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-center font-serif text-xl text-stone-700 hover:text-blue-600 hover:bg-stone-100 border-t border-stone-200"
              >
                  Analytics
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;