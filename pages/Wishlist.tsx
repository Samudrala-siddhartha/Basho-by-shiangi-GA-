import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, X, ShoppingBag, ArrowRight, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { getWishlist, removeFromWishlist, addToWishlist as addToWishlistStorage } from '../services/storage'; // Renamed to avoid conflict
import { useCart } from '../context/CartContext';
import { FALLBACK_IMAGE } from '../constants';

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  // Function to load wishlist from storage
  const loadWishlist = useCallback(() => {
    setWishlistItems(getWishlist());
  }, []);

  useEffect(() => {
    loadWishlist(); // Load wishlist on component mount

    // Listen for changes to localStorage (e.g., if item removed from another page)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'basho_wishlist') {
        loadWishlist();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadWishlist]);

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to remove "${productName}" from your wishlist?`)) {
      removeFromWishlist(productId);
      loadWishlist(); // Refresh the list
    }
  };

  const handleAddToCartFromWishlist = (product: Product) => {
    addToCart(product); // Add to cart using CartContext
    removeFromWishlist(product.id); // Remove from wishlist after adding to cart
    loadWishlist(); // Refresh wishlist display
    
    // Dispatch toast event for visual feedback
    window.dispatchEvent(new CustomEvent('show-toast', { 
      detail: { 
        message: `"${product.name}" moved to cart!`, 
        type: 'success' 
      } 
    }));
  };

  return (
    <div className="pt-24 min-h-screen bg-stone-50 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation / Back Button */}
        <div className="flex justify-between items-center mb-8">
            <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center text-stone-500 hover:text-stone-800 transition-colors"
            >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="uppercase tracking-widest text-xs font-medium">Back</span>
            </button>
        </div>

        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl text-stone-800 mb-4 flex items-center justify-center gap-4">
            My Wishlist <Heart size={48} className="text-red-500" fill="currentColor" />
          </h1>
          <p className="text-stone-500 font-light max-w-xl mx-auto">
            Treasures you've marked. Perhaps it's time to bring them home?
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white p-12 border border-stone-200 text-center rounded-sm max-w-lg mx-auto shadow-sm">
            <Heart size={48} className="text-stone-300 mx-auto mb-6" strokeWidth={1} />
            <h3 className="font-serif text-2xl text-stone-800 mb-4">Your Wishlist is Empty</h3>
            <p className="text-stone-500 font-light mb-8">
              "Even an empty vase is full of beauty." Add pieces you adore from our collection.
            </p>
            <Link 
              to="/shop" 
              className="group inline-flex items-center bg-stone-900 text-white px-8 py-3 uppercase tracking-widest text-sm hover:bg-terracotta transition-colors"
            >
              Start Exploring <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistItems.map((product) => (
              <WishlistItemCard 
                key={product.id} 
                product={product} 
                onRemove={handleRemoveFromWishlist} 
                onAddToCart={handleAddToCartFromWishlist} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface WishlistItemCardProps {
  product: Product;
  onRemove: (productId: string, productName: string) => void;
  onAddToCart: (product: Product) => void;
}

const WishlistItemCard: React.FC<WishlistItemCardProps> = ({ product, onRemove, onAddToCart }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image);

  const handleError = () => {
    if (imgSrc !== FALLBACK_IMAGE) {
        setImgSrc(FALLBACK_IMAGE);
    }
  };

  return (
    <div className="group bg-white border border-stone-200 flex flex-col hover:shadow-lg transition-shadow duration-300 rounded-sm">
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-100 animate-pulse z-10">
            <ImageIcon className="text-stone-300" size={48} strokeWidth={1} />
          </div>
        )}
        <img
          src={imgSrc}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          onError={handleError}
          className={`h-full w-full object-cover object-center transition-all duration-700 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <button 
          onClick={() => onRemove(product.id, product.name)}
          className="absolute top-3 right-3 p-2 bg-white/80 text-stone-700 rounded-full hover:bg-white hover:text-red-500 transition-colors"
          title="Remove from Wishlist"
        >
          <X size={18} />
        </button>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-serif text-xl text-stone-800 mb-2">{product.name}</h3>
        <p className="text-stone-500 font-light text-sm flex-grow line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-stone-100">
          <p className="font-medium text-xl text-terracotta">₹{product.price}</p>
          <button 
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className="group flex items-center gap-2 bg-stone-800 text-white px-4 py-2 uppercase tracking-widest text-xs hover:bg-terracotta transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={product.inStock ? "Move to Cart" : "Out of Stock"}
          >
            <ShoppingBag size={14} /> 
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;