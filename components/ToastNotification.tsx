import React, { useState, useEffect } from 'react';
import { CheckCircle, Info, XCircle } from 'lucide-react';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

const ToastNotification: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    // Event listener for custom toast events
    const handleShowToast = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string; type?: 'success' | 'info' | 'error' }>;
      const { message, type = 'success' } = customEvent.detail;
      const id = Date.now().toString(); // Unique ID for each toast

      setToasts(prev => [...prev, { id, message, type }]);

      // Automatically remove toast after 3 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 3000); 
    };

    // Add event listener to the window
    window.addEventListener('show-toast', handleShowToast as EventListener);
    
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('show-toast', handleShowToast as EventListener);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    <div className="fixed bottom-6 right-6 z-[80] space-y-3 pointer-events-none">
      {toasts.map(toast => (
        <div 
          key={toast.id} 
          className={`bg-stone-800 text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-2 animate-fade-in transition-opacity duration-300 ${
            toast.type === 'success' ? 'bg-green-600' :
            toast.type === 'info' ? 'bg-blue-600' :
            toast.type === 'error' ? 'bg-red-600' : ''
          }`}
          role="status"
          aria-live="polite"
        >
          {toast.type === 'success' && <CheckCircle size={18} className="text-white" />}
          {toast.type === 'info' && <Info size={18} className="text-white" />}
          {toast.type === 'error' && <XCircle size={18} className="text-white" />}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default ToastNotification;
