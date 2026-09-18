// src/components/layout/Topbar.tsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Search, ChevronRight, CheckCircle2 } from 'lucide-react';
import { isLocalStorageFallback } from '../../lib/supabase';

interface TopbarProps {
  onOpenMobile: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobile }) => {
  const location = useLocation();

  // Generate dynamic breadcrumb items based on current path
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return [{ label: 'Overview', path: '/dashboard' }];
    if (path.startsWith('/problems')) {
      if (path === '/problems') return [{ label: 'Practice Problems', path: '/problems' }];
      const slug = path.split('/')[2];
      return [
        { label: 'Practice Problems', path: '/problems' },
        { label: slug ? slug.replace(/-/g, ' ') : 'Problem Detail', path },
      ];
    }
    if (path.startsWith('/practice')) {
      return [
        { label: 'Practice Problems', path: '/problems' },
        { label: 'Workspace', path },
      ];
    }
    if (path.startsWith('/attempts')) {
      return [
        { label: 'My Submissions', path: '/history' },
        { label: 'Design Review', path },
      ];
    }
    if (path === '/history') return [{ label: 'My Submissions', path: '/history' }];
    if (path === '/progress') return [{ label: 'Progress', path: '/progress' }];
    if (path === '/resources') return [{ label: 'Resources', path: '/resources' }];
    if (path === '/settings') return [{ label: 'Settings', path: '/settings' }];
    return [{ label: 'Workspace', path }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-13 bg-[#0B0D0F] border-b border-[#262C34] sticky top-0 z-20 px-4 flex items-center justify-between select-none">
      <div className="flex items-center space-x-3">
        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={onOpenMobile}
          className="md:hidden p-1 text-[#9CA3AF] hover:text-[#F3F4F6] rounded hover:bg-[#171B21]"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Path */}
        <nav className="flex items-center space-x-1.5 text-xs font-mono">
          <span className="text-[#667085]">Lab</span>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.path}>
              <ChevronRight className="w-3.5 h-3.5 text-[#667085]" />
              {idx === breadcrumbs.length - 1 ? (
                <span className="text-[#F3F4F6] font-medium capitalize">{crumb.label}</span>
              ) : (
                <Link to={crumb.path} className="text-[#9CA3AF] hover:text-[#F3F4F6] capitalize">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Quick Search & Status Indicators */}
      <div className="flex items-center space-x-3 text-xs">
        {/* Refined status badge (replacing prominent local storage wording) */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#111418] border border-[#262C34] text-[#9CA3AF] font-mono text-[11px]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#35C98B]" />
          <span>{isLocalStorageFallback ? 'Draft saved locally' : 'All changes saved'}</span>
        </div>

        {/* Quick Search trigger */}
        <Link
          to="/problems"
          className="flex items-center space-x-2 px-2.5 py-1 rounded bg-[#111418] border border-[#262C34] text-[#9CA3AF] hover:text-[#F3F4F6] hover:border-[#38404B] transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px] font-mono">Filter Problems</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-[#171B21] border border-[#262C34] rounded text-[#667085]">
            ⌘K
          </kbd>
        </Link>
      </div>
    </header>
  );
};
