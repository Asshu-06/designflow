// src/components/layout/PublicNavbar.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ArrowRight, Menu, X } from 'lucide-react';
import { Button } from '../common/Button';

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0B0D0F]/95 backdrop-blur-md border-b border-[#262C34] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-[#171B21] border border-[#262C34] rounded-md text-[#A3B0FF]">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-sm text-[#F3F4F6] tracking-tight">
                LLD LAB
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#171B21] text-[#9CA3AF] border border-[#262C34]">
                v1.0
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-medium">
            <Link to="/problems" className="text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors">
              Practice
            </Link>
            <a href="#how-it-works" className="text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors">
              How It Works
            </a>
            <Link to="/problems" className="text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors">
              Problem Library
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/dashboard" className="text-xs font-medium text-[#9CA3AF] hover:text-[#F3F4F6] px-3 py-1.5 transition-colors">
              Sign In
            </Link>
            <Link to="/problems">
              <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-[#9CA3AF] hover:text-[#F3F4F6] rounded-md hover:bg-[#171B21]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111418] border-b border-[#262C34] px-4 py-4 space-y-3">
          <Link
            to="/problems"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-medium text-[#9CA3AF] hover:text-[#F3F4F6]"
          >
            Practice
          </Link>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-medium text-[#9CA3AF] hover:text-[#F3F4F6]"
          >
            How It Works
          </a>
          <Link
            to="/problems"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-medium text-[#9CA3AF] hover:text-[#F3F4F6]"
          >
            Problem Library
          </Link>
          <div className="pt-2 border-t border-[#262C34] flex flex-col space-y-2">
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <span className="block text-center text-xs font-medium text-[#9CA3AF] py-1.5">Sign In</span>
            </Link>
            <Link to="/problems" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" variant="primary" className="w-full">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
