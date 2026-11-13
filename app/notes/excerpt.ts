import { plainTextOf } from "./search-document.ts";

import type { Note } from "./note.ts";

/**
 * How many characters of a note a teaser shows, at most.
 */
export const EXCERPT_LENGTH = 110;

/**
 * The start of a note's text for its teaser card, cut at a word boundary.
 *
 * @param note The note.
 *
 * @returns The excerpt, ending in an ellipsis when cut.
 */
export default function excerptOf(note: Note): string {
  const text = plainTextOf(note.body);

  if (text.length <= EXCERPT_LENGTH) {
    return text;
  }

  const cut = text.slice(0, EXCERPT_LENGTH);
  const lastSpace = cut.lastIndexOf(" ");

  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:]+$/, "")}…`;
}
