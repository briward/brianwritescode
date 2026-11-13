/**
 * Where the old domains point, and how.
 */
export interface RedirectConfig {
  /**
   * The origin every request is sent to, with no trailing slash.
   */
  readonly targetOrigin: string;

  /**
   * The HTTP status for the redirect. 301 tells browsers and search engines the move is for good.
   */
  readonly status: 301 | 302 | 307 | 308;
}
