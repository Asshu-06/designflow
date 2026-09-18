// src/hooks/useAttempt.ts
import { useState, useEffect, useCallback } from 'react';
import type { Attempt } from '../types/domain';
import {
  fetchAttemptById,
  fetchAttemptsByProblemId,
  fetchAllAttempts,
} from '../services/attemptService';

export function useAttempt(attemptId?: string) {
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState<boolean>(!!attemptId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!attemptId) return;
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        const data = await fetchAttemptById(attemptId!);
        if (isMounted) {
          setAttempt(data);
          setError(data ? null : 'Attempt not found');
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to load attempt');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [attemptId]);

  return { attempt, loading, error, setAttempt };
}

export function useProblemAttempts(problemId: string | undefined) {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refresh = useCallback(async () => {
    if (!problemId) return;
    setLoading(true);
    try {
      const data = await fetchAttemptsByProblemId(problemId);
      setAttempts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [problemId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { attempts, loading, refresh };
}

export function useAllAttempts() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllAttempts();
      setAttempts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { attempts, loading, refresh };
}
