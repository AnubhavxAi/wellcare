"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfServicePage() {
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
              Terms of Service
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
            <Section title="1. Acceptance of Terms">
              <p>By accessing or using the Wellcare Pharmacy website (wellcarev1.vercel.app) 
              and our services, you agree to be bound by these Terms of Service. If you do 
              not agree to all the terms and conditions, you must not use our services.</p>
            </Section>

            <Section title="2. Eligibility">
              <p>To use our services, you must be at least 18 years of age and capable of 
              entering into a legally binding agreement under Indian law. Currently, our 
              delivery services are restricted to specific pin codes within Agra, Uttar 
              Pradesh (282001-282010).</p>
            </Section>

            <Section title="3. Pharmacy Licensing">
              <p>Wellcare Pharmacy operates as a fully licensed retail pharmacy under the 
              Drugs and Cosmetics Act, 1940. Our Drug License No. is UP/AG/2024/001234. All 
              dispensing is supervised by registered pharmacists.</p>
            </Section>

            <Section title="4. Prescription Medicines (Schedule H/H1)">
              <ul style={{paddingLeft:"20px", listStyleType:"disc"}}>
                <li>Medicines marked as "Rx Required" (Schedule H and H1 drugs) will strictly 
                not be dispensed without a valid prescription from a registered medical 
                practitioner.</li>
                <li>You must upload a clear copy of the prescription during checkout.</li>
                <li>Our pharmacists will verify the prescription before confirming your order.</li>
                <li>We reserve the right to reject any order if the prescription is found to be 
                invalid, expired, or tampered with.</li>
              </ul>
            </Section>

            <Section title="5. Product Information Disclaimer">
              <p>The information provided on our website regarding medical conditions, 
              medicines, side effects, and treatments is for informational purposes only. It is 
              <strong>not a substitute for professional medical advice</strong>, diagnosis, or 
              treatment. Always consult your doctor before starting any new medication.</p>
            </Section>

            <Section title="6. Ordering, Pricing, and Payment">
              <ul style={{paddingLeft:"20px", listStyleType:"disc"}}>
                <li>All prices listed are in Indian Rupees (INR) and are inclusive of relevant 
                taxes.</li>
                <li>Prices are subject to change without notice, but you will be charged the 
                price displayed at the time of checkout.</li>
                <li>We accept Cash on Delivery (COD) and UPI payments at the time of delivery.</li>
                <li>Free home delivery is available for orders above ₹499.</li>
              </ul>
            </Section>

            <Section title="7. Cancellation and Refund Policy">
              <ul style={{paddingLeft:"20px", listStyleType:"disc"}}>
                <li><strong>Medicines:</strong> Due to health and safety regulations, all medicine 
                sales are final and non-returnable once delivered, unless the wrong or expired 
                item was supplied.</li>
                <li><strong>Medical Devices:</strong> Devices can be returned within 7 days ONLY 
                in the event of a manufacturing defect.</li>
                <li><strong>Delivery Charges:</strong> For orders below ₹499, a nominal delivery 
                charge of ₹49 will be applied. Delivery charges are non-refundable.</li>
                <li>Orders can be cancelled before dispatch without any penalty.</li>
              </ul>
            </Section>

            <Section title="8. Lab Test Booking Services">
              <p>Wellcare Pharmacy acts as a facilitator for booking diagnostic lab tests. 
              The actual sample collection and testing are conducted by our certified partner 
              laboratories. Wellcare Pharmacy is not liable for the accuracy of test results 
              or any medical decisions made based on them.</p>
            </Section>

            <Section title="9. User Account Responsibilities">
              <p>You are responsible for maintaining the confidentiality of your account credentials 
              (including OTPs) and for all activities that occur under your account. You agree to 
              provide accurate and complete information during registration.</p>
            </Section>

            <Section title="10. Limitation of Liability">
              <p>To the maximum extent permitted by law, Wellcare Pharmacy shall not be liable 
              for any indirect, incidental, special, consequential, or punitive damages, including 
              but not limited to health complications arising from the misuse of medicines or 
              failure to follow a doctor's prescription.</p>
            </Section>

            <Section title="11. Prohibited Activities">
              <p>You agree not to:</p>
              <ul style={{paddingLeft:"20px", listStyleType:"disc"}}>
                <li>Use the platform for any illegal purpose or to purchase restricted drugs 
                unlawfully.</li>
                <li>Submit false or forged prescriptions.</li>
                <li>Attempt to gain unauthorized access to our systems or user data.</li>
                <li>Harass or abuse our delivery personnel or staff.</li>
              </ul>
            </Section>

            <Section title="12. Governing Law">
              <p>These Terms of Service shall be governed by and construed in accordance with 
              the laws of India. Any disputes arising out of or in connection with these terms 
              shall be subject to the exclusive jurisdiction of the courts located in Agra, 
              Uttar Pradesh.</p>
            </Section>

            <Section title="13. Grievance Officer">
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
              </div>
            </Section>
          </div>

          <div style={{ textAlign:"center", marginTop:"32px" }}>
            <Link href="/privacy-policy" style={{
              color:"#0b6b1d", fontWeight:600, textDecoration:"none",
              marginRight:"24px"
            }}>
              Privacy Policy →
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
