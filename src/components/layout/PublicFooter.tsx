// src/components/layout/PublicFooter.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-[#0B0D0F] border-t border-[#262C34] py-12 select-none text-xs text-[#9CA3AF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-[#171B21] border border-[#262C34] rounded-md text-[#A3B0FF]">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-mono font-bold text-sm text-[#F3F4F6] tracking-tight">
                &gt;_ LLD LAB
              </span>
            </div>
            <p className="text-[#9CA3AF] max-w-sm leading-relaxed text-xs">
              Low-Level Design and Object-Oriented System Practice Platform for software engineers and technical interview preparation.
            </p>
          </div>

          {/* Nav Column 1 */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-semibold text-[#F3F4F6] uppercase">Platform</h4>
            <ul className="space-y-1.5 font-mono text-[11px]">
              <li>
                <Link to="/dashboard" className="hover:text-[#F3F4F6]">
                  Practice Lab
                </Link>
              </li>
              <li>
                <Link to="/problems" className="hover:text-[#F3F4F6]">
                  Problem Library
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#F3F4F6]">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/resources" className="hover:text-[#F3F4F6]">
                  Design Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Column 2 */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-semibold text-[#F3F4F6] uppercase">Developer Links</h4>
            <ul className="space-y-1.5 font-mono text-[11px]">
              <li>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#F3F4F6]">
                  GitHub Repository
                </a>
              </li>
              <li>
                <Link to="/resources" className="hover:text-[#F3F4F6]">
                  SOLID Architecture Guide
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-[#F3F4F6]">
                  System Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#262C34] flex flex-col sm:flex-row items-center justify-between font-mono text-[11px] text-[#667085]">
          <p>&copy; 2026 LLD LAB &bull; Built for deliberate software design practice.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <span>Geist / Inter UI</span>
            <span>&bull;</span>
            <span>JetBrains Mono Code</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
