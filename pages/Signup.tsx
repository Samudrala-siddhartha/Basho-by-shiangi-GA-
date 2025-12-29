import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, loginUser } from '../services/storage';
// Removed: import { sendVerificationEmail } from '../services/email';
import { ArrowRight, Loader2, Mail, AlertCircle } from 'lucide-react';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  
  // State for form data
  const [formData, setFormData] = useState({ name: '', email: '' });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Initial Registration
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic Validation
    if (!formData.name.trim()) {
        setError('Please enter your name.');
        setIsLoading(false);
        return;
    }
    if (!formData.email.includes('@')) {
        setError('Please enter a valid email address.');
        setIsLoading(false);
        return;
    }

    // Attempt registration (save data locally)
    const isNewUser = registerUser(formData.name, formData.email);
    
    if (isNewUser) {
        // Log the user in directly after successful registration
        loginUser(formData.email);
        
        // Redirect to dashboard
        navigate('/dashboard');
    } else {
        // If user already exists, suggest logging in
        setError('An account with this email already exists. Please try logging in instead.');
    }
    
    setIsLoading(false);
  };

  const clearError = () => setError('');

  return (
    <div className="pt-32 min-h-screen bg-stone-50 pb-20 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 border border-stone-200 shadow-xl rounded-sm transition-all duration-500">
        
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-stone-800 mb-2">
            Begin Your Journey
          </h1>
          <p className="text-stone-500 font-light text-sm">
            Join our community of makers and collectors.
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-6 animate-fade-in">
            <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-stone-600 mb-2">
                Full Name
                </label>
                <input 
                required 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Matsuo Basho"
                className="w-full p-4 bg-stone-50 border border-stone-300 rounded-sm text-stone-900 focus:bg-white focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all" 
                />
            </div>

            <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-stone-600 mb-2">
                Email Address
                </label>
                <div className="relative">
                    <input 
                    required 
                    type="email" 
                    value={formData.email}
                    onChange={e => {
                        setFormData({...formData, email: e.target.value});
                        clearError();
                    }}
                    onBlur={() => setFormData(prev => ({...prev, email: prev.email.trim()}))}
                    placeholder="artisan@example.com"
                    className="w-full p-4 pl-12 bg-stone-50 border border-stone-300 rounded-sm text-stone-900 focus:bg-white focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-all" 
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                </div>
                {/* Removed: "* We will send a real verification code to this address." */}
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-sm text-sm border border-red-100">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-stone-900 text-white py-4 flex items-center justify-center gap-2 hover:bg-terracotta transition-colors uppercase tracking-widest text-sm disabled:opacity-70"
            >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <>Register & Login <ArrowRight size={18} /></>}
            </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-stone-100">
          <p className="text-stone-500 text-sm">
            Already have an identity?{' '}
            <Link to="/login" className="text-terracotta hover:underline font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;