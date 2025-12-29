import React from 'react';
import { Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h3 className="font-serif text-2xl text-stone-100 mb-4">Bashō.</h3>
          <p className="text-sm font-light leading-relaxed">
            Celebrating the imperfect, the impermanent, and the incomplete. 
            Handcrafted ceramics from the heart of the studio.
          </p>
        </div>
        
        <div className="flex flex-col items-center md:items-start">
          <h4 className="uppercase text-xs tracking-widest text-stone-500 mb-4">Links</h4>
          <Link to="/shipping-returns" className="mb-2 hover:text-white transition-colors">Shipping & Returns</Link>
          <Link to="/care-instructions" className="mb-2 hover:text-white transition-colors">Care Instructions</Link>
          <Link to="/privacy-policy" className="mb-2 hover:text-white transition-colors">Privacy Policy</Link>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h4 className="uppercase text-xs tracking-widest text-stone-500 mb-4">Connect</h4>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-white transition-colors"><Mail size={20} /></a>
          </div>
          <p className="mt-4 text-xs font-light">© 2024 Basho by Shivangi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;