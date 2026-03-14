import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import PrescriptionUpload from "@/components/PrescriptionUpload";
import DoctorDirectory from "@/components/DoctorDirectory";
import Footer from "@/components/Footer";
import ProductCategories from "@/components/ProductCategories";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <ProductCategories />
        <DoctorDirectory />
        <div id="prescription-upload">
          <PrescriptionUpload />
        </div>
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
