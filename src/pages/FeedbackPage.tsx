// src/pages/FeedbackPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAttempt } from '../hooks/useAttempt';
import { ScoreSummary } from '../components/feedback/ScoreSummary';
import { RubricCard } from '../components/feedback/RubricCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { ArrowLeft, RefreshCw, ChevronDown, ChevronUp, Terminal, ShieldCheck } from 'lucide-react';
import { createAttempt } from '../services/attemptService';

export const FeedbackPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const { attempt, loading, error } = useAttempt(attemptId);
  const [showSubmission, setShowSubmission] = useState(false);
  const [problemTitle, setProblemTitle] = useState<string>('LLD Problem');
  const [problemSlug, setProblemSlug] = useState<string>('');
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (!attempt?.problemId) return;
    async function resolveProblem() {
      const { fetchAllProblems } = await import('../services/problemService');
      const all = await fetchAllProblems();
      const match = all.find((p) => p.id === attempt?.problemId);
      if (match) {
        setProblemTitle(match.title);
        setProblemSlug(match.slug);
      }
    }
    resolveProblem();
  }, [attempt]);

  const handleRetry = async () => {
    if (!attempt?.problemId) return;
    try {
      setIsRetrying(true);
      const newAtt = await createAttempt(attempt.problemId);
      navigate(`/practice/${problemSlug || 'parking-lot'}?attemptId=${newAtt.id}`);
    } catch (err: any) {
      console.warn('Failed to start retry attempt:', err);
      alert('Failed to start retry attempt');
    } finally {
      setIsRetrying(false);
    }
  };

  if (loading) return <LoadingSpinner label="Compiling design review analysis..." size="lg" />;

  if (error || !attempt || !attempt.evaluation) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#F3F4F6]">Design Review Report Unavailable</h2>
        <p className="text-[#9CA3AF] text-xs">
          {attempt?.status === 'EVALUATING'
            ? 'Design review analysis is currently processing...'
            : 'Could not load review report for this attempt.'}
        </p>
        <Link to="/history">
          <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Submission History
          </Button>
        </Link>
      </div>
    );
  }

  const evaluation = attempt.evaluation;
  const feedbackItems = evaluation.feedbackItems || [];

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between border-b border-[#262C34] pb-3">
        <Link to="/history" className="text-[#9CA3AF] hover:text-[#F3F4F6] text-xs font-mono flex items-center space-x-1.5">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Submissions</span>
        </Link>
        <Button
          variant="primary"
          size="sm"
          onClick={handleRetry}
          isLoading={isRetrying}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Retry Problem
        </Button>
      </div>

      {/* Score Executive Summary */}
      <ScoreSummary
        evaluation={evaluation}
        attemptNumber={attempt.attemptNumber}
        problemTitle={problemTitle}
      />

      {/* Submitted Architecture Specification Accordion */}
      {attempt.submission && (
        <div className="bg-[#111418] border border-[#262C34] rounded-lg overflow-hidden">
          <button
            onClick={() => setShowSubmission(!showSubmission)}
            className="w-full px-4 py-3 flex items-center justify-between text-left text-[#F3F4F6] hover:bg-[#171B21] transition-colors font-mono text-xs cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-[#8B9CF6]" />
              <span>Inspect Submitted Architecture Document</span>
            </div>
            {showSubmission ? <ChevronUp className="w-4 h-4 text-[#9CA3AF]" /> : <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />}
          </button>

          {showSubmission && (
            <div className="p-4 border-t border-[#262C34] space-y-3 bg-[#0B0D0F] text-xs text-[#F3F4F6] font-mono leading-relaxed">
              <div>
                <span className="text-[#8B9CF6] font-bold block mb-1">1. Assumptions & Boundaries:</span>
                <p className="bg-[#111418] p-2.5 rounded border border-[#262C34]">{attempt.submission.assumptions}</p>
              </div>
              <div>
                <span className="text-[#8B9CF6] font-bold block mb-1">2. Core Classes & Entities:</span>
                <p className="bg-[#111418] p-2.5 rounded border border-[#262C34]">{attempt.submission.coreClasses}</p>
              </div>
              <div>
                <span className="text-[#8B9CF6] font-bold block mb-1">3. Responsibilities (SRP):</span>
                <p className="bg-[#111418] p-2.5 rounded border border-[#262C34]">{attempt.submission.responsibilities}</p>
              </div>
              <div>
                <span className="text-[#8B9CF6] font-bold block mb-1">4. Relationships & Patterns:</span>
                <p className="bg-[#111418] p-2.5 rounded border border-[#262C34]">{attempt.submission.relationships}</p>
              </div>
              {attempt.submission.interfaces && (
                <div>
                  <span className="text-[#8B9CF6] font-bold block mb-1">5. Interfaces & Contracts:</span>
                  <p className="bg-[#111418] p-2.5 rounded border border-[#262C34]">{attempt.submission.interfaces}</p>
                </div>
              )}
              <div>
                <span className="text-[#8B9CF6] font-bold block mb-1">6. SOLID Trade-offs:</span>
                <p className="bg-[#111418] p-2.5 rounded border border-[#262C34]">{attempt.submission.tradeoffs}</p>
              </div>
              <div>
                <span className="text-[#8B9CF6] font-bold block mb-1">7. Edge Cases:</span>
                <p className="bg-[#111418] p-2.5 rounded border border-[#262C34]">{attempt.submission.edgeCases}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Criterion-Based Review Panels */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#262C34] pb-2">
          <h2 className="text-sm font-bold font-mono text-[#F3F4F6] flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#8B9CF6]" />
            <span>Criterion-Based Design Review Panels</span>
          </h2>
          <span className="text-xs text-[#9CA3AF] font-mono">{feedbackItems.length} Criteria Evaluated</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {feedbackItems.map((item) => (
            <RubricCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="pt-4 flex justify-center">
        <Button
          variant="primary"
          size="md"
          onClick={handleRetry}
          isLoading={isRetrying}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Retry Problem to Refine Architecture
        </Button>
      </div>
    </div>
  );
};
