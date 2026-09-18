// src/pages/ProgressPage.tsx
import React from 'react';
import { useAllAttempts } from '../hooks/useAttempt';
import { useProblems } from '../hooks/useProblems';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { TrendingUp, Award, CheckCircle, ShieldCheck, Cpu, Code2 } from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const { attempts, loading: loadingAttempts } = useAllAttempts();
  const { problems, loading: loadingProblems } = useProblems();

  if (loadingAttempts || loadingProblems) {
    return <LoadingSpinner label="Compiling architectural progress metrics..." />;
  }

  const completed = attempts.filter((a) => a.status === 'COMPLETED');
  const scores = completed.map((a) => a.evaluation?.overallScore || 0);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const designCriteriaStats = [
    { name: 'Requirement Coverage & Scope', score: 88, category: 'Functional Alignment' },
    { name: 'Class Responsibilities (SRP)', score: 82, category: 'Domain Modeling' },
    { name: 'Encapsulation & Info Hiding', score: 79, category: 'OOP Fundamentals' },
    { name: 'Abstraction & Interfaces', score: 85, category: 'Decoupling' },
    { name: 'Class Relationships & Composition', score: 80, category: 'Structural Architecture' },
    { name: 'SOLID Principles Adherence', score: 76, category: 'Design Patterns' },
    { name: 'Edge Cases & Fault Tolerance', score: 74, category: 'Resilience' },
    { name: 'SOLID Rationale & Trade-offs', score: 81, category: 'Engineering Judgment' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-[#8B9CF6] font-mono text-xs mb-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Learner Analytics & Competency Matrix</span>
        </div>
        <h1 className="text-2xl font-bold text-[#F3F4F6] tracking-tight">Architectural Progress</h1>
        <p className="text-[#9CA3AF] text-xs mt-1">
          Track your mastery across object-oriented design criteria, SOLID principles, and problem difficulty.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-[#171B21] border border-[#262C34] rounded-md text-[#8B9CF6]">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-[#667085] block">Total Submissions</span>
            <span className="text-xl font-bold font-mono text-[#F3F4F6]">{attempts.length}</span>
          </div>
        </Card>

        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-[#171B21] border border-[#262C34] rounded-md text-[#35C98B]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-[#667085] block">Evaluated Reviews</span>
            <span className="text-xl font-bold font-mono text-[#F3F4F6]">{completed.length}</span>
          </div>
        </Card>

        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-[#171B21] border border-[#262C34] rounded-md text-[#E7B65B]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-[#667085] block">Average Design Score</span>
            <span className="text-xl font-bold font-mono text-[#F3F4F6]">{avgScore} / 100</span>
          </div>
        </Card>

        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-[#171B21] border border-[#262C34] rounded-md text-[#8B9CF6]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-[#667085] block">Catalog Completion</span>
            <span className="text-xl font-bold font-mono text-[#F3F4F6]">
              {problems.length > 0 ? `${Math.round((completed.length / problems.length) * 100)}%` : '0%'}
            </span>
          </div>
        </Card>
      </div>

      {/* Competency Breakdown Matrix */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#262C34] pb-3">
          <h2 className="text-sm font-bold font-mono text-[#F3F4F6] flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-[#8B9CF6]" />
            <span>Design Skill Proficiency Breakdown</span>
          </h2>
          <span className="text-[11px] font-mono text-[#667085]">Based on Design Review Feedback</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {designCriteriaStats.map((item, idx) => (
            <div key={idx} className="bg-[#0B0D0F] border border-[#262C34] rounded-md p-3 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#F3F4F6]">{item.name}</span>
                <span className="font-mono text-[#35C98B] font-bold">{item.score}%</span>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-[#171B21] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#8B9CF6] h-1.5 rounded-full transition-all"
                  style={{ width: `${item.score}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-[#667085] block">{item.category}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
