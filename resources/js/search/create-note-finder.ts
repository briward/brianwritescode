import Fuse from "fuse.js";

import type { SearchDocument } from "../../../app/notes/search-document.ts";

/**
 * The most results the search shows at once.
 */
const MAX_RESULTS = 10;

/**
 * How the fuzzy search weighs each field: titles count most, then tags, then the note's words.
 * `ignoreLocation` lets a match deep inside a long note count as much as one near the top.
 */
const FUSE_OPTIONS = {
  keys: [
    { name: "title", weight: 3 },
    { name: "tags", weight: 2 },
    { name: "text", weight: 1 },
  ],
  ignoreLocation: true,
  minMatchCharLength: 2,
  threshold: 0.3,
};

/**
 * Searches the notes in the browser.
 */
export interface NoteFinder {
  /**
   * The notes matching a query, best first. A query starting with `#` lists the notes whose tags
   * start with the rest of it, newest first; anything else is a fuzzy search.
   *
   * @param query What the reader typed.
   *
   * @returns At most {@link MAX_RESULTS} notes.
   */
  readonly find: (query: string) => readonly SearchDocument[];
}

/**
 * Build a finder over the search index.
 *
 * @param documents The search index, newest note first.
 *
 * @returns The finder.
 */
export default function createNoteFinder(documents: readonly SearchDocument[]): NoteFinder {
  const fuse = new Fuse(documents, FUSE_OPTIONS);

  return {
    find(query) {
      const trimmed = query.trim().toLowerCase();

      if (trimmed === "" || trimmed === "#") {
        return [];
      }

      if (trimmed.startsWith("#")) {
        const prefix = trimmed.slice(1);

        return documents
          .filter((document) => document.tags.some((tag) => tag.startsWith(prefix)))
          .slice(0, MAX_RESULTS);
      }

      return fuse.search(trimmed, { limit: MAX_RESULTS }).map((result) => result.item);
    },
  };
}
