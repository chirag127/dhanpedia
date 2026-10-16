/**
 * Data-access layer: reads the machine-readable content registries.
 * Astro builds statically, so we import the JSON directly (bundled at build).
 */
import articles from '@registry/articles.json';
import books from '@registry/books.json';
import sources from '@registry/sources.json';
import instruments from '@registry/instruments.json';
import updateLog from '@registry/update-log.json';
import type { ArticleRecord, BookRecord, SourceRecord, InstrumentRecord } from '@types/registry';

export const ARTICLES: ArticleRecord[] = (articles as any).articles;
export const BOOKS: BookRecord[] = (books as any).books;
export const SOURCES: SourceRecord[] = (sources as any) as SourceRecord[];
export const INSTRUMENTS: InstrumentRecord[] = (instruments as any).instruments;
export const UPDATE_LOG = (updateLog as any).entries;

const articleMap = new Map(ARTICLES.map((a) => [a.id, a]));

export function getArticle(id: string): ArticleRecord | undefined {
  return articleMap.get(id);
}

export function articlesByCategory(cat: string): ArticleRecord[] {
  return ARTICLES.filter((a) => a.category === cat);
}

export function sourceById(id: string): SourceRecord | undefined {
  return (sources as any).find((s: SourceRecord) => s.id === id);
}

export function bookById(id: string): BookRecord | undefined {
  return BOOKS.find((b) => b.id === id);
}

export function instrumentsByCategory(cat: string): InstrumentRecord[] {
  return INSTRUMENTS.filter((i) => i.category === cat);
}
