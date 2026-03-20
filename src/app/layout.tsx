import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Wellcare Pharmacy — Your Health, Delivered to Your Doorstep | Agra",
  description:
    "Order genuine medicines, consult top doctors, and book lab tests at home in Agra. Fast delivery, certified pharmacy, prescription upload. Wellcare Pharmacy, Arjun Nagar, Agra.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-white text-gray-900`}
      >
        <CartProvider>
          <AuthProvider>{children}</AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
