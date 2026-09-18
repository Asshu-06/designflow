// src/components/practice/BottomPanel.tsx
import React, { useState } from 'react';
import { Play, ShieldCheck, Send, CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';
import { Button } from '../common/Button';
import type { Evaluation } from '../../types/domain';
import { RubricCard } from '../feedback/RubricCard';
import { ScoreSummary } from '../feedback/ScoreSummary';

export type BottomTab = 'testcases' | 'output' | 'review';

interface TestCase {
  id: number;
  name: string;
  input: string;
  expectedOutput: string;
  passed?: boolean;
  actualOutput?: string;
}

interface BottomPanelProps {
  activeTab: BottomTab;
  onTabChange: (tab: BottomTab) => void;
  testCases: TestCase[];
  outputLog: string | null;
  isRunning: boolean;
  isEvaluating: boolean;
  isSubmitting: boolean;
  evaluationResult: Evaluation | null;
  onRunTests: () => void;
  onEvaluate: () => void;
  onSubmit: () => void;
}

export const BottomPanel: React.FC<BottomPanelProps> = ({
  activeTab,
  onTabChange,
  testCases,
  outputLog,
  isRunning,
  isEvaluating,
  isSubmitting,
  evaluationResult,
  onRunTests,
  onEvaluate,
  onSubmit,
}) => {
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState(0);

  const selectedCase = testCases[selectedTestCaseIdx] || testCases[0];

  return (
    <div className="flex flex-col h-full bg-[#111418] border border-[#262C34] rounded-lg overflow-hidden font-mono text-xs">
      {/* Bottom Panel Navigation Header */}
      <div className="bg-[#171B21] border-b border-[#262C34] px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 select-none">
        {/* Tabs */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onTabChange('testcases')}
            className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors flex items-center space-x-1.5 ${
              activeTab === 'testcases'
                ? 'bg-[#0B0D0F] text-[#F3F4F6] border border-[#262C34]'
                : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Test Cases ({testCases.length})</span>
          </button>

          <button
            onClick={() => onTabChange('output')}
            className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors flex items-center space-x-1.5 ${
              activeTab === 'output'
                ? 'bg-[#0B0D0F] text-[#F3F4F6] border border-[#262C34]'
                : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Output Log</span>
            {outputLog && <span className="w-2 h-2 rounded-full bg-[#35C98B]"></span>}
          </button>

          <button
            onClick={() => onTabChange('review')}
            className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors flex items-center space-x-1.5 ${
              activeTab === 'review'
                ? 'bg-[#0B0D0F] text-[#A3B0FF] border border-[#A3B0FF]/40 font-bold'
                : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#A3B0FF]" />
            <span>Design Review</span>
            {evaluationResult && (
              <span className="text-[10px] bg-[#35C98B]/20 text-[#35C98B] px-1.5 py-0.2 rounded border border-[#35C98B]/30">
                {evaluationResult.overallScore}/100
              </span>
            )}
          </button>
        </div>

        {/* Action Buttons: Run, Evaluate, Submit */}
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onRunTests}
            isLoading={isRunning}
            leftIcon={<Play className="w-3.5 h-3.5 text-[#35C98B]" />}
          >
            Run Tests
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onEvaluate}
            isLoading={isEvaluating}
            leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-[#A3B0FF]" />}
          >
            Evaluate Design
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onSubmit}
            isLoading={isSubmitting}
            leftIcon={<Send className="w-3.5 h-3.5" />}
          >
            Submit Solution
          </Button>
        </div>
      </div>

      {/* Panel Tab Content Area */}
      <div className="flex-1 bg-[#0B0D0F] p-4 overflow-auto min-h-[180px]">
        {/* TAB 1: TEST CASES */}
        {activeTab === 'testcases' && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 border-b border-[#262C34] pb-2">
              {testCases.map((tc, idx) => (
                <button
                  key={tc.id}
                  onClick={() => setSelectedTestCaseIdx(idx)}
                  className={`px-3 py-1 rounded text-xs font-mono cursor-pointer flex items-center space-x-1.5 ${
                    selectedTestCaseIdx === idx
                      ? 'bg-[#171B21] text-[#F3F4F6] border border-[#A3B0FF]'
                      : 'bg-[#111418] text-[#9CA3AF] border border-[#262C34]'
                  }`}
                >
                  {tc.passed === true && <CheckCircle2 className="w-3 h-3 text-[#35C98B]" />}
                  {tc.passed === false && <XCircle className="w-3 h-3 text-[#F07070]" />}
                  <span>Case {idx + 1}</span>
                </button>
              ))}
            </div>

            {selectedCase && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-[#F3F4F6]">{selectedCase.name}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-[#667085] text-[11px] block">Test Case Input:</span>
                    <pre className="bg-[#111418] border border-[#262C34] p-2.5 rounded text-[#F3F4F6] whitespace-pre-wrap leading-relaxed">
                      {selectedCase.input}
                    </pre>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[#667085] text-[11px] block">Expected Return Value:</span>
                    <pre className="bg-[#111418] border border-[#262C34] p-2.5 rounded text-[#35C98B] whitespace-pre-wrap leading-relaxed">
                      {selectedCase.expectedOutput}
                    </pre>
                  </div>
                </div>

                {selectedCase.actualOutput && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[#667085] text-[11px] block">Actual Output:</span>
                    <pre
                      className={`border p-2.5 rounded whitespace-pre-wrap leading-relaxed ${
                        selectedCase.passed
                          ? 'bg-[#35C98B]/10 border-[#35C98B]/30 text-[#35C98B]'
                          : 'bg-[#F07070]/10 border-[#F07070]/30 text-[#F07070]'
                      }`}
                    >
                      {selectedCase.actualOutput}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: OUTPUT LOG */}
        {activeTab === 'output' && (
          <div className="space-y-3 font-mono text-xs">
            {outputLog ? (
              <pre className="bg-[#111418] border border-[#262C34] p-3 rounded text-[#F3F4F6] whitespace-pre-wrap leading-relaxed">
                {outputLog}
              </pre>
            ) : (
              <div className="text-[#667085] italic text-center py-6">
                No execution logs yet. Click "Run Tests" to execute test cases against your code.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DESIGN REVIEW */}
        {activeTab === 'review' && (
          <div className="space-y-4 font-sans text-xs">
            {evaluationResult ? (
              <>
                <ScoreSummary
                  evaluation={evaluationResult}
                  attemptNumber={1}
                  problemTitle="Design Evaluation Report"
                />

                <div className="space-y-3">
                  <h3 className="font-bold text-[#F3F4F6] text-sm font-mono">
                    Criterion-Based Architectural Breakdown
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {evaluationResult.feedbackItems?.map((item) => (
                      <RubricCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-[#111418] border border-[#262C34] p-8 text-center rounded-lg space-y-3">
                <ShieldCheck className="w-8 h-8 text-[#A3B0FF] mx-auto opacity-80" />
                <h3 className="text-sm font-bold text-[#F3F4F6]">No Design Review Triggered Yet</h3>
                <p className="text-xs text-[#9CA3AF] max-w-md mx-auto">
                  Click "Evaluate Design" or "Submit Solution" to run AI rubric evaluation across Class Responsibilities, SRP, Encapsulation, SOLID principles, Extensibility, and Edge Cases.
                </p>
                <Button size="sm" variant="primary" onClick={onEvaluate} isLoading={isEvaluating}>
                  Evaluate Current Design
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
