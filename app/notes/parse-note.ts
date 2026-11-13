import matter from "gray-matter";

import isUrlName from "./is-url-name.ts";
import InvalidNoteError from "./errors/invalid-note-error.ts";

import type { Note } from "./note.ts";

/**
 * A day written as `YYYY-MM-DD`.
 */
const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * The extension every note file has.
 */
export const NOTE_EXTENSION = ".mdx";

/**
 * One note file as read from disk.
 */
export interface NoteFile {
  /**
   * The file's path, used for the slug and in error messages.
   */
  readonly filename: string;

  /**
   * The file's full contents, front matter included.
   */
  readonly source: string;
}

/**
 * Turn a note file into a {@link Note}, checking its name and front matter. A note needs a
 * `title`, a `date` and at least one tag; anything else in the front matter is ignored.
 *
 * @param file The note file.
 *
 * @returns The note.
 */
export default function parseNote(file: NoteFile): Note {
  const { data: frontMatter, content } = matter(file.source);
  const slug = slugOf(file.filename);

  return {
    slug,
    url: `/notes/${slug}`,
    title: titleOf(file.filename, frontMatter["title"]),
    date: dayOf(file.filename, frontMatter["date"]),
    tags: tagsOf(file.filename, frontMatter["tags"]),
    body: content.trim(),
  };
}

/**
 * The slug a note file is published under: its file name without the extension.
 *
 * @param filename The note file's path.
 *
 * @returns The slug.
 */
function slugOf(filename: string): string {
  const basename = filename.split(/[\\/]/).pop() ?? filename;

  if (!basename.endsWith(NOTE_EXTENSION)) {
    throw new InvalidNoteError(filename, `the file name must end in ${NOTE_EXTENSION}`);
  }

  const slug = basename.slice(0, -NOTE_EXTENSION.length);

  if (!isUrlName(slug)) {
    throw new InvalidNoteError(
      filename,
      "the file name must be lowercase words joined by hyphens, such as my-note.mdx",
    );
  }

  return slug;
}

/**
 * The note's title, checked.
 *
 * @param filename The note file's path, for the error message.
 * @param value The `title` front matter value.
 *
 * @returns The title without surrounding whitespace.
 */
function titleOf(filename: string, value: unknown): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new InvalidNoteError(filename, "front matter needs a title");
  }

  return value.trim();
}

/**
 * The day the note was written, as `YYYY-MM-DD`. YAML reads an unquoted day as a Date at UTC
 * midnight, and a quoted one as a string, so both are accepted.
 *
 * @param filename The note file's path, for the error message.
 * @param value The `date` front matter value.
 *
 * @returns The day as `YYYY-MM-DD`.
 */
function dayOf(filename: string, value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  // A string like 2026-02-31 matches the pattern, so it must also survive a round trip.
  if (typeof value === "string" && DAY_PATTERN.test(value) && isRealDay(value)) {
    return value;
  }

  throw new InvalidNoteError(filename, "front matter needs a date written as YYYY-MM-DD");
}

/**
 * Whether a `YYYY-MM-DD` string names a day that exists.
 *
 * @param day The day to check.
 *
 * @returns True when the calendar has that day.
 */
function isRealDay(day: string): boolean {
  const parsed = new Date(`${day}T00:00:00Z`);

  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(day);
}

/**
 * The note's tags, checked: at least one, each a URL name, none repeated.
 *
 * @param filename The note file's path, for the error message.
 * @param value The `tags` front matter value.
 *
 * @returns The tags in the order written.
 */
function tagsOf(filename: string, value: unknown): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new InvalidNoteError(filename, "front matter needs at least one tag");
  }

  const tags: string[] = [];

  for (const tag of value) {
    if (typeof tag !== "string" || !isUrlName(tag)) {
      throw new InvalidNoteError(
        filename,
        `tag ${JSON.stringify(tag)} must be lowercase words joined by hyphens`,
      );
    }

    if (tags.includes(tag)) {
      throw new InvalidNoteError(filename, `tag "${tag}" is listed twice`);
    }

    tags.push(tag);
  }

  return tags;
}
