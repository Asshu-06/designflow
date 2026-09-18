// src/pages/ProblemLibraryPage.tsx
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProblems } from '../hooks/useProblems';
import { useAllAttempts } from '../hooks/useAttempt';
import { DifficultyBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import type { Problem, DifficultyLevel, ProblemCategory } from '../types/domain';
import { Search, Shuffle, Layers, CheckCircle2, Clock } from 'lucide-react';

const CATEGORIES: ProblemCategory[] = [
  'OOP Fundamentals',
  'Class Relationships',
  'SOLID Principles',
  'Creational Patterns',
  'Structural Patterns',
  'Behavioral Patterns',
  'System Design Basics',
];

const TOPICS = [
  'All',
  'Encapsulation',
  'Polymorphism',
  'Inheritance',
  'SOLID',
  'State',
  'Strategy',
  'Singleton',
  'Factory',
  'Observer',
  'Command',
  'Adapter',
  'Decorator',
  'Composite',
  'Facade',
];

export const ProblemLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const { problems, loading, error } = useProblems();
  const { attempts } = useAllAttempts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'All'>('All');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Solved' | 'Attempted' | 'Unattempted'>('All');
  const [hideGroups, setHideGroups] = useState(false);

  // Helper to read saved draft synchronously
  const getDraftSync = (problemId: string) => {
    try {
      const raw = localStorage.getItem('designloop_drafts_v1');
      if (!raw) return null;
      const drafts = JSON.parse(raw);
      return drafts[problemId] || null;
    } catch {
      return null;
    }
  };

  // Derive status per problem ID
  const problemStatusMap = useMemo(() => {
    const map: Record<string, 'COMPLETED' | 'DRAFT' | 'UNATTEMPTED'> = {};
    problems.forEach((p) => {
      const pAttempts = attempts.filter((a) => a.problemId === p.id);
      const hasCompleted = pAttempts.some((a) => a.status === 'COMPLETED' || a.evaluation?.status === 'COMPLETED');
      const hasSubmittedOrEvaluating = pAttempts.some((a) => a.status === 'SUBMITTED' || a.status === 'EVALUATING' || a.submission || a.evaluation);
      const draft = getDraftSync(p.id);
      const hasSavedDraftCode = Boolean(draft && draft.coreClasses && draft.coreClasses.trim().length > 0);

      if (hasCompleted) {
        map[p.id] = 'COMPLETED';
      } else if (hasSubmittedOrEvaluating || hasSavedDraftCode) {
        map[p.id] = 'DRAFT';
      } else {
        map[p.id] = 'UNATTEMPTED';
      }
    });
    return map;
  }, [problems, attempts]);

  // Overall stats
  const solvedCount = useMemo(() => {
    return Object.values(problemStatusMap).filter((s) => s === 'COMPLETED').length;
  }, [problemStatusMap]);

  const attemptedCount = useMemo(() => {
    return Object.values(problemStatusMap).filter((s) => s === 'DRAFT' || s === 'COMPLETED').length;
  }, [problemStatusMap]);

  // Filter problems
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.slug && p.slug.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.topics && p.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;

      const matchesTopic =
        selectedTopic === 'All' ||
        (p.topics && p.topics.some((t) => t.toLowerCase() === selectedTopic.toLowerCase())) ||
        (p.expectedDesignAreas && p.expectedDesignAreas.some((a) => a.toLowerCase().includes(selectedTopic.toLowerCase())));

      const st = problemStatusMap[p.id];
      const matchesStatus =
        selectedStatus === 'All' ||
        (selectedStatus === 'Solved' && st === 'COMPLETED') ||
        (selectedStatus === 'Attempted' && (st === 'DRAFT' || st === 'COMPLETED')) ||
        (selectedStatus === 'Unattempted' && st === 'UNATTEMPTED');

      return matchesSearch && matchesDifficulty && matchesTopic && matchesStatus;
    });
  }, [problems, searchQuery, selectedDifficulty, selectedTopic, selectedStatus, problemStatusMap]);

  // Handle Random Problem CTA
  const handleRandomProblem = () => {
    if (filteredProblems.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredProblems.length);
    const randomProb = filteredProblems[randomIndex];
    navigate(`/practice/${randomProb.slug}`);
  };

  const renderProblemTable = (items: Problem[], startIndexOffset = 0) => (
    <div className="bg-[#111418] border border-[#262C34] rounded-lg overflow-hidden">
      <table className="w-full text-left font-mono text-xs text-[#9CA3AF] border-collapse">
        <thead>
          <tr className="bg-[#171B21] border-b border-[#262C34] text-[#667085] uppercase text-[10px] tracking-wider select-none">
            <th className="py-2.5 px-4 w-12 text-center">#</th>
            <th className="py-2.5 px-4">Problem</th>
            <th className="py-2.5 px-4 hidden md:table-cell">Topics</th>
            <th className="py-2.5 px-4 w-28">Difficulty</th>
            <th className="py-2.5 px-4 w-28 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#262C34]">
          {items.map((p, idx) => {
            const st = problemStatusMap[p.id];
            return (
              <tr key={p.id} className="hover:bg-[#171B21]/60 transition-colors group">
                <td className="py-3 px-4 text-center text-[#667085] font-semibold">
                  {startIndexOffset + idx + 1}
                </td>
                <td className="py-3 px-4">
                  <Link
                    to={`/practice/${p.slug}`}
                    className="font-bold text-[#F3F4F6] hover:text-[#A3B0FF] transition-colors block text-sm font-sans"
                  >
                    {p.title}
                  </Link>
                  <span className="text-[11px] text-[#667085] font-mono block mt-0.5 line-clamp-1 font-sans">
                    {p.shortDescription}
                  </span>
                </td>
                <td className="py-3 px-4 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                    {(p.topics || p.expectedDesignAreas.slice(0, 2)).map((topic, tIdx) => (
                      <span key={tIdx} className="bg-[#171B21] text-[#9CA3AF] px-1.5 py-0.5 rounded border border-[#262C34]">
                        {topic}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <DifficultyBadge difficulty={p.difficulty} />
                </td>
                <td className="py-3 px-4 text-right font-mono text-[11px]">
                  {st === 'COMPLETED' ? (
                    <span className="inline-flex items-center space-x-1 text-[#35C98B]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Solved</span>
                    </span>
                  ) : st === 'DRAFT' ? (
                    <span className="inline-flex items-center space-x-1 text-[#E7B65B]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Attempted</span>
                    </span>
                  ) : (
                    <span className="text-[#667085]">Unattempted</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6 py-4 max-w-7xl mx-auto">
      {/* Header & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#262C34] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F3F4F6] tracking-tight">Low-Level Design Practice</h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            Practice object-oriented design through focused problems, structured implementations, and actionable design reviews.
          </p>
        </div>

        {/* Small Summary Badge */}
        <div className="flex items-center space-x-3 bg-[#111418] border border-[#262C34] px-3.5 py-1.5 rounded-md font-mono text-xs text-[#9CA3AF]">
          <span className="text-[#F3F4F6] font-bold">{problems.length} problems</span>
          <span className="text-[#262C34]">&bull;</span>
          <span className="text-[#35C98B] font-semibold">{solvedCount} solved</span>
          <span className="text-[#262C34]">&bull;</span>
          <span className="text-[#E7B65B] font-semibold">{attemptedCount} attempted</span>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-[#111418] border border-[#262C34] p-3 rounded-lg space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-[#667085] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search problems and topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0D0F] border border-[#262C34] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#F3F4F6] placeholder-[#667085] focus:outline-none focus:ring-1 focus:ring-[#A3B0FF] font-mono"
            />
          </div>

          {/* Action CTAs: Hide Groups & Random Problem */}
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end font-mono text-xs">
            <button
              onClick={() => setHideGroups(!hideGroups)}
              className={`px-3 py-1.5 rounded border text-xs font-semibold cursor-pointer transition-colors flex items-center space-x-1.5 ${
                hideGroups
                  ? 'bg-[#A3B0FF] text-[#0B0D0F] border-[#A3B0FF]'
                  : 'bg-[#0B0D0F] text-[#9CA3AF] border-[#262C34] hover:text-[#F3F4F6]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{hideGroups ? 'Show Groups' : 'Hide Groups'}</span>
            </button>

            <Button
              size="sm"
              variant="secondary"
              onClick={handleRandomProblem}
              leftIcon={<Shuffle className="w-3.5 h-3.5" />}
            >
              Random Problem
            </Button>
          </div>
        </div>

        {/* Filter Dropdowns / Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#262C34] font-mono text-xs text-[#9CA3AF]">
          {/* Difficulty Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[#667085] text-[11px]">Difficulty:</span>
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors ${
                  selectedDifficulty === diff
                    ? 'bg-[#171B21] text-[#F3F4F6] font-bold border border-[#A3B0FF]'
                    : 'bg-[#0B0D0F] text-[#9CA3AF] hover:text-[#F3F4F6] border border-[#262C34]'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          <span className="text-[#262C34] hidden sm:inline">&bull;</span>

          {/* Topic Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[#667085] text-[11px]">Topic:</span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-[#0B0D0F] border border-[#262C34] rounded px-2 py-0.5 text-[11px] text-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-[#A3B0FF]"
            >
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <span className="text-[#262C34] hidden sm:inline">&bull;</span>

          {/* Status Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[#667085] text-[11px]">Status:</span>
            {(['All', 'Solved', 'Attempted', 'Unattempted'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors ${
                  selectedStatus === st
                    ? 'bg-[#171B21] text-[#F3F4F6] font-bold border border-[#A3B0FF]'
                    : 'bg-[#0B0D0F] text-[#9CA3AF] hover:text-[#F3F4F6] border border-[#262C34]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Problem Catalog Content */}
      {loading ? (
        <LoadingSpinner label="Fetching problem library catalog..." />
      ) : error ? (
        <div className="bg-[#F07070]/10 border border-[#F07070]/30 p-4 rounded-lg text-[#F07070] text-xs font-mono text-center">
          {error}
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="bg-[#111418] border border-[#262C34] p-12 text-center rounded-lg space-y-2">
          <p className="text-sm text-[#F3F4F6] font-semibold">No problems match your current filters.</p>
          <p className="text-xs text-[#9CA3AF]">Try resetting search keywords or changing difficulty/topic selections.</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedDifficulty('All');
              setSelectedTopic('All');
              setSelectedStatus('All');
            }}
          >
            Reset All Filters
          </Button>
        </div>
      ) : hideGroups ? (
        /* Flat Un-Grouped Table */
        renderProblemTable(filteredProblems, 0)
      ) : (
        /* Grouped Categories View */
        <div className="space-y-6">
          {CATEGORIES.map((cat) => {
            const catProblems = filteredProblems.filter((p) => p.category === cat);
            if (catProblems.length === 0) return null;

            return (
              <div key={cat} className="space-y-2">
                <div className="flex items-center justify-between border-b border-[#262C34] pb-1.5 px-1">
                  <h2 className="text-sm font-bold text-[#F3F4F6] font-mono flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#A3B0FF]"></span>
                    <span>{cat}</span>
                  </h2>
                  <span className="text-[11px] font-mono text-[#667085]">
                    {catProblems.length} {catProblems.length === 1 ? 'problem' : 'problems'}
                  </span>
                </div>
                {renderProblemTable(catProblems, 0)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
