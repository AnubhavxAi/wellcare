"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main style={{
        background: "#f8faf9",
        flexGrow: 1,
        paddingTop: "120px",
        paddingBottom: "80px",
      }}>
        <div style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "0 24px",
        }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #0b6b1d, #2e8534)",
            borderRadius: "20px",
            padding: "48px",
            marginBottom: "40px",
            color: "white",
          }}>
            <p style={{ fontSize:"0.85rem", opacity:0.75, letterSpacing:"0.1em",
              textTransform:"uppercase", marginBottom:"8px" }}>
              Legal Document
            </p>
            <h1 style={{ fontFamily:"Manrope,sans-serif", fontSize:"2.5rem",
              fontWeight:800, margin:"0 0 12px" }}>
              Privacy Policy
            </h1>
            <p style={{ opacity:0.80, lineHeight:1.6 }}>
              Effective Date: 1 April 2026 &nbsp;|&nbsp; Last Updated: 1 April 2026
            </p>
            <p style={{ opacity:0.70, fontSize:"0.875rem", marginTop:"8px" }}>
              Wellcare Pharmacy · Drug License No. UP/AG/2024/001234
            </p>
          </div>

          {/* Content */}
          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "48px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            lineHeight: 1.8,
            color: "#40493d",
            fontFamily: "Inter, sans-serif",
            fontSize: "0.975rem",
          }}>
            <Section title="1. Introduction">
              <p>Wellcare Pharmacy is a licensed retail pharmacy operating at Rohit Complex, 
              Ayodhya Kunj-A, Jodha Bai Ka Rauza, Arjun Nagar, Agra, Uttar Pradesh 282001, 
              India. We operate an online pharmacy platform at wellcarev1.vercel.app.</p>
              <p style={{marginTop:"12px"}}>This Privacy Policy describes how we collect, use, 
              store, protect, and share your personal information and health data when you 
              use our services. We comply with the Information Technology Act 2000, IT (SPDI) 
              Rules 2011, and the Digital Personal Data Protection Act 2023.</p>
            </Section>

            <Section title="2. Information We Collect">
              <ul style={{paddingLeft:"20px", listStyleType:"disc"}}>
                <li><strong>Account Registration:</strong> Name, mobile number (OTP-verified), 
                email, date of birth, gender, delivery address.</li>
                <li><strong>Order Information:</strong> Medicines ordered, quantities, address, 
                payment method.</li>
                <li><strong>Prescription Data:</strong> Uploaded prescription images including 
                doctor name, patient details, and medications prescribed.</li>
                <li><strong>Lab Test Bookings:</strong> Test details, collection address, 
                preferred time, clinical notes.</li>
                <li><strong>Health Information:</strong> Medical conditions, current medications, 
                allergies provided during ordering.</li>
                <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, 
                search queries (anonymous analytics).</li>
              </ul>
            </Section>

            <Section title="3. How We Use Your Information">
              <ul style={{paddingLeft:"20px", listStyleType:"disc"}}>
                <li>Processing and fulfilling medicine orders and lab test bookings.</li>
                <li>Verifying prescriptions before dispensing regulated medicines.</li>
                <li>Sending order confirmations and delivery updates via WhatsApp.</li>
                <li>Compliance with Drugs and Cosmetics Act 1940 and Drug Rules 1945.</li>
                <li>Improving our Platform through anonymous usage analytics.</li>
                <li>Responding to customer service enquiries.</li>
              </ul>
            </Section>

            <Section title="4. Sensitive Health Data">
              <p>Your prescription details, medical conditions, and diagnostic booking 
              information are Sensitive Personal Data under IT Rules 2011. We treat all 
              health data with the highest confidentiality. We never sell, rent, or 
              commercially exploit your health data.</p>
              <p style={{marginTop:"12px"}}>Health data is accessible only to our licensed 
              pharmacists for prescription verification, and to regulatory authorities as 
              legally required.</p>
            </Section>

            <Section title="5. Data Storage and Security">
              <p>Your data is stored on Supabase cloud infrastructure in the Asia-Pacific 
              region (India-compliant servers). We implement:</p>
              <ul style={{paddingLeft:"20px", marginTop:"8px", listStyleType:"disc"}}>
                <li>TLS 1.3 encryption in transit</li>
                <li>Encryption at rest for all records and files</li>
                <li>Row-Level Security ensuring you only access your own data</li>
                <li>OTP authentication to prevent unauthorised access</li>
                <li>Prescription records retained for 5 years as required by Drugs Rules 1945</li>
              </ul>
            </Section>

            <Section title="6. Data Sharing">
              <p>We never sell your data. We share data only with:</p>
              <ul style={{paddingLeft:"20px", marginTop:"8px", listStyleType:"disc"}}>
                <li><strong>Service Providers:</strong> Supabase, Vercel, Twilio — bound by 
                data processing agreements.</li>
                <li><strong>Delivery Personnel:</strong> Name, address, order details for 
                fulfilment only.</li>
                <li><strong>Lab Partners:</strong> When you book home collection tests.</li>
                <li><strong>Legal Authorities:</strong> As required by Indian law.</li>
              </ul>
            </Section>

            <Section title="7. Your Rights">
              <p>Under DPDPA 2023 and IT Rules 2011, you have the right to:</p>
              <ul style={{paddingLeft:"20px", marginTop:"8px", listStyleType:"disc"}}>
                <li>Access a copy of your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion (subject to 5-year legal retention requirements)</li>
                <li>Withdraw consent for marketing</li>
                <li>Lodge a complaint with our Grievance Officer</li>
              </ul>
            </Section>

            <Section title="8. Cookies">
              <p>We use essential cookies for authentication and browser localStorage to 
              persist your shopping cart. No third-party advertising cookies are used. You 
              may clear cookies via browser settings, which will log you out.</p>
            </Section>

            <Section title="9. Contact and Grievance Officer">
              <div style={{
                background:"#f0fdf4", borderRadius:"12px", 
                padding:"20px", marginTop:"12px"
              }}>
                <p><strong>Wellcare Pharmacy</strong></p>
                <p>Rohit Complex, Ayodhya Kunj-A, Jodha Bai Ka Rauza</p>
                <p>Arjun Nagar, Agra, UP 282001</p>
                <p>📱 <a href="https://wa.me/919897397532" style={{color:"#0b6b1d"}}>
                  +91 9897397532</a></p>
                <p>✉️ <a href="mailto:wellcarepharmacy.agra@gmail.com" style={{color:"#0b6b1d"}}>
                  wellcarepharmacy.agra@gmail.com</a></p>
                <p style={{marginTop:"8px", fontSize:"0.875rem", color:"#6B7280"}}>
                  Complaints acknowledged within 24 hours, resolved within 30 days.</p>
              </div>
            </Section>
          </div>

          <div style={{ textAlign:"center", marginTop:"32px" }}>
            <Link href="/terms-of-service" style={{
              color:"#0b6b1d", fontWeight:600, textDecoration:"none",
              marginRight:"24px"
            }}>
              Terms of Service →
            </Link>
            <Link href="/" style={{ color:"#6B7280", textDecoration:"none" }}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom:"32px" }}>
      <h2 style={{
        fontFamily:"Manrope,sans-serif", fontSize:"1.2rem", fontWeight:700,
        color:"#0b6b1d", marginBottom:"12px", paddingBottom:"8px",
        borderBottom:"2px solid #f0fdf4"
      }}>
        {title}
      </h2>
      {children}
    </div>
  );
}
