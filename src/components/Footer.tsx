import { Phone, MapPin, Mail, Clock } from "lucide-react";
import Link from "next/link";

const categoryLinks = [
  "Medicines",
  "Vitamins & Supplements",
  "Medical Devices",
  "Personal Care",
  "Baby Care",
  "Pain Relief",
  "Nutrition",
];

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Shop Medicines", href: "/shop" },
  { name: "Lab Tests", href: "/#lab-tests" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms of Service", href: "/terms-of-service" },
  { name: "Refund Policy", href: "/refund-policy" },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-[var(--color-brand-navy)] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 mt-auto"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        {/* Col 1: Brand */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-1.5 rounded-lg">
              <img
                src="/logo.png"
                alt="Wellcare Pharmacy Logo"
                className="h-7 max-w-[100px] object-contain"
              />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Wellcare Pharmacy
            </span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your trusted neighborhood pharmacy in Agra. We deliver genuine
            medicines and reliable healthcare services directly to your
            doorstep.
          </p>
          <div className="flex items-center space-x-1.5 text-xs text-gray-500">
            <Clock size={12} />
            <span>Open Daily: 8:00 AM - 10:00 PM</span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h3 className="text-base font-bold mb-4 text-white">Quick Links</h3>
          <nav className="flex flex-col space-y-2.5">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-gray-400 hover:text-[var(--color-brand-green)] transition-colors inline-block w-fit"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Col 3: Categories */}
        <div>
          <h3 className="text-base font-bold mb-4 text-white">Categories</h3>
          <nav className="flex flex-col space-y-2.5">
            {categoryLinks.map((cat) => (
              <a
                key={cat}
                href="#categories"
                className="text-sm text-gray-400 hover:text-[var(--color-brand-green)] transition-colors inline-block w-fit"
              >
                {cat}
              </a>
            ))}
          </nav>
        </div>

        {/* Col 4: Contact */}
        <div>
          <h3 className="text-base font-bold mb-4 text-white">Contact Us</h3>
          <div className="space-y-3">
            <a
              href="https://wa.me/919897397532"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start text-gray-400 hover:text-[var(--color-brand-green)] transition-colors group"
            >
              <Phone
                size={16}
                className="mr-2.5 mt-0.5 flex-shrink-0 group-hover:text-[var(--color-brand-green)]"
              />
              <span className="text-sm font-medium">+91 9897397532</span>
            </a>

            <a
              href="mailto:wellcarepharmacy.agra@gmail.com"
              className="flex items-start text-gray-400 hover:text-[var(--color-brand-green)] transition-colors"
            >
              <Mail size={16} className="mr-2.5 mt-0.5 flex-shrink-0" />
              <span className="text-sm">wellcarepharmacy.agra@gmail.com</span>
            </a>

            <div className="flex items-start text-gray-400">
              <MapPin size={16} className="mr-2.5 mt-1 flex-shrink-0" />
              <span className="text-sm leading-relaxed">
                Rohit Complex, Ayodhya Kunj-A,
                <br />
                Jodha Bai ka Rauza, Arjun Nagar,
                <br />
                Agra, UP 282001
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Strip */}
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-gray-700/50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span className="font-medium">We Accept:</span>
            <div className="flex items-center space-x-3 text-gray-400">
              <span className="bg-gray-700/50 px-2.5 py-1 rounded text-[10px] font-bold">
                UPI
              </span>
              <span className="bg-gray-700/50 px-2.5 py-1 rounded text-[10px] font-bold">
                VISA
              </span>
              <span className="bg-gray-700/50 px-2.5 py-1 rounded text-[10px] font-bold">
                MASTER
              </span>
              <span className="bg-gray-700/50 px-2.5 py-1 rounded text-[10px] font-bold">
                COD
              </span>
            </div>
          </div>
          <div className="text-center sm:text-right text-xs text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} Wellcare Pharmacy. All rights
              reserved.
            </p>
            <p className="mt-1 font-medium">Drug License No. UP/AG/2024/001234</p>
            <p className="mt-0.5">GSTIN: Pending Registration</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
