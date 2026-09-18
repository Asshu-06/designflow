// src/pages/HistoryPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAllAttempts } from '../hooks/useAttempt';
import { useProblems } from '../hooks/useProblems';
import { StatusBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { createAttempt } from '../services/attemptService';
import { History, ArrowRight, RefreshCw, Clock, CheckCircle2, ShieldCheck, FileCode2 } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { attempts, loading } = useAllAttempts();
  const { problems } = useProblems();

  const [retryingId, setRetryingId] = useState<string | null>(null);

  const getProblem = (problemId: string) => {
    return problems.find((p) => p.id === problemId);
  };

  const handleRetry = async (problemId: string, slug: string) => {
    try {
      setRetryingId(problemId);
      const newAtt = await createAttempt(problemId);
      navigate(`/practice/${slug}?attemptId=${newAtt.id}`);
    } catch (err: any) {
      alert('Failed to create retry attempt');
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#262C34] pb-4">
        <div>
          <div className="flex items-center space-x-2 text-[#A3B0FF] font-mono text-xs mb-1">
            <History className="w-3.5 h-3.5" />
            <span>MY SUBMISSIONS &amp; REVIEWS</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F3F4F6] tracking-tight">Practice Submissions History</h1>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            Review previous implementations, check test execution statuses, examine design review scores, and retry problems to refine your architecture.
          </p>
        </div>

        <Link to="/problems">
          <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Practice New Problem
          </Button>
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner label="Fetching submission logs..." />
      ) : attempts.length === 0 ? (
        <div className="bg-[#111418] border border-[#262C34] rounded-lg p-12 text-center space-y-3">
          <Clock className="w-10 h-10 text-[#667085] mx-auto mb-2" />
          <h3 className="text-base font-bold text-[#F3F4F6]">No Practice Submissions Yet</h3>
          <p className="text-xs text-[#9CA3AF] max-w-md mx-auto">
            Start your first Low-Level Design practice attempt to see your submitted implementation and rubric evaluation history listed here.
          </p>
          <Link to="/problems">
            <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Explore Problem Library
            </Button>
          </Link>
        </div>
      ) : (
        /* Dense Submissions History Table */
        <div className="bg-[#111418] border border-[#262C34] rounded-lg overflow-hidden">
          <table className="w-full text-left font-mono text-xs text-[#9CA3AF] border-collapse">
            <thead>
              <tr className="bg-[#171B21] border-b border-[#262C34] text-[#667085] uppercase text-[10px] tracking-wider select-none">
                <th className="py-3 px-4">Problem</th>
                <th className="py-3 px-4 w-24">Attempt</th>
                <th className="py-3 px-4 w-28 hidden md:table-cell">Language</th>
                <th className="py-3 px-4 w-32">Status</th>
                <th className="py-3 px-4 w-32 hidden lg:table-cell">Test Status</th>
                <th className="py-3 px-4 w-32">Design Score</th>
                <th className="py-3 px-4 w-36 hidden sm:table-cell">Submitted Date</th>
                <th className="py-3 px-4 w-40 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262C34]">
              {attempts.map((att) => {
                const problem = getProblem(att.problemId);
                const title = problem ? problem.title : 'Low-Level Design Problem';
                const slug = problem ? problem.slug : 'parking-lot';
                const score = att.evaluation?.overallScore;

                return (
                  <tr key={att.id} className="hover:bg-[#171B21]/60 transition-colors">
                    {/* Problem Title */}
                    <td className="py-3.5 px-4 font-sans font-bold text-[#F3F4F6] text-sm">
                      <Link to={`/practice/${slug}?attemptId=${att.id}`} className="hover:text-[#A3B0FF] transition-colors">
                        {title}
                      </Link>
                    </td>

                    {/* Attempt Number */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#A3B0FF]">
                      #{att.attemptNumber}
                    </td>

                    {/* Language */}
                    <td className="py-3.5 px-4 hidden md:table-cell font-mono text-[11px] text-[#9CA3AF]">
                      <span className="bg-[#171B21] px-2 py-0.5 rounded border border-[#262C34]">
                        Java 17
                      </span>
                    </td>

                    {/* Submission Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={att.status} />
                    </td>

                    {/* Test Status */}
                    <td className="py-3.5 px-4 hidden lg:table-cell font-mono text-[11px]">
                      {att.status === 'COMPLETED' ? (
                        <span className="text-[#35C98B] flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Passed (2/2)</span>
                        </span>
                      ) : (
                        <span className="text-[#667085] italic">Not Executed</span>
                      )}
                    </td>

                    {/* Design Score */}
                    <td className="py-3.5 px-4 font-mono text-sm font-bold">
                      {score !== undefined ? (
                        <span className={score >= 80 ? 'text-[#35C98B]' : score >= 60 ? 'text-[#E7B65B]' : 'text-[#F07070]'}>
                          {score} <span className="text-[10px] text-[#667085] font-normal">/ 100</span>
                        </span>
                      ) : (
                        <span className="text-[#667085] text-xs italic">&mdash;</span>
                      )}
                    </td>

                    {/* Submitted Date */}
                    <td className="py-3.5 px-4 hidden sm:table-cell text-[11px] text-[#667085] font-mono">
                      {new Date(att.createdAt).toLocaleDateString()}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {att.status === 'COMPLETED' ? (
                          <Link to={`/attempts/${att.id}`}>
                            <Button size="sm" variant="outline" leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-[#A3B0FF]" />}>
                              View Review
                            </Button>
                          </Link>
                        ) : (
                          <Link to={`/practice/${slug}?attemptId=${att.id}`}>
                            <Button size="sm" variant="secondary" leftIcon={<FileCode2 className="w-3.5 h-3.5" />}>
                              Resume
                            </Button>
                          </Link>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRetry(att.problemId, slug)}
                          isLoading={retryingId === att.problemId}
                          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                          title="Retry Problem"
                        >
                          Retry
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
