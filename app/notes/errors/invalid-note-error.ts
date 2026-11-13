/**
 * A note file that cannot be published as written: its name or front matter breaks a rule.
 */
export default class InvalidNoteError extends Error {
  /**
   * The note file at fault, as given to the reader.
   */
  public readonly filename: string;

  /**
   * @constructor
   *
   * @param filename The note file at fault.
   * @param problem What is wrong with it, phrased so the author can fix it.
   * @param options The underlying cause, when there is one.
   */
  constructor(filename: string, problem: string, options?: ErrorOptions) {
    super(`Note "${filename}" is invalid: ${problem}`, options);

    this.name = "InvalidNoteError";
    this.filename = filename;
  }
}
