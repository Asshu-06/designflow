// src/hooks/useProblems.ts
import { useState, useEffect } from 'react';
import type { Problem } from '../types/domain';
import { fetchAllProblems, fetchProblemBySlug } from '../services/problemService';

export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await fetchAllProblems();
        if (isMounted) {
          setProblems(data);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load problems');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { problems, loading, error };
}

export function useProblem(slug: string | undefined) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    const currentSlug = slug;
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await fetchProblemBySlug(currentSlug);
        if (isMounted) {
          setProblem(data);
          setError(data ? null : 'Problem not found');
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load problem');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  return { problem, loading, error };
}
