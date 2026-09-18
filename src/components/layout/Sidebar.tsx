// src/components/layout/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  History,
  TrendingUp,
  FileCode2,
  Settings,
  Terminal,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/problems', label: 'Practice Problems', icon: BookOpen },
    { path: '/history', label: 'My Submissions', icon: History },
    { path: '/progress', label: 'Progress', icon: TrendingUp },
    { path: '/resources', label: 'Resources', icon: FileCode2 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#0B0D0F] border-r border-[#262C34] w-[230px] flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-13 px-4 flex items-center justify-between border-b border-[#262C34]">
        <NavLink to="/dashboard" onClick={onCloseMobile} className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-[#171B21] border border-[#262C34] rounded text-[#A3B0FF]">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono font-bold text-sm text-[#F3F4F6] tracking-tight block">
              &gt;_ LLD LAB
            </span>
            <span className="text-[10px] font-mono text-[#667085] leading-none block">
              v1.0.0 &bull; Engineering
            </span>
          </div>
        </NavLink>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1 text-[#9CA3AF] hover:text-[#F3F4F6]"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        <div className="px-2 pb-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#667085]">
          Workspace
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center space-x-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#171B21] text-[#F3F4F6] border-l-2 border-[#A3B0FF] pl-2.5 shadow-xs'
                    : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#111418]'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Environment / System Status Footer */}
      <div className="p-3 border-t border-[#262C34] bg-[#111418]/40">
        <div className="flex items-center space-x-2 text-[11px] font-mono text-[#9CA3AF]">
          <span className="w-2 h-2 rounded-full bg-[#35C98B] animate-pulse"></span>
          <span>System Online</span>
        </div>
        <div className="mt-1 text-[10px] font-mono text-[#667085]">
          Object Architecture Engine
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block h-screen sticky top-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-[#0B0D0F]/80 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-10">{content}</div>
        </div>
      )}
    </>
  );
};
