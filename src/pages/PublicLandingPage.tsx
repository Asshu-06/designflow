// src/pages/PublicLandingPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Button } from '../components/common/Button';
import { DifficultyBadge } from '../components/common/Badge';
import { SEED_PROBLEMS } from '../data/seedProblems';
import {
  ArrowRight,
  Terminal,
  FileCode2,
  CheckCircle2,
  Layers,
  Code2,
  ListChecks,
} from 'lucide-react';

export const PublicLandingPage: React.FC = () => {
  return (
    <PublicLayout>
      <div className="space-y-16 py-6">
        {/* 1. HERO SECTION */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 space-y-8">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-[#171B21] border border-[#262C34] text-[#A3B0FF] text-[11px] font-mono tracking-wider">
              <Terminal className="w-3.5 h-3.5 text-[#A3B0FF]" />
              <span>LOW-LEVEL DESIGN PRACTICE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-[#F3F4F6] tracking-tight leading-[1.1]">
              Think in objects.<br />
              <span className="text-[#A3B0FF]">Design with purpose.</span>
            </h1>

            <p className="text-[#9CA3AF] text-base sm:text-lg leading-relaxed max-w-2xl">
              Practice real-world object-oriented design problems, write implementations, test your solutions, and improve through structured design reviews.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/problems">
                <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Start Practicing
                </Button>
              </Link>
              <Link to="/problems">
                <Button size="lg" variant="outline">
                  Explore Problem Library
                </Button>
              </Link>
            </div>
          </div>

          {/* Actual Problem Library Interface Preview */}
          <div className="bg-[#111418] border border-[#262C34] rounded-lg overflow-hidden shadow-2xl">
            <div className="bg-[#171B21] border-b border-[#262C34] px-4 py-2.5 flex items-center justify-between font-mono text-xs text-[#9CA3AF]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#262C34]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#262C34]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#262C34]"></span>
                <span className="ml-2 text-[#F3F4F6] font-semibold">lldlab &mdash; problem-library</span>
              </div>
              <span className="text-[11px] text-[#667085]">24 problems &bull; 0 solved</span>
            </div>

            <div className="p-4 space-y-2 font-mono text-xs">
              {SEED_PROBLEMS.slice(0, 3).map((prob, idx) => (
                <div
                  key={prob.id}
                  className="bg-[#0B0D0F] border border-[#262C34] rounded p-3 flex items-center justify-between hover:border-[#38404B] transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-[#667085] w-6">#{idx + 1}</span>
                    <div>
                      <span className="text-[#F3F4F6] font-semibold block">{prob.title}</span>
                      <span className="text-[11px] text-[#9CA3AF] font-sans">{prob.shortDescription}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DifficultyBadge difficulty={prob.difficulty} />
                    <Link to={`/practice/${prob.slug}`}>
                      <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="w-3 h-3" />}>
                        Practice
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. PROBLEM CATEGORIES PREVIEW */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-b border-[#262C34] pb-3">
            <span className="text-xs font-mono uppercase text-[#A3B0FF] block mb-1">CATEGORIES</span>
            <h2 className="text-xl font-bold text-[#F3F4F6]">Targeted Design Domains</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { title: 'OOP Fundamentals', count: '4 problems' },
              { title: 'Class Relationships', count: '3 problems' },
              { title: 'SOLID Principles', count: '4 problems' },
              { title: 'Creational Patterns', count: '3 problems' },
              { title: 'Structural Patterns', count: '3 problems' },
              { title: 'Behavioral Patterns', count: '4 problems' },
              { title: 'System Design Basics', count: '3 problems' },
            ].map((cat, idx) => (
              <Link
                key={idx}
                to="/problems"
                className="bg-[#111418] border border-[#262C34] rounded-md p-3 hover:border-[#8B9CF6] transition-colors group block"
              >
                <span className="text-xs font-bold text-[#F3F4F6] group-hover:text-[#A3B0FF] block mb-1">
                  {cat.title}
                </span>
                <span className="text-[10px] font-mono text-[#667085] block">{cat.count}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. PRACTICE WORKFLOW */}
        <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="border-b border-[#262C34] pb-3">
            <span className="text-xs font-mono uppercase text-[#A3B0FF] block mb-1">WORKFLOW</span>
            <h2 className="text-xl font-bold text-[#F3F4F6]">How LLD LAB Practice Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: '01',
                title: 'Select Problem & Analyze Spec',
                desc: 'Read functional requirements, constraints, example call patterns, and target class abstractions.',
                icon: Layers,
              },
              {
                step: '02',
                title: 'Implement & Test Solutions',
                desc: 'Write modular code, define clean interfaces, and execute test cases directly in the interactive workspace.',
                icon: Code2,
              },
              {
                step: '03',
                title: 'Evaluate & Review Architecture',
                desc: 'Run multi-dimensional design reviews to inspect encapsulation, SRP cohesion, SOLID trade-offs, and edge cases.',
                icon: ListChecks,
              },
            ].map((wf) => {
              const Icon = wf.icon;
              return (
                <div key={wf.step} className="bg-[#111418] border border-[#262C34] rounded-lg p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-[#A3B0FF]/40">{wf.step}</span>
                    <div className="p-2 bg-[#171B21] border border-[#262C34] rounded text-[#A3B0FF]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-[#F3F4F6]">{wf.title}</h3>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">{wf.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. PRODUCT PREVIEW */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-b border-[#262C34] pb-3">
            <span className="text-xs font-mono uppercase text-[#A3B0FF] block mb-1">WORKSPACE CAPABILITIES</span>
            <h2 className="text-xl font-bold text-[#F3F4F6]">Developer-Tool Experience</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#111418] border border-[#262C34] rounded-lg p-5 space-y-3">
              <FileCode2 className="w-5 h-5 text-[#A3B0FF]" />
              <h3 className="text-sm font-bold text-[#F3F4F6]">Code Editor &amp; Multi-Language</h3>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Write code implementations in Java, TypeScript, Python, C++, or Go with line numbers and syntax formatting.
              </p>
            </div>

            <div className="bg-[#111418] border border-[#262C34] rounded-lg p-5 space-y-3">
              <CheckCircle2 className="w-5 h-5 text-[#35C98B]" />
              <h3 className="text-sm font-bold text-[#F3F4F6]">Test Case Runner</h3>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Execute visible test cases against your implementation before submitting for design review.
              </p>
            </div>

            <div className="bg-[#111418] border border-[#262C34] rounded-lg p-5 space-y-3">
              <Terminal className="w-5 h-5 text-[#E7B65B]" />
              <h3 className="text-sm font-bold text-[#F3F4F6]">Structured Design Review</h3>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Receive evidence-based feedback on requirement coverage, encapsulation, SOLID principles, and extensibility.
              </p>
            </div>
          </div>
        </section>

        {/* 5. CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#111418] border border-[#262C34] rounded-lg p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold text-[#F3F4F6]">
              Ready to practice low-level design?
            </h2>
            <p className="text-xs text-[#9CA3AF] max-w-md mx-auto">
              Start with curated problems, write clean implementations, and elevate your software engineering architecture.
            </p>
            <div className="pt-2">
              <Link to="/problems">
                <Button size="md" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Start Practicing Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};
