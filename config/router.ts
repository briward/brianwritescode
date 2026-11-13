import type { Config } from "@raptor-js/router";

export default {
  /**
   * @inheritdoc
   *
   * The router is the last thing a request reaches, so a miss is a 404.
   */
  throwNotFound: true,

  /**
   * @inheritdoc
   *
   * None yet: every page is a static asset.
   */
  routes: [],
} satisfies Config;
