export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Tableware' | 'Decor' | 'Tea Sets';
  image: string;
  description: string;
  inStock: boolean;
}

export interface Workshop {
  id: string;
  title: string;
  date: string;
  price: number;
  slots: number;
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// --- New Types for Dashboard ---

export interface UserProfile {
  name: string;
  email: string;
}

export interface Order {
  id: string;
  date: string;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  userEmail?: string; // Added for data isolation
}

export interface WorkshopBooking {
  id: string;
  date: string;
  workshopTitle: string;
  slot: string;
  price: number;
  userEmail?: string; // Added for data isolation
}

// --- New Type for Analytics ---
export interface AnalyticsData {
  totalVisits: number; // General app loads/visits
  productViews: number;
  cartAdds: number;
  wishlistAdds: number;
  wishlistRemovals: number;
  purchases: number;
  workshopBookings: number;
}