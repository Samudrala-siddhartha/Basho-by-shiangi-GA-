import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Order } from '../types'; // Import the Order type

// Define a type for the data stored in sessionStorage
interface ConfirmedOrderDetails extends Order {
    deliveryDate?: string; // Optional for cart checkout
    confirmationType: 'buy_now' | 'cart_checkout';
}

const OrderSuccess: React.FC = () => {
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const [orderDetails, setOrderDetails] = useState<ConfirmedOrderDetails | null>(null);

    useEffect(() => {
        // 1. Read order details from sessionStorage
        const storedDetails = sessionStorage.getItem('last_confirmed_order_details');

        if (storedDetails) {
            try {
                const parsedDetails: ConfirmedOrderDetails = JSON.parse(storedDetails);
                setOrderDetails(parsedDetails);

                // 2. Clear sessionStorage immediately after reading
                sessionStorage.removeItem('last_confirmed_order_details');

                // 3. Clear the cart AFTER the details are loaded and ready to be displayed
                clearCart(); 

            } catch (e) {
                console.error("Failed to parse order details from sessionStorage", e);
                // If parsing fails, redirect to home
                navigate('/');
            }
        } else {
            // If no order details are found (e.g., direct access or refresh after initial visit),
            // redirect to home or dashboard.
            navigate('/dashboard'); 
        }
    }, [navigate, clearCart]); // Depend on navigate and clearCart to ensure it's called correctly

    if (!orderDetails) {
        // Optionally show a loading spinner or a simple message while details are fetched
        return (
            <div className="pt-24 min-h-screen bg-stone-50 flex items-center justify-center">
                <p className="text-stone-500 text-lg">Loading order details...</p>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-stone-50 pb-20 flex flex-col items-center justify-center px-4">
            <div className="max-w-md w-full bg-white p-8 border border-stone-200 shadow-xl rounded-sm animate-fade-in text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-green-600" size={32} />
                </div>
                <h1 className="font-serif text-3xl text-stone-800 mb-2">Order Confirmed!</h1>
                <p className="text-stone-500 mb-8 text-sm leading-relaxed">
                    Thank you for your purchase. We are preparing your items for their journey.
                </p>

                <div className="bg-stone-50 p-6 mb-8 text-left border border-stone-100 rounded-sm space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase text-stone-400 tracking-wider">Order ID</span>
                        <span className="font-mono text-stone-800 font-medium text-sm">{orderDetails.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase text-stone-400 tracking-wider">Order Date</span>
                        <span className="text-stone-800 font-medium text-sm">{orderDetails.date}</span>
                    </div>
                    {orderDetails.deliveryDate && (
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase text-stone-400 tracking-wider">Est. Delivery</span>
                            <span className="text-stone-800 font-medium text-sm">{orderDetails.deliveryDate}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase text-stone-400 tracking-wider">Total Paid</span>
                        <span className="font-serif text-xl text-stone-800">₹{orderDetails.total}</span>
                    </div>
                </div>

                <div className="space-y-3 mb-8 text-left">
                    <h3 className="text-xs uppercase tracking-wider text-stone-400 mb-2">Items Purchased:</h3>
                    {orderDetails.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm text-stone-700">
                            <span>{item.quantity}x {item.name}</span>
                            <span>₹{item.price * item.quantity}</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-3">
                    <Link 
                        to="/dashboard" 
                        className="w-full bg-stone-900 text-white py-3 flex items-center justify-center gap-2 hover:bg-terracotta transition-colors uppercase tracking-widest text-sm"
                    >
                        <Package size={18} /> View My Orders
                    </Link>
                    <Link 
                        to="/shop" 
                        className="w-full border border-stone-300 text-stone-800 py-3 flex items-center justify-center gap-2 hover:bg-stone-100 transition-colors uppercase tracking-widest text-sm"
                    >
                        Continue Shopping <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;