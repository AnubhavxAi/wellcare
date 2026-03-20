import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DoctorDirectory from "@/components/DoctorDirectory";

export default function DoctorsPage() {
  return (
    <div className="min-h-screen flex flex-col pt-16 mt-1bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <DoctorDirectory />
      </main>
      <Footer />
    </div>
  );
}
