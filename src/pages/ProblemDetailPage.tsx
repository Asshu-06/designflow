// src/pages/ProblemDetailPage.tsx
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProblem } from '../hooks/useProblems';
import { useProblemAttempts } from '../hooks/useAttempt';
import { createAttempt } from '../services/attemptService';
import { ProblemHeader } from '../components/practice/ProblemHeader';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { StatusBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ArrowLeft, Play, History, Clock, FileCheck2, Cpu, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const ProblemDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { problem, loading, error } = useProblem(slug);
  const { attempts, loading: loadingAttempts } = useProblemAttempts(problem?.id);

  const [isStarting, setIsStarting] = useState(false);

  const handleStartAttempt = async () => {
    if (!problem) return;
    try {
      setIsStarting(true);
      const newAttempt = await createAttempt(problem.id);
      navigate(`/practice/${problem.slug}?attemptId=${newAttempt.id}`);
    } catch (err: any) {
      alert(err.message || 'Failed to start practice attempt');
    } finally {
      setIsStarting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Fetching problem specification..." />;

  if (error || !problem) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#F3F4F6]">Problem Not Found</h2>
        <p className="text-[#9CA3AF] text-xs">The requested LLD problem specification could not be located.</p>
        <Link to="/problems">
          <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Problem Library
          </Button>
        </Link>
      </div>
    );
  }

  const activeDraft = attempts.find((a) => a.status === 'DRAFT');

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/problems" className="text-[#9CA3AF] hover:text-[#F3F4F6] text-xs font-mono flex items-center space-x-1.5 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Problem Library</span>
        </Link>
        <span className="text-[11px] font-mono text-[#667085]">Problem Spec ID: {problem.id.slice(0, 8)}</span>
      </div>

      {/* Main Documentation & Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Documentation Pane (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <ProblemHeader problem={problem} />

          {/* Full Documentation Sections */}
          <Card className="space-y-5">
            <div>
              <h3 className="text-xs font-mono font-bold text-[#8B9CF6] uppercase mb-2 flex items-center space-x-2">
                <FileCheck2 className="w-4 h-4" />
                <span>Functional Requirements Breakdown</span>
              </h3>
              <ul className="space-y-2 text-xs">
                {problem.functionalRequirements.map((req, idx) => (
                  <li key={idx} className="flex items-start space-x-2 bg-[#0B0D0F] p-3 rounded border border-[#262C34] text-[#F3F4F6]">
                    <CheckCircle2 className="w-4 h-4 text-[#35C98B] mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-[#262C34]">
              <h3 className="text-xs font-mono font-bold text-[#E7B65B] uppercase mb-2 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Non-Functional Constraints & Scale Limits</span>
              </h3>
              <ul className="space-y-2 text-xs">
                {problem.constraints.map((c, idx) => (
                  <li key={idx} className="flex items-start space-x-2 bg-[#E7B65B]/5 p-3 rounded border border-[#E7B65B]/20 text-[#E7B65B]">
                    <AlertTriangle className="w-4 h-4 text-[#E7B65B] mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-[#262C34]">
              <h3 className="text-xs font-mono font-bold text-[#8B9CF6] uppercase mb-2 flex items-center space-x-2">
                <Cpu className="w-4 h-4" />
                <span>Target Design Patterns & Focus Areas</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {problem.expectedDesignAreas.map((area, idx) => (
                  <div key={idx} className="bg-[#0B0D0F] p-3 rounded border border-[#262C34] font-mono text-[#8B9CF6] text-[11px]">
                    {area}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sticky Action Panel (1 Col) */}
        <div className="space-y-4 lg:sticky lg:top-16">
          {/* Action Card */}
          <Card className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#667085] block">Practice Action</span>
              <h2 className="text-base font-bold text-[#F3F4F6]">Ready to Design?</h2>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                You will complete an 8-section architecture specification covering entities, interfaces, SOLID trade-offs, and edge cases.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#262C34]">
              {activeDraft ? (
                <Button
                  size="md"
                  variant="primary"
                  className="w-full"
                  onClick={() => navigate(`/practice/${problem.slug}?attemptId=${activeDraft.id}`)}
                  leftIcon={<Play className="w-4 h-4" />}
                >
                  Resume Draft (#{activeDraft.attemptNumber})
                </Button>
              ) : (
                <Button
                  size="md"
                  variant="primary"
                  className="w-full"
                  onClick={handleStartAttempt}
                  isLoading={isStarting}
                  leftIcon={<Play className="w-4 h-4" />}
                >
                  Start New Attempt
                </Button>
              )}
            </div>
          </Card>

          {/* Previous Attempts for this Problem */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#262C34] pb-2">
              <h3 className="text-xs font-mono font-bold text-[#F3F4F6] flex items-center space-x-1.5">
                <History className="w-3.5 h-3.5 text-[#8B9CF6]" />
                <span>Previous Attempts ({attempts.length})</span>
              </h3>
            </div>

            {loadingAttempts ? (
              <LoadingSpinner size="sm" label="Loading attempt logs..." />
            ) : attempts.length === 0 ? (
              <div className="text-center py-4 space-y-1">
                <Clock className="w-6 h-6 text-[#667085] mx-auto" />
                <p className="text-xs text-[#9CA3AF]">No attempts submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {attempts.map((att) => (
                  <div
                    key={att.id}
                    className="bg-[#0B0D0F] border border-[#262C34] p-3 rounded-md flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[#8B9CF6] font-bold">#{att.attemptNumber}</span>
                        <StatusBadge status={att.status} />
                      </div>
                      <span className="text-[10px] text-[#667085] block mt-0.5">
                        {new Date(att.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      {att.evaluation ? (
                        <Link to={`/attempts/${att.id}`}>
                          <Button size="sm" variant="outline">
                            Review ({att.evaluation.overallScore})
                          </Button>
                        </Link>
                      ) : (
                        <Link to={`/practice/${problem.slug}?attemptId=${att.id}`}>
                          <Button size="sm" variant="secondary">
                            Resume
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
