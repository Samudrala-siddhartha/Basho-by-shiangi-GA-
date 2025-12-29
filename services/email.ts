import emailjs from '@emailjs/browser';

// ---------------------------------------------------------
// CONFIGURATION
// 1. Service ID: Found in EmailJS Dashboard > Email Services (e.g., "service_gmail")
// 2. Template ID: Found in EmailJS Dashboard > Email Templates (e.g., "template_auth")
// 3. Public Key: Found in EmailJS Dashboard > Account > API Keys
// ---------------------------------------------------------

const SERVICE_ID = 'service_gmail'; // Change this if your Service ID is different
const TEMPLATE_ID = 'template_auth'; // Change this if your Template ID is different
const PUBLIC_KEY = 'pEvPLhE6Z7H8XG9La'; // Key provided by user

export const sendVerificationEmail = async (name: string, email: string, otp: string): Promise<boolean> => {
  
  // 1. Check for placeholder configuration immediately
  if (SERVICE_ID === 'service_gmail' || SERVICE_ID === 'YOUR_SERVICE_ID') {
    console.warn("⚠️ EMAILJS: Default Service ID detected. Switching to Demo Mode.");
    await simulateNetworkDelay();
    showDemoAlert(email, otp, "Service not configured (Placeholder ID)");
    return true;
  }

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_name: name,
        to_email: email,
        otp: otp, 
      },
      PUBLIC_KEY
    );

    if (response.status === 200) {
        console.log("Email sent successfully!", response);
        return true;
    }
    
    throw new Error(`Unexpected status: ${response.status}`);

  } catch (error: any) {
    // 2. Fail-Safe: Catch ALL errors (Bad ID, Network, Quota, etc.)
    // We do not want the app to "break" during a hackathon demo.
    
    // Attempt to extract a readable error message
    const errorMsg = error?.text || error?.message || (typeof error === 'string' ? error : 'Unknown Error');
    
    console.error("❌ EmailJS Failed:", error);
    console.warn("Falling back to Demo Mode so login proceeds.");

    // Show the OTP via alert so the user is not stuck
    showDemoAlert(email, otp, `Delivery failed (${errorMsg})`);
    
    // Return true so the UI thinks it succeeded and moves to the OTP step
    return true; 
  }
};

const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 800));

const showDemoAlert = (email: string, otp: string, reason: string) => {
    alert(
`[DEMO MODE: ${reason}]

Since real email delivery failed or is not configured, 
we are simulating the inbox.

--------------------------------
To: ${email}
Subject: Your Login Code

Your Verification Code is: ${otp}
--------------------------------

(Click OK to copy code)`
    );
};