import { Order, WorkshopBooking, UserProfile, Product } from '../types';

const KEYS = {
  ORDERS: 'basho_orders',
  BOOKINGS: 'basho_bookings',
  USERS: 'basho_users', // Persistent: Stores all registered users
  SESSION_CURRENT_USER: 'basho_session_current_user', // Temporary: Stores the currently logged-in user for the session
  WISHLIST: 'basho_wishlist', // Persistent: Stores user's wishlist items
};

// --- Admin Configuration (Frontend-only, NOT SECURE) ---
const ADMIN_EMAIL = "siddarthasamudrala@gmail.com"; // Define the admin email address

// --- Helper for consistent email handling ---
const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

// --- Authentication ---

export const registerUser = (name: string, email: string): boolean => {
  const users = getAllUsers(); // Gets all users from localStorage (persistent)
  const safeEmail = normalizeEmail(email);
  
  // Check if user exists to avoid duplicates
  const existingUserIndex = users.findIndex(u => normalizeEmail(u.email) === safeEmail);
  
  if (existingUserIndex === -1) {
      // Create new user
      const newUser: UserProfile = { 
        name: name.trim(), 
        email: safeEmail,
      };
      users.push(newUser);
      localStorage.setItem(KEYS.USERS, JSON.stringify(users)); // Save updated list to localStorage (persistent)
      console.log(`[Storage] Registered new user: ${safeEmail}`);
      return true;
  } else {
      console.log(`[Storage] User already exists: ${safeEmail}`);
      return false; // User already exists
  }
};

export const checkUserExists = (email: string): boolean => {
  const users = getAllUsers(); // Reads from localStorage (persistent)
  const safeEmail = normalizeEmail(email);
  return users.some(u => normalizeEmail(u.email) === safeEmail);
};

export const loginUser = (email: string): boolean => {
  const users = getAllUsers(); // Gets all users from localStorage (persistent)
  const safeEmail = normalizeEmail(email);
  
  const user = users.find(u => normalizeEmail(u.email) === safeEmail);
  
  if (user) {
    // If user exists, store their profile in sessionStorage for the current session (temporary)
    sessionStorage.setItem(KEYS.SESSION_CURRENT_USER, JSON.stringify(user)); 
    console.log(`[Storage] User logged in: ${safeEmail}`);
    return true;
  }
  
  console.warn(`[Storage] Login failed. User not found: ${safeEmail}`);
  console.debug('[Storage] Available users:', users.map(u => u.email));
  return false;
};

export const getUserProfile = (): UserProfile | null => {
  try {
    // Read current user profile from sessionStorage (temporary session data)
    const data = sessionStorage.getItem(KEYS.SESSION_CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const logoutUser = (): void => {
    // Only clear the current user's session from sessionStorage
    sessionStorage.removeItem(KEYS.SESSION_CURRENT_USER);
    console.log('[Storage] User logged out (session cleared).');
};

const getAllUsers = (): UserProfile[] => {
    try {
        // Always retrieve all registered users from localStorage
        const data = localStorage.getItem(KEYS.USERS);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

// --- Admin Check ---
export const isAdmin = (): boolean => {
  const user = getUserProfile();
  return user ? normalizeEmail(user.email) === normalizeEmail(ADMIN_EMAIL) : false;
};

// --- Wishlist ---
export const getWishlist = (): Product[] => {
  try {
    const data = localStorage.getItem(KEYS.WISHLIST);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse wishlist from storage", e);
    return [];
  }
};

export const addToWishlist = (product: Product): void => {
  const wishlist = getWishlist();
  if (!wishlist.some(item => item.id === product.id)) {
    localStorage.setItem(KEYS.WISHLIST, JSON.stringify([...wishlist, product]));
    console.log(`[Storage] Added ${product.name} to wishlist.`);
  } else {
    console.log(`[Storage] ${product.name} is already in wishlist.`);
  }
};

export const removeFromWishlist = (productId: string): void => {
  const wishlist = getWishlist();
  const updatedWishlist = wishlist.filter(item => item.id !== productId);
  localStorage.setItem(KEYS.WISHLIST, JSON.stringify(updatedWishlist));
  console.log(`[Storage] Removed ${productId} from wishlist.`);
};

export const isProductInWishlist = (productId: string): boolean => {
  return getWishlist().some(item => item.id === productId);
};

// --- Orders ---
export const saveOrder = (order: Order) => {
  const user = getUserProfile(); // Gets current user from sessionStorage
  // Associate order with current user if logged in
  if (user && !order.userEmail) {
      order.userEmail = user.email; // Already normalized from profile
  }
  
  const existing = getAllOrdersRaw();
  localStorage.setItem(KEYS.ORDERS, JSON.stringify([order, ...existing]));
};

export const getOrders = (): Order[] => {
  const allOrders = getAllOrdersRaw(); // All orders (persistent in localStorage)
  const user = getUserProfile(); // Current user from sessionStorage
  
  if (user) {
      // Filter strictly by normalized email of the current session user
      return allOrders.filter(o => o.userEmail && normalizeEmail(o.userEmail) === normalizeEmail(user.email));
  }
  return []; // If not logged in, show no orders
};

const getAllOrdersRaw = (): Order[] => {
  const data = localStorage.getItem(KEYS.ORDERS);
  return data ? JSON.parse(data) : [];
};

// --- Bookings ---
export const saveBooking = (booking: WorkshopBooking) => {
  const user = getUserProfile(); // Gets current user from sessionStorage
  if (user && !booking.userEmail) {
      booking.userEmail = user.email;
  }
  
  const existing = getAllBookingsRaw();
  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify([booking, ...existing]));
};

export const getBookings = (): WorkshopBooking[] => {
  const allBookings = getAllBookingsRaw(); // All bookings (persistent in localStorage)
  const user = getUserProfile(); // Current user from sessionStorage
  
  if (user) {
      return allBookings.filter(b => b.userEmail && normalizeEmail(b.userEmail) === normalizeEmail(user.email));
  }
  return [];
};

const getAllBookingsRaw = (): WorkshopBooking[] => {
  const data = localStorage.getItem(KEYS.BOOKINGS);
  return data ? JSON.parse(data) : [];
};

// --- Stats Calculation ---
export const getDashboardStats = () => {
  // getOrders and getBookings already filter by the current session user
  const orders = getOrders(); 
  const bookings = getBookings();
  
  const totalOrders = orders.length;
  const totalBookings = bookings.length;
  
  const spentOnOrders = orders.reduce((acc, curr) => acc + curr.total, 0);
  const spentOnBookings = bookings.reduce((acc, curr) => acc + curr.price, 0);
  
  return {
    totalOrders,
    totalBookings,
    totalSpent: spentOnOrders + spentOnBookings
  };
};