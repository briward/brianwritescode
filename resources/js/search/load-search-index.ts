import { SEARCH_INDEX_PATH } from "../../../app/site/search-index-path.ts";

import type { SearchDocument } from "../../../app/notes/search-document.ts";

/**
 * The index once requested, so opening search twice fetches it once.
 */
let pendingIndex: Promise<SearchDocument[]> | undefined;

/**
 * Fetch the search index the build wrote. A failed fetch is forgotten so the next open retries.
 *
 * @returns The search documents, newest note first.
 */
export default function loadSearchIndex(): Promise<SearchDocument[]> {
  pendingIndex ??= fetchIndex().catch((error: unknown) => {
    pendingIndex = undefined;

    throw error;
  });

  return pendingIndex;
}

/**
 * Request the index from the site.
 *
 * @returns The parsed index.
 */
async function fetchIndex(): Promise<SearchDocument[]> {
  const response = await fetch(SEARCH_INDEX_PATH, { headers: { Accept: "application/json" } });

  if (!response.ok) {
    throw new Error(`[search] index request failed with status ${response.status}`);
  }

  return (await response.json()) as SearchDocument[];
}
