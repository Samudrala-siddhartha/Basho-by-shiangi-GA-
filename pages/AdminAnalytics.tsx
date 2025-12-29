import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart, ShoppingBag, Heart, CreditCard, Users, Eye } from 'lucide-react';
import { getAnalyticsData, resetAnalytics } from '../services/analytics';
import { AnalyticsData } from '../types';

const AdminAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  const loadAnalytics = useCallback(() => {
    setAnalytics(getAnalyticsData());
  }, []);

  useEffect(() => {
    loadAnalytics(); // Load initial data

    // Listen for custom event to update analytics in real-time
    window.addEventListener('analytics-updated', loadAnalytics);

    return () => {
      window.removeEventListener('analytics-updated', loadAnalytics);
    };
  }, [loadAnalytics]);

  const statsCards = analytics ? [
    { label: 'Total Visits', value: analytics.totalVisits, icon: <Users size={24} /> },
    { label: 'Product Views', value: analytics.productViews, icon: <Eye size={24} /> },
    { label: 'Cart Adds', value: analytics.cartAdds, icon: <ShoppingBag size={24} className="text-terracotta" /> },
    { label: 'Wishlist Adds', value: analytics.wishlistAdds, icon: <Heart size={24} className="text-red-500" /> },
    { label: 'Purchases', value: analytics.purchases, icon: <CreditCard size={24} className="text-green-600" /> },
    { label: 'Workshop Bookings', value: analytics.workshopBookings, icon: <BarChart size={24} className="text-blue-600" /> },
  ] : [];

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
            Analytics Overview <BarChart size={48} className="text-terracotta" />
          </h1>
          <p className="text-stone-500 font-light max-w-xl mx-auto">
            Real-time insights into user engagement. (Frontend-only stats)
          </p>
        </div>

        {!analytics ? (
          <div className="bg-white p-12 border border-stone-200 text-center rounded-sm max-w-lg mx-auto shadow-sm">
            <BarChart size={48} className="text-stone-300 mx-auto mb-6" strokeWidth={1} />
            <h3 className="font-serif text-2xl text-stone-800 mb-4">No Analytics Data Yet</h3>
            <p className="text-stone-500 font-light mb-8">
              Start interacting with the site to see the numbers grow!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statsCards.map((card) => (
              <div key={card.label} className="bg-white p-6 border border-stone-200 rounded-sm shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  card.label === 'Purchases' ? 'bg-green-100' : 
                  card.label === 'Wishlist Adds' ? 'bg-red-100' :
                  card.label === 'Cart Adds' ? 'bg-terracotta/10' :
                  card.label === 'Workshop Bookings' ? 'bg-blue-100' :
                  'bg-stone-100'
                }`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-widest text-stone-500">{card.label}</p>
                  <p className="font-serif text-3xl text-stone-800 mt-1">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-16">
            <button 
                onClick={resetAnalytics}
                className="inline-flex items-center text-red-500 hover:text-red-700 transition-colors uppercase tracking-widest text-xs"
            >
                Reset All Stats
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
