import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PageLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const navigate = useNavigate();

  return (
    <div className="pt-24 min-h-screen bg-stone-50 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="mb-8 group flex items-center text-stone-400 hover:text-stone-800 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase tracking-widest text-xs font-medium">Back</span>
        </button>

        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-stone-800 mb-4">{title}</h1>
          <div className="w-16 h-1 bg-terracotta mx-auto opacity-50"></div>
        </div>
        <div className="bg-white p-8 md:p-12 border border-stone-200 shadow-sm space-y-8 text-stone-600 font-light leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export const ShippingReturns: React.FC = () => (
  <PageLayout title="Shipping & Returns">
    <section>
      <h3 className="font-serif text-xl text-stone-800 mb-2">Shipping Policy</h3>
      <p className="mb-4">
        We ship domestic orders within <strong>5-7 business days</strong>. Each piece is packed with sustainable, shock-absorbent materials to ensure it reaches you safely.
      </p>
      <p>
        International shipping is currently available upon special request. Please contact us for a quote.
      </p>
    </section>

    <section>
      <h3 className="font-serif text-xl text-stone-800 mb-2">The Handcrafted Promise</h3>
      <p className="mb-4 bg-stone-50 p-4 border-l-2 border-terracotta text-sm italic">
        "Imperfection is the fingerprint of the maker."
      </p>
      <p>
        Please note that every item is wheel-thrown and hand-glazed. Slight variations in form, color, and texture are not defects but rather the hallmark of handmade pottery (Wabi-sabi).
      </p>
    </section>

    <section>
      <h3 className="font-serif text-xl text-stone-800 mb-2">Returns & Breakage</h3>
      <p>
        Due to the fragile nature of ceramics, we do not accept returns for change of mind. However, if your order arrives damaged, please email us a photo within <strong>24 hours</strong> of delivery, and we will issue a full refund or replacement.
      </p>
    </section>
  </PageLayout>
);

export const CareInstructions: React.FC = () => (
  <PageLayout title="Care Instructions">
    <section>
      <h3 className="font-serif text-xl text-stone-800 mb-2">Daily Use</h3>
      <p className="mb-4">
        Our stoneware is fired at 1200°C, making it durable for everyday use. While most pieces are food-safe, we recommend washing by hand with mild soap and a soft sponge to preserve the glaze's luster over time.
      </p>
    </section>

    <section>
      <h3 className="font-serif text-xl text-stone-800 mb-2">Temperature</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Microwave:</strong> Safe for short durations. Ceramics can get hot, so handle with care.</li>
        <li><strong>Dishwasher:</strong> Top-rack safe, though hand washing is preferred for longevity.</li>
        <li><strong>Thermal Shock:</strong> Avoid moving pieces directly from the fridge to a hot oven or pouring boiling water into a freezing cold cup.</li>
      </ul>
    </section>

    <section>
      <h3 className="font-serif text-xl text-stone-800 mb-2">Staining</h3>
      <p>
        Matte glazes (like our Moss and Stone collections) may stain over time with highly pigmented foods (turmeric, beets, coffee). This patina is natural and adds to the piece's story.
      </p>
    </section>
  </PageLayout>
);

export const PrivacyPolicy: React.FC = () => (
  <PageLayout title="Privacy Policy">
    <section>
      <p className="italic text-sm text-stone-500 mb-6">Last Updated: October 2024</p>
      <p className="mb-4">
        At <strong>Basho by Shivangi</strong>, we respect your privacy and are committed to protecting your personal data. This policy outlines how we handle your information when you visit our website, purchase our ceramics, or book a workshop.
      </p>
    </section>

    <section>
      <h3 className="font-serif text-xl text-stone-800 mb-3">1. Information We Collect</h3>
      <p className="mb-4">We only collect information that is necessary to fulfill your requests:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Personal Details:</strong> Name, email address, and phone number for order updates and workshop confirmations.</li>
        <li><strong>Shipping Information:</strong> Physical address for delivering your pottery.</li>
        <li><strong>Custom Requests:</strong> Descriptions and reference images uploaded for custom commissions.</li>
      </ul>
    </section>

    <section>
      <h3 className="font-serif text-xl text-stone-800 mb-3">2. Payments & Financial Data</h3>
      <p className="mb-4">
        We <strong>do not</strong> store your credit card details, bank account numbers, or UPI IDs on our servers.
      </p>
      <p>
        All transactions are processed securely through <strong>Razorpay</strong>. When you make a purchase, you are redirected to Razorpay's encrypted payment gateway. We only receive a confirmation of payment success or failure.
      </p>
    </section>

    <section>
      <h3 className="font-serif text-xl text-stone-800 mb-3">3. Local Storage & Cookies</h3>
      <p className="mb-4">
        To provide a seamless shopping experience without requiring you to create an account, we use <strong>Local Storage</strong> technology in your browser.
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Cart Data:</strong> We store your selected items locally on your device so they remain in your cart if you refresh the page.</li>
        <li><strong>No Tracking Cookies:</strong> We do not use third-party tracking cookies for advertising purposes.</li>
      </ul>
    </section>

    <section>
      <h3 className="font-serif text-xl text-stone-800 mb-3">4. Workshops & Online Sessions</h3>
      <p className="mb-4">
        When you book a workshop, your email is used to send calendar invites and meeting links (Google Meet/Zoom). We do not share your contact details with other participants unless you explicitly consent to a group networking list.
      </p>
    </section>

    <section>
      <h3 className="font-serif text-xl text-stone-800 mb-3">5. Contact Us</h3>
      <p>
        If you have questions about your data or wish to have your information removed from our records, please contact us at:
        <br />
        <a href="mailto:privacy@bashobyshivangi.com" className="text-terracotta hover:underline mt-2 inline-block">privacy@bashobyshivangi.com</a>
      </p>
    </section>
  </PageLayout>
);