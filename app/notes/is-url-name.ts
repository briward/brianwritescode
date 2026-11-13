/**
 * Lowercase letters and digits in words joined by single hyphens. Note slugs and tags both follow
 * it, so each one can sit in a URL unchanged.
 */
const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Whether a value is usable as a note slug or a tag, such as `cloudflare-workers`.
 *
 * @param value The candidate slug or tag.
 *
 * @returns True when the value follows {@link NAME_PATTERN}.
 */
export default function isUrlName(value: string): boolean {
  return NAME_PATTERN.test(value);
}
