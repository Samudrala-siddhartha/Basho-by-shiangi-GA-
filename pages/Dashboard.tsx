import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Package, Calendar, LogOut } from 'lucide-react';
import { getOrders, getBookings, getDashboardStats, getUserProfile, logoutUser } from '../services/storage';
import { Order, WorkshopBooking, UserProfile } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<WorkshopBooking[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalBookings: 0, totalSpent: 0 });
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Load data from localStorage
    setOrders(getOrders());
    setBookings(getBookings());
    setStats(getDashboardStats());
    setUser(getUserProfile());
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Guest Profile & Stats */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white p-6 border border-stone-200 shadow-sm rounded-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-600">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="font-serif text-xl text-stone-800">
                    {user ? user.name : "Guest Artisan"}
                  </h2>
                  <p className="text-xs text-stone-400">
                    {user ? user.email : "Browser Session"}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-stone-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-sm text-stone-500 font-medium flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${user ? 'bg-green-500' : 'bg-stone-400'}`}></span> 
                      {user ? 'Member' : 'Local Session'} {/* Simplified status message */}
                    </p>
                  </div>
                  {user && (
                    <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors">
                      <LogOut size={12} /> Logout
                    </button>
                  )}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-stone-800 text-stone-100 p-6 shadow-md rounded-sm">
              <h3 className="uppercase tracking-widest text-xs text-stone-400 mb-6">Studio Activity</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-light">Total Spent</span>
                    <span className="font-serif text-xl">₹{stats.totalSpent}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-light">Orders</span>
                    <span className="font-serif text-xl">{stats.totalOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-light">Workshops</span>
                    <span className="font-serif text-xl">{stats.totalBookings}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: History */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Bookings Section */}
            <section>
              <h3 className="font-serif text-2xl text-stone-800 mb-4 flex items-center gap-2">
                <Calendar className="text-terracotta" size={20} /> Upcoming Workshops
              </h3>
              {bookings.length === 0 ? (
                <div className="bg-white p-8 border border-stone-200 text-center text-stone-400 rounded-sm">
                  <p className="italic">No workshops booked yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="bg-white p-5 border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center rounded-sm hover:border-terracotta transition-colors">
                      <div>
                        <h4 className="font-medium text-stone-800">{booking.workshopTitle}</h4>
                        <p className="text-sm text-stone-500 mt-1">{booking.slot}</p>
                        <span className="inline-block mt-2 text-[10px] uppercase tracking-wider bg-green-100 text-green-700 px-2 py-1 rounded-sm">
                          Confirmed
                        </span>
                      </div>
                      <div className="mt-4 sm:mt-0 text-right">
                        <p className="text-stone-400 text-xs mb-1">{booking.date}</p>
                        <p className="font-serif text-lg text-stone-800">₹{booking.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Orders Section */}
            <section>
              <h3 className="font-serif text-2xl text-stone-800 mb-4 flex items-center gap-2">
                <Package className="text-stone-600" size={20} /> Order History
              </h3>
              {orders.length === 0 ? (
                <div className="bg-white p-8 border border-stone-200 text-center text-stone-400 rounded-sm">
                  <p className="italic">No pottery collected yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white p-5 border border-stone-200 rounded-sm">
                      <div className="flex justify-between items-center border-b border-stone-100 pb-3 mb-3">
                        <span className="text-xs uppercase tracking-widest text-stone-400">Order #{order.id.slice(-6)}</span>
                        <span className="text-xs text-stone-400">{order.date}</span>
                      </div>
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-stone-600">{item.quantity}x {item.name}</span>
                            <span className="text-stone-900 font-medium">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-stone-100">
                        <span className="text-sm font-medium text-stone-500">Total Paid</span>
                        <span className="font-serif text-xl text-stone-800">₹{order.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;