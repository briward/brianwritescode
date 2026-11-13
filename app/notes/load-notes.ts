import { join } from "node:path";
import { readdir, readFile } from "node:fs/promises";

import parseNote, { NOTE_EXTENSION } from "./parse-note.ts";

import type { Note } from "./note.ts";

/**
 * Read and check every note in a directory. Only files directly inside it count; a note's URL
 * comes from its file name alone.
 *
 * @param directory The notes directory.
 *
 * @returns The notes, in no particular order. Throws InvalidNoteError for the first bad note.
 */
export default async function loadNotes(directory: string): Promise<Note[]> {
  const entries = await readdir(directory, { withFileTypes: true });

  const filenames = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(NOTE_EXTENSION))
    .map((entry) => join(directory, entry.name));

  return Promise.all(
    filenames.map(async (filename) => {
      const source = await readFile(filename, "utf-8");

      return parseNote({ filename, source });
    }),
  );
}
