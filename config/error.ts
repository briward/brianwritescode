import type { Config } from "@raptor-js/error";

export default {
  /**
   * @inheritdoc
   *
   * Production pages never show stack traces to visitors.
   */
  env: "production",
} satisfies Config;
