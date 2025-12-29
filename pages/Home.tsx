import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FALLBACK_IMAGE } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?q=80&w=2568&auto=format&fit=crop")' }} // Pottery/hands image
        >
          <div className="absolute inset-0 bg-stone-900/30"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-stone-50 mb-6 drop-shadow-md">
            Wabi-Sabi
          </h1>
          <p className="font-sans text-stone-200 text-lg md:text-xl max-w-lg mb-10 tracking-wide font-light">
            Finding beauty in imperfection. Handcrafted pottery inspired by the earth and the poetry of Matsuo Bashō.
          </p>
          <Link 
            to="/shop" 
            className="group relative px-8 py-3 bg-stone-100 text-stone-900 font-medium tracking-widest uppercase text-sm overflow-hidden transition-all hover:bg-terracotta hover:text-white"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-6 md:px-12 bg-stone-50">
        <div className="max-w-4xl mx-auto text-center">
          <span className="block text-terracotta text-sm uppercase tracking-[0.2em] mb-4">The Philosophy</span>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-800 mb-8 italic">
            "The old pond,<br/>
            A frog jumps in:<br/>
            Plop! Deep silence."
          </h2>
          <p className="text-stone-600 leading-relaxed font-light text-lg mb-8">
            Bashō by Shivangi is more than a studio; it is a meditation on clay. We believe that every crack tells a story and every uneven glaze adds character. Our pieces are not manufactured; they are born from the rhythm of the wheel and the heat of the kiln.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 border border-stone-200 hover:border-terracotta transition-colors duration-300">
              <h3 className="font-serif text-2xl mb-2 text-stone-800">Raw</h3>
              <p className="text-sm text-stone-500">Unrefined textures that connect you to the earth.</p>
            </div>
            <div className="p-6 border border-stone-200 hover:border-terracotta transition-colors duration-300">
              <h3 className="font-serif text-2xl mb-2 text-stone-800">Earthy</h3>
              <p className="text-sm text-stone-500">Palettes derived from nature: moss, stone, and clay.</p>
            </div>
            <div className="p-6 border border-stone-200 hover:border-terracotta transition-colors duration-300">
              <h3 className="font-serif text-2xl mb-2 text-stone-800">Soulful</h3>
              <p className="text-sm text-stone-500">Objects that bring a sense of calm to your daily rituals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-stone-800 text-stone-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1565193566173-7a64c27876af?q=80&w=2070&auto=format&fit=crop" 
              alt="Pottery workshop"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = FALLBACK_IMAGE;
              }}
              className="w-full h-[400px] object-cover grayscale hover:grayscale-0 transition-all duration-700 bg-stone-700"
            />
          </div>
          <div>
            <h2 className="font-serif text-4xl text-stone-50 mb-6">Experience the Wheel</h2>
            <p className="mb-8 font-light text-stone-400">
              Join us in the studio. Get your hands dirty, smell the wet clay, and create something uniquely yours under the guidance of our master potters.
            </p>
            <Link to="/workshops" className="inline-flex items-center text-terracotta hover:text-white transition-colors uppercase tracking-widest text-sm">
              Book a Workshop <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;