import { Product, Workshop } from './types';

// Fallback image in case specific ones fail
export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Kintsugi Bowl',
    price: 4500,
    category: 'Decor',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop', // Ceramic bowl texture
    description: 'Hand-thrown stoneware bowl repaired with gold lacquer, celebrating the beauty of imperfection.',
    inStock: true,
  },
  {
    id: 'p2',
    name: 'Matcha Set - Moss',
    price: 3200,
    category: 'Tea Sets',
    image: 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=800&auto=format&fit=crop', // Green tea/matcha
    description: 'A complete ceremonial matcha set glazed in deep moss green tones.',
    inStock: true,
  },
  {
    id: 'p3',
    name: 'Sabi Serving Platter',
    price: 2800,
    category: 'Tableware',
    image: 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?q=80&w=800&auto=format&fit=crop', // Ceramic plate
    description: 'Rustic serving platter with raw edges and a matte ash glaze.',
    inStock: true,
  },
  {
    id: 'p4',
    name: 'Midnight Sake Cup',
    price: 850,
    category: 'Tableware',
    image: 'https://images.unsplash.com/photo-1578496479914-8ef92e6d3d91?q=80&w=800&auto=format&fit=crop', // Sake cup/dark
    description: 'Small, delicate sake cup fired in a reduction kiln for a deep charcoal finish.',
    inStock: true,
  },
  {
    id: 'p5',
    name: 'Ikebana Vase',
    price: 5500,
    category: 'Decor',
    image: 'https://images.unsplash.com/photo-1581783342308-f792ca11df53?q=80&w=800&auto=format&fit=crop', // Ceramic vase
    description: 'Tall, slender vase designed specifically for Ikebana flower arrangements.',
    inStock: false,
  },
  {
    id: 'p6',
    name: 'Cloud Teapot',
    price: 4200,
    category: 'Tea Sets',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop', // Teapot
    description: 'Hand-carved handle with a milky white glaze reminiscent of morning fog.',
    inStock: true,
  }
];

export const WORKSHOPS: Workshop[] = [
  {
    id: 'w1',
    title: 'Intro to Wheel Throwing',
    date: 'Oct 15, 2024 - 10:00 AM',
    price: 2500,
    slots: 4,
    image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?q=80&w=800&auto=format&fit=crop', // Hands on wheel
    description: 'Learn the basics of centering clay and pulling walls on the potter\'s wheel.',
  },
  {
    id: 'w2',
    title: 'Handbuilding: Coil & Pinch',
    date: 'Oct 22, 2024 - 2:00 PM',
    price: 1800,
    slots: 8,
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=800&auto=format&fit=crop', // Clay tools/hands
    description: 'A meditative session focusing on ancient handbuilding techniques.',
  },
  {
    id: 'w3',
    title: 'Glazing Masterclass',
    date: 'Nov 05, 2024 - 11:00 AM',
    price: 3000,
    slots: 6,
    image: 'https://images.unsplash.com/photo-1565193566173-7a64c27876af?q=80&w=800&auto=format&fit=crop', // Studio shelves
    description: 'Understand the chemistry of glazes and learn layering techniques.',
  }
];