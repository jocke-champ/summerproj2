'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HomeIcon, ClipboardListIcon, ShoppingCartIcon, MenuIcon, XIcon } from 'lucide-react';

export function Navigation() {
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