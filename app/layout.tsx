'use client';

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Link from 'next/link';
import { HomeIcon, ClipboardListIcon, ShoppingCartIcon, MenuIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Gräsön",
  description: "Family project management and shopping lists",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <HomeIcon className="w-6 h-6" />
              Gräsön
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              <Link 
                href="/projects" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                <ClipboardListIcon className="w-4 h-4" />
                Projekt
              </Link>
              <Link 
                href="/shopping" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                <ShoppingCartIcon className="w-4 h-4" />
                Inköpslistor
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <XIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/projects" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ClipboardListIcon className="w-5 h-5" />
                Projekt
              </Link>
              <Link 
                href="/shopping" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCartIcon className="w-5 h-5" />
                Inköpslistor
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased bg-gray-50`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            <div className="min-h-screen">
              <Navigation />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
            </div>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
