import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { saveOrder } from '../services/storage';
import { trackEvent } from '../services/analytics'; // Import trackEvent

const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    
    // HACKATHON DEMO LOGIC: Simulate payment processing
    setTimeout(() => {
      const newOrderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

      // 1. Save order to localStorage (our mock backend)
      saveOrder({
          id: newOrderId,
          date: new Date().toLocaleDateString(),
          items: cart.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
          total: cartTotal
      });
      
      // 2. Store confirmation details in sessionStorage for the success page
      sessionStorage.setItem('last_confirmed_order_details', JSON.stringify({
          id: newOrderId,
          date: new Date().toLocaleDateString(),
          items: cart.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
          total: cartTotal,
          confirmationType: 'cart_checkout',
      }));

      // Track analytics event
      trackEvent('purchases');

      setIsCheckingOut(false);
      toggleCart(); // Close the cart drawer
      navigate('/order-success'); // Navigate to the order success page (cart will be cleared there)
    }, 2000);
  };

  const handleStartShopping = () => {
    toggleCart();
    navigate('/shop');
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to remove all items from your cart?")) {
      clearCart();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm transition-opacity" 
        onClick={toggleCart}
        title="Close Cart"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-stone-50 h-full shadow-2xl flex flex-col animate-slide-in-right">
        
        {/* Header */}
        <div className="px-6 py-6 border-b border-stone-200 flex justify-between items-center bg-white">
          <h2 className="font-serif text-2xl text-stone-800 flex items-center">
            Your Selection <span className="ml-2 text-sm font-sans text-stone-400">({cart.length} items)</span>
          </h2>
          <button onClick={toggleCart} className="text-stone-400 hover:text-stone-800 transition-colors" title="Close Cart">
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-8">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag size={32} className="text-stone-400" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl text-stone-800 mb-2">Your cart is empty</h3>
              <p className="text-stone-500 font-light mb-8 max-w-xs leading-relaxed">
                "The space is not empty,<br/>it is full of possibilities."
              </p>
              <button 
                onClick={handleStartShopping} 
                className="w-full bg-stone-900 text-white px-8 py-4 uppercase tracking-widest text-sm hover:bg-terracotta transition-colors flex items-center justify-center group"
                title="Go to Shop"
              >
                Browse Collection
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white p-4 rounded-sm border border-stone-100 shadow-sm transition-all hover:shadow-md">
                {/* Product Image */}
                <div className="w-24 h-24 bg-stone-200 flex-shrink-0 overflow-hidden rounded-sm">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-lg text-stone-800 leading-snug">{item.name}</h3>
                      {/* Subtotal for this item */}
                      <p className="font-medium text-stone-900">₹{item.price * item.quantity}</p>
                    </div>
                    {/* Unit Price and Quantity text */}
                    <p className="text-xs text-stone-500 mt-1">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center border border-stone-200 rounded-sm">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors"
                        title="Decrease Quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-stone-800">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors"
                        title="Increase Quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-400 hover:text-red-500 transition-colors p-1"
                      title="Remove Item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-stone-200">
             <div className="mb-4 flex justify-between items-center">
                 <button onClick={toggleCart} className="text-xs uppercase tracking-widest text-stone-400 hover:text-terracotta flex items-center" title="Close cart and continue shopping">
                     <ArrowRight className="rotate-180 mr-1" size={12}/> Continue Shopping
                 </button>
                 <button onClick={handleClearCart} className="text-xs uppercase tracking-widest text-stone-400 hover:text-red-500 flex items-center transition-colors" title="Remove all items">
                     Clear Cart <Trash2 size={12} className="ml-1" />
                 </button>
             </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-stone-500 uppercase tracking-widest text-sm">Subtotal</span>
              <span className="font-serif text-3xl text-stone-800">₹{cartTotal}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-stone-900 text-white py-4 flex items-center justify-center space-x-2 hover:bg-terracotta transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              title="Proceed to Payment"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span className="uppercase tracking-widest text-sm">Processing...</span>
                </>
              ) : (
                <>
                  <span className="uppercase tracking-widest text-sm">Proceed to Checkout</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
            <p className="text-xs text-stone-400 text-center mt-4">
              Secure payment processed via Razorpay.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;