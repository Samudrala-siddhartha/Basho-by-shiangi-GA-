import React, { useState } from 'react';
import { WORKSHOPS, FALLBACK_IMAGE } from '../constants';
import { Calendar, Clock, Users, X, CheckCircle, Loader2, Video, Copy, ExternalLink, MapPin } from 'lucide-react';
import { Workshop } from '../types';
import { saveBooking } from '../services/storage';
import { trackEvent } from '../services/analytics'; // Import trackEvent

const Workshops: React.FC = () => {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);

  return (
    <div className="pt-24 min-h-screen bg-stone-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl text-stone-800 mb-4">Studio Sessions</h1>
          <p className="text-stone-500 font-light max-w-xl mx-auto">
            Learn the art of patience and pressure.
          </p>
        </div>

        <div className="space-y-8">
          {WORKSHOPS.map((workshop) => (
            <div key={workshop.id} className="bg-white border border-stone-200 overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-shadow duration-300">
              <div className="md:w-1/3 h-64 md:h-auto relative bg-stone-200">
                <img 
                  src={workshop.image} 
                  alt={workshop.title} 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = FALLBACK_IMAGE;
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 md:w-2/3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-serif text-3xl text-stone-800">{workshop.title}</h3>
                    <span className="font-sans font-medium text-xl text-terracotta">₹{workshop.price}</span>
                  </div>
                  <p className="text-stone-600 font-light mb-6">
                    {workshop.description}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-stone-500 mb-8">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-stone-400" />
                      {workshop.date.split(' - ')[0]}
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-stone-400" />
                      {workshop.date.split(' - ')[1]}
                    </div>
                    <div className="flex items-center">
                      <Users size={16} className="mr-2 text-stone-400" />
                      {workshop.slots} slots remaining
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedWorkshop(workshop)}
                  className="w-full md:w-auto self-start bg-stone-800 text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-terracotta transition-colors"
                >
                  Book Your Seat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedWorkshop && (
        <BookingModal 
          workshop={selectedWorkshop} 
          onClose={() => setSelectedWorkshop(null)} 
        />
      )}
    </div>
  );
};

const BookingModal: React.FC<{ workshop: Workshop, onClose: () => void }> = ({ workshop, onClose }) => {
    const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [bookingId, setBookingId] = useState('');

    const handleBook = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('processing');
        
        setTimeout(() => {
            const id = `BKG-${Date.now().toString().slice(-4)}-${Math.floor(Math.random()*1000)}`;
            setBookingId(id);
            
            saveBooking({
                id,
                date: workshop.date,
                workshopTitle: workshop.title,
                slot: "Standard Slot",
                price: workshop.price
            });

            // Track analytics event
            trackEvent('workshopBookings');
            
            setStep('success');
        }, 1500);
    };

    if (step === 'success') {
        return (
             <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-white p-8 max-w-sm w-full text-center shadow-xl animate-fade-in rounded-sm">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-600" size={32} />
                    </div>
                    <h3 className="font-serif text-2xl text-stone-800 mb-2">Registration Confirmed</h3>
                    <p className="text-stone-500 mb-6 text-sm">
                        We look forward to seeing you at the studio.
                    </p>
                    
                    <div className="bg-stone-50 p-4 mb-4 text-left border border-stone-100 space-y-3 rounded-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase text-stone-400 tracking-wider">Booking ID</span>
                            <span className="font-mono text-stone-800 font-medium text-sm">{bookingId}</span>
                        </div>
                        <div className="flex justify-between items-center">
                             <span className="text-[10px] uppercase text-stone-400 tracking-wider">Session Time</span>
                             <span className="text-stone-800 font-medium text-sm">{workshop.date}</span>
                        </div>
                        <div className="flex justify-between items-start">
                             <span className="text-[10px] uppercase text-stone-400 tracking-wider mt-1">Location</span>
                             <span className="text-stone-800 font-medium text-sm text-right">Basho Studio,<br/>Hauz Khas Village</span>
                        </div>
                    </div>

                    <button onClick={onClose} className="w-full bg-stone-900 text-white py-3 uppercase tracking-widest text-sm hover:bg-terracotta transition-colors">
                        Close & Save
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white max-w-md w-full shadow-2xl animate-fade-in flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-stone-100">
                    <h3 className="font-serif text-xl text-stone-800">Workshop Registration</h3>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-800">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex gap-4 mb-6">
                        <div className="w-20 h-20 bg-stone-200 shrink-0">
                             <img src={workshop.image} alt={workshop.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h4 className="font-serif text-lg text-stone-800 leading-tight">{workshop.title}</h4>
                            <p className="text-terracotta font-medium mt-1">₹{workshop.price}</p>
                             <div className="flex items-center text-xs text-stone-500 mt-2">
                                <Calendar size={12} className="mr-1" />
                                {workshop.date}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleBook} className="space-y-4">
                         <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wide text-stone-500">Participant Name <span className="text-red-400">*</span></label>
                            <input 
                                type="text" 
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Your Name" 
                                className="w-full p-3 border border-stone-200 rounded-sm focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none" 
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wide text-stone-500">Contact Email <span className="text-red-400">*</span></label>
                            <input 
                                type="email" 
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="you@example.com" 
                                className="w-full p-3 border border-stone-200 rounded-sm focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none" 
                            />
                        </div>
                        
                        <div className="pt-4">
                             <button 
                                type="submit"
                                disabled={step === 'processing'}
                                className="w-full bg-stone-900 text-white py-4 flex items-center justify-center gap-2 hover:bg-terracotta transition-colors disabled:opacity-70"
                            >
                                {step === 'processing' ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} /> Reserving Slot...
                                    </>
                                ) : (
                                    <>
                                        Confirm Booking <CheckCircle size={18} />
                                    </>
                                )}
                            </button>
                             <p className="text-[10px] text-center text-stone-400 mt-3">
                                Payment will be collected at the studio or via payment link sent to email.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Workshops;