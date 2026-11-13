import type { Note } from "./note.ts";

/**
 * One tag and every note filed under it.
 */
export interface Tag {
  /**
   * The tag as written in front matter, such as `cloudflare-workers`.
   */
  readonly name: string;

  /**
   * Where the tag's page is published, `/tags/<name>`.
   */
  readonly url: string;

  /**
   * The notes filed under the tag, newest first.
   */
  readonly notes: readonly Note[];
}

/**
 * Everything the site publishes: every note and every tag in use. Pages, tag pages and the search
 * index are all built from it, so they always agree.
 */
export interface Catalog {
  /**
   * Every note, newest first. Notes written on the same day are ordered by title.
   */
  readonly notes: readonly Note[];

  /**
   * Every tag used by at least one note, in alphabetical order.
   */
  readonly tags: readonly Tag[];
}

/**
 * Where a tag's page is published.
 *
 * @param name The tag, such as `cloudflare-workers`.
 *
 * @returns The page's path, `/tags/<name>`.
 */
export function tagUrlOf(name: string): string {
  return `/tags/${name}`;
}

/**
 * Put the notes in publishing order and group them by tag.
 *
 * @param notes The notes, in any order.
 *
 * @returns The catalog.
 */
export default function buildCatalog(notes: readonly Note[]): Catalog {
  const ordered = [...notes].sort(compareNewestFirst);
  const notesByTag = new Map<string, Note[]>();

  for (const note of ordered) {
    for (const tag of note.tags) {
      const tagged = notesByTag.get(tag) ?? [];

      tagged.push(note);
      notesByTag.set(tag, tagged);
    }
  }

  const tags = [...notesByTag.keys()].sort().map((name) => ({
    name,
    url: tagUrlOf(name),
    notes: notesByTag.get(name) ?? [],
  }));

  return { notes: ordered, tags };
}

/**
 * Order two notes newest first, then by title so the order never depends on the file system.
 *
 * @param left One note.
 * @param right The other note.
 *
 * @returns Negative when `left` comes first.
 */
function compareNewestFirst(left: Note, right: Note): number {
  if (left.date !== right.date) {
    return left.date < right.date ? 1 : -1;
  }

  return left.title.localeCompare(right.title);
}
