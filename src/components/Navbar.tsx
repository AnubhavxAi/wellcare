"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import CartDrawer from "./CartDrawer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { name: "Medicines", href: "#categories" },
  { name: "Lab Tests", href: "#lab-tests" },
  { name: "Wellness", href: "#" },
  { name: "Offers", href: "#" },
  { name: "Upload Rx", href: "#prescription-upload" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount, openCart } = useCart();
  const { user, logout, openLogin } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = () => setIsUserDropdownOpen(false);
    if (isUserDropdownOpen) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [isUserDropdownOpen]);

  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "U";
  };

  const handleLogout = async () => {
    setIsUserDropdownOpen(false);
    await logout();
  };

  return (
    <header
      className={`bg-white/95 backdrop-blur-md fixed w-full top-0 z-[30] h-16 transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex-shrink-0 flex items-center space-x-3 group transition-transform active:scale-95"
          >
            <img
              src="/logo.png"
              alt="Wellcare Pharmacy Logo"
              className="max-h-[44px] lg:max-h-[56px] w-auto object-contain drop-shadow-sm"
              onError={(e) => {
                // Fallback to text if logo.png is missing or broken
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <span className="font-headline font-extrabold text-2xl lg:text-3xl text-primary tracking-tighter drop-shadow-sm group-hover:text-primary-container transition-colors">
              WELLCARE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative text-gray-700 hover:text-gray-900 font-medium py-2 transition-colors text-sm"
                onMouseEnter={() => setHoveredLink(link.name)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {link.name}
                {hoveredLink === link.name && (
                  <motion.div
                    layoutId="navbar-underline"
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-[var(--color-brand-green)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsUserDropdownOpen(!isUserDropdownOpen);
                  }}
                  className="hidden sm:flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-bold text-sm"
                >
                  {getInitials()}
                </button>
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900">
                          {user?.name || "Welcome!"}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {user?.phone}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={openLogin}
                className="hidden sm:flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
              >
                <User size={18} strokeWidth={2.5} />
              </button>
            )}

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative flex items-center justify-center space-x-1.5 px-3 h-10 bg-[#Edfaf3] hover:bg-[#d5f5e3] text-teal-800 rounded-xl transition-colors font-bold"
            >
              <ShoppingCart size={18} strokeWidth={2.5} />
              <span className="text-sm">{cartCount}</span>
            </button>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu slide-in */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-16 right-0 h-[calc(100%-4rem)] w-72 bg-white z-[60] shadow-xl flex flex-col pt-6 px-6 lg:hidden"
            >
              <button
                className="absolute top-5 right-5 p-2 text-gray-700 hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={22} />
              </button>

              {/* User Status in mobile menu */}
              {user ? (
                <div className="mb-4 p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-[var(--color-brand-green)] text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {getInitials()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.phone}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await logout();
                    }}
                    className="flex items-center space-x-1.5 text-xs text-red-600 font-medium"
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openLogin();
                  }}
                  className="flex items-center space-x-2 px-4 py-3 mb-4 bg-green-50 text-[var(--color-brand-green)] font-semibold rounded-xl"
                >
                  <User size={20} />
                  <span>Login / Register</span>
                </button>
              )}

              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-base font-medium text-gray-800 hover:text-[var(--color-brand-green)] hover:bg-green-50 transition-colors px-4 py-3 rounded-xl"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer />
    </header>
  );
}
