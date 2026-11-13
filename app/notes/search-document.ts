import type { Note } from "./note.ts";

/**
 * What the in-browser search knows about one note. The search index is a JSON array of these.
 */
export interface SearchDocument {
  /**
   * Where the note is published.
   */
  readonly url: string;

  /**
   * The note's title.
   */
  readonly title: string;

  /**
   * The day the note was written, as `YYYY-MM-DD`.
   */
  readonly date: string;

  /**
   * The note's tags.
   */
  readonly tags: readonly string[];

  /**
   * The note's words without markup. Code stays in, because a snippet is often what you search
   * for.
   */
  readonly text: string;
}

/**
 * The search entry for one note.
 *
 * @param note The note.
 *
 * @returns Its search document.
 */
export default function searchDocumentOf(note: Note): SearchDocument {
  return {
    url: note.url,
    title: note.title,
    date: note.date,
    tags: note.tags,
    text: plainTextOf(note.body),
  };
}

/**
 * Bold, italic and inline code written with asterisks or backticks.
 */
const STAR_OR_CODE_MARKUP = /(\*\*|\*|`)(.+?)\1/g;

/**
 * Bold and italic written with underscores. Only at word edges, so `snake_case` names survive.
 */
const UNDERSCORE_MARKUP = /(?<!\w)(__|_)(?!\s)(.+?)(?<!\s)\1(?!\w)/g;

/**
 * Strip MDX down to the words a reader sees, code included.
 *
 * @param body The note's MDX source without front matter.
 *
 * @returns The plain text, whitespace collapsed.
 */
export function plainTextOf(body: string): string {
  const withoutBlocks = body
    // MDX import and export lines are code for the compiler, not words in the note.
    .replace(/^(?:import|export)\s.*$/gm, "")
    .replace(/^\s*(?:```|~~~).*$/gm, "")
    .replace(/<\/?[A-Za-z][^>]*>/g, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}(?:#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
    // A table's divider row is only markup; in its other rows the pipes become spaces between
    // the words. Only lines that start and end with a pipe count, so `a | b` in code survives.
    .replace(/^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{0,}:?\s*$/gm, "")
    .replace(/^\s*\|(.*)\|\s*$/gm, (_row, cells: string) => cells.replace(/\s*\|\s*/g, " "));

  return stripInlineMarkup(withoutBlocks).replace(/\s+/g, " ").trim();
}

/**
 * Remove inline markup, layer by layer, so nested marks such as bold around code all go.
 *
 * @param text Text that may hold inline markup.
 *
 * @returns The text with every layer removed.
 */
function stripInlineMarkup(text: string): string {
  const stripped = text.replace(STAR_OR_CODE_MARKUP, "$2").replace(UNDERSCORE_MARKUP, "$2");

  if (stripped === text) {
    return text;
  }

  return stripInlineMarkup(stripped);
}
