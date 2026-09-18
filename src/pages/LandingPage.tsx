// src/pages/LandingPage.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { DifficultyBadge, StatusBadge } from '../components/common/Badge';
import { DataTable, type Column } from '../components/common/DataTable';
import { useProblems } from '../hooks/useProblems';
import { useAllAttempts } from '../hooks/useAttempt';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import type { Attempt, Problem } from '../types/domain';
import {
  Terminal,
  ArrowRight,
  BookOpen,
  Clock,
  Code2,
  Play,
  TrendingUp,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { problems, loading: loadingProblems } = useProblems();
  const { attempts, loading: loadingAttempts } = useAllAttempts();

  if (loadingProblems || loadingAttempts) {
    return <LoadingSpinner label="Loading developer overview..." />;
  }

  const completedAttempts = attempts.filter((a) => a.status === 'COMPLETED');
  const draftAttempts = attempts.filter((a) => a.status === 'DRAFT');

  // Find active draft or next recommended problem
  const activeDraftAttempt = draftAttempts[0];
  let recommendedProblem: Problem | undefined;
  if (activeDraftAttempt) {
    recommendedProblem = problems.find((p) => p.id === activeDraftAttempt.problemId);
  } else {
    recommendedProblem = problems[0];
  }

  // Calculate scores
  const scores = completedAttempts.map((a) => a.evaluation?.overallScore || 0);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  // Build grid of past 14 days activity ticks
  const generateActivityDays = () => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const hasSubmission = attempts.some(
        (a) => new Date(a.createdAt).toDateString() === date.toDateString()
      );
      days.push({
        date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        hasSubmission,
      });
    }
    return days;
  };

  const activityDays = generateActivityDays();

  // Table Columns definition for Recent Submissions
  const recentColumns: Column<Attempt>[] = [
    {
      key: 'attemptNumber',
      header: 'ID',
      render: (row) => <span className="font-mono text-[11px] text-[#8B9CF6]">#{row.attemptNumber}</span>,
      className: 'w-16',
    },
    {
      key: 'problem',
      header: 'Problem',
      render: (row) => {
        const prob = problems.find((p) => p.id === row.problemId);
        return (
          <div>
            <span className="font-semibold text-[#F3F4F6] block">{prob?.title || 'LLD Problem'}</span>
            <span className="text-[10px] font-mono text-[#667085]">{prob?.slug}</span>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
      className: 'w-28',
    },
    {
      key: 'score',
      header: 'Score',
      render: (row) =>
        row.evaluation ? (
          <span className="font-mono font-bold text-[#35C98B]">{row.evaluation.overallScore} / 100</span>
        ) : (
          <span className="font-mono text-[#667085]">—</span>
        ),
      className: 'w-24',
    },
    {
      key: 'date',
      header: 'Submitted',
      render: (row) => (
        <span className="font-mono text-[#9CA3AF] text-[11px]">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
      className: 'w-32',
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => {
        if (row.status === 'COMPLETED') {
          return (
            <Link to={`/attempts/${row.id}`}>
              <Button size="sm" variant="outline">
                View Review
              </Button>
            </Link>
          );
        }
        const prob = problems.find((p) => p.id === row.problemId);
        return (
          <Link to={`/practice/${prob?.slug || 'parking-lot'}?attemptId=${row.id}`}>
            <Button size="sm" variant="secondary">
              Resume
            </Button>
          </Link>
        );
      },
      className: 'w-28 text-right',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#262C34] pb-5">
        <div>
          <div className="flex items-center space-x-2 text-[#8B9CF6] font-mono text-xs mb-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>Developer Overview Lab</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F3F4F6] tracking-tight">System Design Practice</h1>
          <p className="text-[#9CA3AF] text-xs mt-1">
            Iterative object-oriented architectural feedback based on SOLID principles and design patterns.
          </p>
        </div>

        <Link to="/problems">
          <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Browse Problem Library
          </Button>
        </Link>
      </div>

      {/* Continue Practice & Metrics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Continue Practice Banner (2 Cols) */}
        <Card className="lg:col-span-2 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-[#8B9CF6] font-semibold flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{activeDraftAttempt ? 'Resume Active Draft' : 'Recommended Next Challenge'}</span>
              </span>
              {recommendedProblem && <DifficultyBadge difficulty={recommendedProblem.difficulty} />}
            </div>

            <h2 className="text-lg font-bold text-[#F3F4F6]">
              {recommendedProblem?.title || 'Design a Multi-Level Parking Lot'}
            </h2>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              {recommendedProblem?.shortDescription}
            </p>

            <div className="pt-2 flex flex-wrap gap-1.5 font-mono text-[11px]">
              {recommendedProblem?.expectedDesignAreas.slice(0, 3).map((area, idx) => (
                <span key={idx} className="bg-[#171B21] text-[#9CA3AF] px-2 py-0.5 rounded border border-[#262C34]">
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#262C34] flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#667085]">
              {activeDraftAttempt ? `Attempt #${activeDraftAttempt.attemptNumber} in progress` : 'Not started yet'}
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (recommendedProblem) {
                  const query = activeDraftAttempt ? `?attemptId=${activeDraftAttempt.id}` : '';
                  navigate(`/practice/${recommendedProblem.slug}${query}`);
                }
              }}
              leftIcon={<Play className="w-3.5 h-3.5" />}
            >
              {activeDraftAttempt ? 'Resume Design Draft' : 'Start Practice Attempt'}
            </Button>
          </div>
        </Card>

        {/* Compact Progress Summary (1 Col) */}
        <Card className="flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-mono font-bold text-[#8B9CF6] uppercase mb-3 flex items-center space-x-1.5 border-b border-[#262C34] pb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Practice Metrics</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center bg-[#0B0D0F] p-2.5 rounded border border-[#262C34]">
                <span className="text-[#9CA3AF]">Problems Solved</span>
                <span className="font-bold text-[#F3F4F6]">{completedAttempts.length} / {problems.length}</span>
              </div>

              <div className="flex justify-between items-center bg-[#0B0D0F] p-2.5 rounded border border-[#262C34]">
                <span className="text-[#9CA3AF]">Avg Design Score</span>
                <span className="font-bold text-[#35C98B]">{avgScore} / 100</span>
              </div>

              <div className="flex justify-between items-center bg-[#0B0D0F] p-2.5 rounded border border-[#262C34]">
                <span className="text-[#9CA3AF]">Active Drafts</span>
                <span className="font-bold text-[#E7B65B]">{draftAttempts.length}</span>
              </div>
            </div>
          </div>

          {/* 14-Day Activity Heatmap Ticks */}
          <div className="pt-2 border-t border-[#262C34]">
            <span className="text-[10px] font-mono text-[#667085] block mb-1.5">
              14-Day Activity Log
            </span>
            <div className="grid grid-cols-7 gap-1">
              {activityDays.map((day, idx) => (
                <div
                  key={idx}
                  title={`${day.date}: ${day.hasSubmission ? 'Submission logged' : 'No activity'}`}
                  className={`h-4 rounded-[2px] transition-colors ${
                    day.hasSubmission ? 'bg-[#35C98B]' : 'bg-[#171B21] border border-[#262C34]'
                  }`}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Featured Problems Quick List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold font-mono text-[#F3F4F6] flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-[#8B9CF6]" />
            <span>Curated LLD Challenges</span>
          </h2>
          <Link to="/problems" className="text-xs text-[#8B9CF6] hover:underline font-mono flex items-center space-x-1">
            <span>View All ({problems.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {problems.slice(0, 2).map((prob) => (
            <Card key={prob.id} hoverEffect className="flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <DifficultyBadge difficulty={prob.difficulty} />
                  <span className="text-[11px] font-mono text-[#667085]">
                    {prob.functionalRequirements.length} Requirements
                  </span>
                </div>
                <h3 className="font-bold text-[#F3F4F6] text-sm">{prob.title}</h3>
                <p className="text-xs text-[#9CA3AF] line-clamp-2 leading-relaxed">{prob.shortDescription}</p>
              </div>

              <div className="pt-3 border-t border-[#262C34] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#667085]">Structured Design Format</span>
                <Link to={`/problems/${prob.slug}`}>
                  <Button size="sm" variant="secondary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View Requirements
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Submissions Data Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold font-mono text-[#F3F4F6] flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-[#8B9CF6]" />
            <span>Recent Submission History</span>
          </h2>
          <Link to="/history" className="text-xs text-[#8B9CF6] hover:underline font-mono">
            View All Submissions ({attempts.length})
          </Link>
        </div>

        <DataTable
          columns={recentColumns}
          data={attempts.slice(0, 5)}
          keyExtractor={(row) => row.id}
          emptyState="No previous submissions logged yet."
        />
      </div>
    </div>
  );
};
