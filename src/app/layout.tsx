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
  metadataBase: new URL("https://wellcare-pharmacy-76524.vercel.app"),
  title: {
    default: "Wellcare Pharmacy Agra — Medicine Delivery in 2 Hours",
    template: "%s | Wellcare Pharmacy Agra",
  },
  description:
    "Order genuine medicines online and get them delivered to your doorstep in Agra within 2 hours. Prescription medicines, health devices, vitamins and more.",
  keywords: [
    "pharmacy agra",
    "medicine delivery agra",
    "online pharmacy agra",
    "wellcare pharmacy",
    "medicine home delivery agra",
    "buy medicines online agra",
    "medical store agra",
  ],
  authors: [{ name: "Wellcare Pharmacy" }],
  creator: "Wellcare Pharmacy",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://wellcare-pharmacy-76524.vercel.app",
    siteName: "Wellcare Pharmacy Agra",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
