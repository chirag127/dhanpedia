/**
 * Shared types for the DhanPedia content registries.
 * The JSON files in content-registry/ are the single source of truth that the
 * build scripts and site pages read. Article bodies live in MDX under
 * src/content/; these registries hold the machine-readable metadata.
 */
import type { CategoryId } from '../src/lib/site';

export type ArticleStatus =
  | 'planned'
  | 'researched'
  | 'drafted'
  | 'fact_checked'
  | 'edited'
  | 'approved'
  | 'published';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'all';

export interface ArticleRecord {
  /** Stable id, e.g. mf-sip-explained. Must match the MDX file's id. */
  id: string;
  title: string;
  category: CategoryId;
  tags: string[];
  difficulty: Difficulty;
  status: ArticleStatus;
  summary: string;
  /** src/content path relative to repo root. */
  file: string;
  wordsApprox?: number;
  lastVerified?: string; // ISO date
  reviewAfter?: string; // ISO date when time-sensitive content should be re-checked
  sources: string[]; // source ids into sources.json
  related: string[]; // article ids
  books: string[]; // book ids
}

export interface BookRecord {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  audience: string;
  chapters: string[]; // ordered article ids
  preface?: string;
  version: string;
  published: string; // ISO date
  formats: string[]; // md, txt, tts, pdf, epub, html
}

export interface SourceRecord {
  id: string;
  publisher: string;
  title: string;
  url: string;
  type:
    | 'statute'
    | 'regulator'
    | 'government'
    | 'exchange'
    | 'industry-body'
    | 'academic'
    | 'financial-publication'
    | 'community';
  authority: 'primary' | 'secondary';
  published?: string;
  verified?: string; // ISO date accessed/verified
  limitations?: string;
  claims?: string; // which article(s)/claims rely on this
}

export interface InstrumentRecord {
  id: string;
  name: string;
  category: CategoryId;
  regulator: string;
  minInvestment?: string;
  taxTreatment: string;
  liquidity: 'high' | 'medium' | 'low' | 'illiquid';
  risk: 'low' | 'medium' | 'high';
  status: 'active' | 'closed' | 'historical' | 'limited';
  summary: string;
  articleId: string;
  lastVerified: string;
}
