/**
 * Where the site's sources live and where the build writes, plus the facts every page shows.
 */
export interface SiteConfig {
  /**
   * The site's name, shown in the header and page titles.
   */
  readonly name: string;

  /**
   * The public origin with no trailing slash, for canonical links.
   */
  readonly origin: string;

  /**
   * The default page description for search engines and link previews.
   */
  readonly description: string;

  /**
   * Every directory the build reads or writes, as absolute paths.
   */
  readonly directories: {
    /**
     * MDX pages. Each file becomes one page at the matching path.
     */
    readonly pages: string;

    /**
     * Note files, a folder inside `pages`.
     */
    readonly notes: string;

    /**
     * Vento templates and partials.
     */
    readonly views: string;

    /**
     * Files copied to the output unchanged, such as the favicon.
     */
    readonly public: string;

    /**
     * The built site Cloudflare serves as static assets. Emptied at the start of every build.
     */
    readonly output: string;
  };
}
