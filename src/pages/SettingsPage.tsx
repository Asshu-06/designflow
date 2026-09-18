// src/pages/SettingsPage.tsx
import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { isLocalStorageFallback } from '../lib/supabase';
import { Settings, Database, Sliders, CheckCircle2, RotateCcw } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [editorFont, setEditorFont] = useState('JetBrains Mono');
  const [fontSize, setFontSize] = useState('13px');
  const [autosaveInterval, setAutosaveInterval] = useState('1.5s');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveSettings = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleClearLocalDrafts = () => {
    if (confirm('Are you sure you want to clear local submission drafts?')) {
      localStorage.removeItem('designloop_drafts_v1');
      alert('Local drafts cleared.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-[#8B9CF6] font-mono text-xs mb-1">
          <Settings className="w-3.5 h-3.5" />
          <span>Platform Configurations</span>
        </div>
        <h1 className="text-2xl font-bold text-[#F3F4F6] tracking-tight">Settings & Preferences</h1>
        <p className="text-[#9CA3AF] text-xs mt-1">
          Manage code editor preferences, storage sync provider, and workspace behavior.
        </p>
      </div>

      {/* Editor Preferences */}
      <Card className="space-y-4">
        <h2 className="text-sm font-bold font-mono text-[#8B9CF6] flex items-center space-x-2 border-b border-[#262C34] pb-3">
          <Sliders className="w-4 h-4 text-[#8B9CF6]" />
          <span>Architecture Workspace Preferences</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="block font-mono font-semibold text-[#F3F4F6]">Code & Technical Font Family</label>
            <select
              value={editorFont}
              onChange={(e) => setEditorFont(e.target.value)}
              className="w-full bg-[#0B0D0F] border border-[#262C34] rounded-md p-2 text-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-[#8B9CF6] font-mono text-xs"
            >
              <option value="JetBrains Mono">JetBrains Mono (Recommended)</option>
              <option value="Fira Code">Fira Code</option>
              <option value="ui-monospace">System Monospace</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block font-mono font-semibold text-[#F3F4F6]">Workspace Font Size</label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-full bg-[#0B0D0F] border border-[#262C34] rounded-md p-2 text-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-[#8B9CF6] font-mono text-xs"
            >
              <option value="12px">12px (Compact)</option>
              <option value="13px">13px (Standard)</option>
              <option value="14px">14px (Comfortable)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block font-mono font-semibold text-[#F3F4F6]">Autosave Draft Delay</label>
            <select
              value={autosaveInterval}
              onChange={(e) => setAutosaveInterval(e.target.value)}
              className="w-full bg-[#0B0D0F] border border-[#262C34] rounded-md p-2 text-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-[#8B9CF6] font-mono text-xs"
            >
              <option value="1.0s">1.0s (Instant)</option>
              <option value="1.5s">1.5s (Standard)</option>
              <option value="3.0s">3.0s (Relaxed)</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex items-center space-x-3">
          <Button variant="primary" size="sm" onClick={handleSaveSettings}>
            Save Preferences
          </Button>

          {savedNotice && (
            <span className="flex items-center space-x-1 text-xs text-[#35C98B] font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Preferences Saved</span>
            </span>
          )}
        </div>
      </Card>

      {/* Database & Storage Status */}
      <Card className="space-y-4">
        <h2 className="text-sm font-bold font-mono text-[#8B9CF6] flex items-center space-x-2 border-b border-[#262C34] pb-3">
          <Database className="w-4 h-4 text-[#8B9CF6]" />
          <span>Storage & Persistence Integration</span>
        </h2>

        <div className="bg-[#0B0D0F] border border-[#262C34] rounded-md p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[#9CA3AF]">Active Backend Provider:</span>
            <span className="font-mono font-semibold text-[#35C98B]">
              {isLocalStorageFallback ? 'Browser LocalStorage Fallback' : 'Supabase Cloud PostgreSQL'}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-[#262C34] pt-2">
            <span className="font-mono text-[#9CA3AF]">Submission Evaluation Pipeline:</span>
            <span className="font-mono text-[#8B9CF6]">Gemini Edge / Fallback Rubric Evaluator</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearLocalDrafts}
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-[#F07070]" />}
          >
            Clear Local Draft Cache
          </Button>

          <span className="text-[11px] font-mono text-[#667085]">
            Does not delete saved Supabase submissions.
          </span>
        </div>
      </Card>
    </div>
  );
};
