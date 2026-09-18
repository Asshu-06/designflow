// src/components/practice/CodeEditorPanel.tsx
import React, { useState } from 'react';
import { Copy, RotateCcw, Check, Code2 } from 'lucide-react';
import { Button } from '../common/Button';

export type SupportedLanguage = 'java' | 'typescript' | 'python' | 'cpp' | 'go';

interface CodeEditorPanelProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  code: string;
  onCodeChange: (code: string) => void;
  onResetCode: () => void;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  language,
  onLanguageChange,
  code,
  onCodeChange,
  onResetCode,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = (code.match(/\n/g) || []).length + 1;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-[#111418] border border-[#262C34] rounded-lg overflow-hidden font-mono text-xs">
      {/* Editor Header Toolbar */}
      <div className="bg-[#171B21] border-b border-[#262C34] px-3 py-2 flex flex-wrap items-center justify-between gap-2 select-none">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-[#A3B0FF] font-semibold">
            <Code2 className="w-3.5 h-3.5" />
            <span>Code Implementation</span>
          </div>

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
            className="bg-[#0B0D0F] border border-[#262C34] rounded px-2 py-1 text-xs text-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-[#A3B0FF] cursor-pointer"
          >
            <option value="java">Java 17</option>
            <option value="typescript">TypeScript 5</option>
            <option value="python">Python 3.11</option>
            <option value="cpp">C++ 20</option>
            <option value="go">Go 1.22</option>
          </select>
        </div>

        {/* Action Tools */}
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-[#35C98B]" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetCode}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Code Area with Line Numbers */}
      <div className="flex-1 flex bg-[#0B0D0F] overflow-auto min-h-[300px]">
        {/* Line Numbers Column */}
        <div className="bg-[#111418] text-[#667085] px-3 py-3 text-right select-none font-mono text-[11px] border-r border-[#262C34] min-w-[40px]">
          {lineNumbers.map((n) => (
            <div key={n} className="leading-6">
              {n}
            </div>
          ))}
        </div>

        {/* Textarea Code Input */}
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          spellCheck={false}
          className="flex-1 bg-[#0B0D0F] text-[#F3F4F6] p-3 font-mono text-xs leading-6 resize-none focus:outline-none whitespace-pre font-normal"
          placeholder="// Write your low-level design implementation code here..."
        />
      </div>

      {/* Editor Footer Bar */}
      <div className="bg-[#171B21] border-t border-[#262C34] px-3 py-1.5 flex items-center justify-between text-[11px] text-[#667085] select-none">
        <span>Language: {language.toUpperCase()}</span>
        <span>{code.length} characters &bull; {lineCount} lines</span>
      </div>
    </div>
  );
};
