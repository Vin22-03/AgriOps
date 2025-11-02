import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AgriVisionOps",
  description: "AI-powered predictive agriculture platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-amber-100">
      <body className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-100 via-green-100 to-amber-100 text-gray-900 bg-amber-100 animate-gradient-x">
        <Navbar />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
