"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import CartDrawer from "./CartDrawer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { name: "Shop", href: "/shop" },
  { name: "Lab Tests", href: "/lab-tests" },
  { name: "Privacy", href: "/privacy-policy" },
  { name: "Terms", href: "/terms-of-service" },
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
      className={isScrolled ? "glass-nav-scrolled" : "glass-nav"}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
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
              <span className={`font-headline font-extrabold text-2xl lg:text-3xl tracking-tighter transition-colors ${
                isScrolled ? "text-primary" : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
              }`}>
                Wellcare Pharmacy
              </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 xl:space-x-8 ml-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative font-bold py-2 transition-all text-sm tracking-wide ${
                  isScrolled ? "text-on-surface hover:text-primary" : "text-white hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                }`}
                onMouseEnter={() => setHoveredLink(link.name)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {link.name}
                {hoveredLink === link.name && (
                  <motion.div
                    layoutId="navbar-underline"
                    className="absolute left-0 right-0 -bottom-1 h-0.5 bg-[var(--color-primary-fixed)] shadow-[0_0_8px_rgba(157,248,152,0.5)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </Link>
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
                  className="hidden sm:flex items-center justify-center space-x-2 px-4 py-2 bg-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.22)] backdrop-blur-[10px] border border-[rgba(255,255,255,0.25)] text-white rounded-full transition-all duration-200 text-sm font-semibold"
                >
                  <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">
                    {getInitials()}
                  </span>
                  <span>Hi, {user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                      style={{
                        background: "rgba(11,107,29,0.85)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-3 py-3 border-b border-white/10 mb-2">
                        <p className="text-sm font-bold text-white">
                          {user?.name || "Welcome!"}
                        </p>
                        <p className="text-xs text-white/60 mt-0.5">
                          {user?.phone}
                        </p>
                      </div>
                      <Link
                        href="/account/orders"
                        className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded-xl transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>receipt_long</span>
                        <span>My Orders</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-[#ffb4ab] hover:bg-red-500/20 rounded-xl transition-colors mt-1"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: "50px",
                  padding: "8px 20px",
                  color: "white",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                className="hidden sm:flex hover:bg-white/20"
              >
                Login
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative flex items-center justify-center space-x-1.5 px-3 h-10 bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.25)] border border-[rgba(255,255,255,0.25)] text-white rounded-full transition-colors font-bold backdrop-blur-md"
            >
              <ShoppingCart size={18} strokeWidth={2.5} />
              <span className="absolute -top-1.5 -right-1.5 bg-[#9df898] text-[#003008] text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-md font-extrabold">{cartCount}</span>
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              style={{ color: isScrolled ? "var(--color-on-surface)" : "white" }}
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-16 right-0 h-[calc(100%-4rem)] w-72 bg-white z-[60] shadow-2xl flex flex-col pt-6 px-6 md:hidden"
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
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 px-4 py-3 mb-4 bg-gradient-to-r from-teal-800 to-emerald-700 text-white font-semibold rounded-xl"
                >
                  <User size={20} />
                  <span>Login / Register</span>
                </Link>
              )}

              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-base font-medium text-gray-800 hover:text-[var(--color-brand-green)] hover:bg-green-50 transition-colors px-4 py-3 rounded-xl"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
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
