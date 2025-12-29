import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, checkUserExists } from '../services/storage';
// Removed: import { sendVerificationEmail } from '../services/email';
import { ArrowRight, AlertCircle, Loader2, Mail } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  // Input states
  const [email, setEmail] = useState('');
  
  // Logic states
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Helper to clear error when user types
  const clearError = () => {
    if (error) setError('');
  };

  // Handle Login: Directly attempts login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic client-side validation
    if (!email || !email.includes('@')) {
        setError('Please enter a valid email address.');
        setIsLoading(false);
        return;
    }

    // Check if user exists in our "database" (localStorage)
    const exists = checkUserExists(email);

    if (exists) {
        // Log the user in directly
        const success = loginUser(email);
        if (success) {
          navigate('/dashboard');
        } else {
          // This case should ideally not happen if user exists and loginUser is robust
          setError('An unexpected error occurred during login. Please try again.');
        }
    } else {
        // User does not exist, prompt them to sign up
        setError('No account found with this email. Please register to create your Bashō identity.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="pt-32 min-h-screen bg-stone-50 pb-20 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 border border-stone-200 shadow-xl rounded-sm transition-all duration-500">
        
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-stone-800 mb-2">Return to Sanctuary</h1>
          <p className="text-stone-500 font-light text-sm">
            Enter your email to access your artisan profile.
          </p>
        </div>

        {/* Removed: Demo Disclaimer */}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-stone-600 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input 
                  required 
                  type="email" 
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    clearError();
                  }}
                  onBlur={() => setEmail(prev => prev.trim())}
                  placeholder="artisan@example.com"
                  className={`w-full p-4 pl-12 bg-stone-50 border rounded-sm text-stone-900 focus:bg-white focus:outline-none transition-all ${error ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-stone-300 focus:border-terracotta focus:ring-1 focus:ring-terracotta'}`} 
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-sm text-sm border border-red-100 animate-pulse">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-stone-900 text-white py-4 flex items-center justify-center gap-2 hover:bg-terracotta transition-colors uppercase tracking-widest text-sm disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <>Login <ArrowRight size={18} /></>}
            </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-stone-100">
          <p className="text-stone-500 text-sm">
            First time visiting?{' '}
            <Link to="/signup" className="text-terracotta hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;