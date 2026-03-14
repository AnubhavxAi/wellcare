import { Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-[var(--color-brand-navy)] text-white py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {/* Left Column: Brand & Tagline */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-3">
             <div className="bg-white p-1 rounded">
               <img src="/logo.png" alt="Wellcare Pharmacy Logo" className="h-8 max-w-[120px] object-contain" />
             </div>
             <span className="text-xl font-bold tracking-tight">Wellcare Pharmacy</span>
          </div>
          <p className="text-gray-300 text-sm max-w-xs leading-relaxed">
            Your trusted neighborhood pharmacy. We deliver genuine medicines and reliable healthcare services directly to your doorstep in Agra.
          </p>
        </div>

        {/* Middle Column: Contact Info */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          
          <a href="https://wa.me/919897397532" target="_blank" rel="noopener noreferrer" className="flex items-start text-gray-300 hover:text-[var(--color-brand-green)] transition-colors group">
            <Phone size={20} className="mr-3 mt-0.5 flex-shrink-0 group-hover:text-[var(--color-brand-green)] transition-colors" />
            <span className="text-sm font-medium">+91 9897397532</span>
          </a>
          
          <div className="flex items-start text-gray-300">
            <MapPin size={20} className="mr-3 mt-1 flex-shrink-0 text-gray-400" />
            <span className="text-sm leading-relaxed">
              Rohit Complex, Ayodhya Kunj-A,<br />
              Jodha Bai ka Rauza, Arjun Nagar,<br />
              Agra, Uttar Pradesh 282001
            </span>
          </div>
        </div>

        {/* Right Column: Quick Links */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <nav className="flex flex-col space-y-2">
            <a href="#" className="text-sm text-gray-300 hover:text-[var(--color-brand-green)] transition-colors inline-block w-fit">
              Home
            </a>
            <a href="#doctors" className="text-sm text-gray-300 hover:text-[var(--color-brand-green)] transition-colors inline-block w-fit">
              Doctors
            </a>
            <a href="#prescription-upload" className="text-sm text-gray-300 hover:text-[var(--color-brand-green)] transition-colors inline-block w-fit">
              Upload Prescription
            </a>
          </nav>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-700/50 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Wellcare Pharmacy. All rights reserved.
      </div>
    </footer>
  );
}
