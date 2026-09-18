// src/services/problemService.ts
import { supabase, isLocalStorageFallback } from '../lib/supabase';
import type { Problem } from '../types/domain';
import { SEED_PROBLEMS } from '../data/seedProblems';
import type { ProblemRow } from '../types/database';

function mapRowToProblem(row: ProblemRow): Problem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    difficulty: row.difficulty,
    problemStatement: row.problem_statement,
    functionalRequirements: Array.isArray(row.functional_requirements) ? row.functional_requirements : [],
    constraints: Array.isArray(row.constraints) ? row.constraints : [],
    expectedDesignAreas: Array.isArray(row.expected_design_areas) ? row.expected_design_areas : [],
    createdAt: row.created_at,
  };
}

export async function fetchAllProblems(): Promise<Problem[]> {
  if (isLocalStorageFallback) {
    return SEED_PROBLEMS;
  }

  try {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Supabase fetch failed or returned empty problems, falling back to SEED_PROBLEMS:', error);
      return SEED_PROBLEMS;
    }

    return (data as ProblemRow[]).map(mapRowToProblem);
  } catch (err) {
    console.error('Error fetching problems from Supabase:', err);
    return SEED_PROBLEMS;
  }
}

export async function fetchProblemBySlug(slug: string): Promise<Problem | null> {
  if (isLocalStorageFallback) {
    const found = SEED_PROBLEMS.find((p) => p.slug === slug);
    return found || null;
  }

  try {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      const fallback = SEED_PROBLEMS.find((p) => p.slug === slug);
      return fallback || null;
    }

    return mapRowToProblem(data as ProblemRow);
  } catch (err) {
    console.error('Error fetching problem by slug:', err);
    const fallback = SEED_PROBLEMS.find((p) => p.slug === slug);
    return fallback || null;
  }
}
