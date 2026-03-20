import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import ProductCategories from "@/components/ProductCategories";
import LabTestBooking from "@/components/LabTestBooking";
import DoctorDirectory from "@/components/DoctorDirectory";
import PrescriptionUpload from "@/components/PrescriptionUpload";
import HealthBlog from "@/components/HealthBlog";
import Testimonials from "@/components/Testimonials";
import LoyaltyBanner from "@/components/LoyaltyBanner";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-grow pt-16">
        <Hero />
        <TrustBadges />
        <ProductCategories />
        <DoctorDirectory limit={6} hideFilters={true} />
        <LabTestBooking />
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
