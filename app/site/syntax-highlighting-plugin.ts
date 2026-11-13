import { CompilerPlugin } from "@raptor-js/pages";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";

import stageMonoTheme from "./stage-mono-theme.ts";

/**
 * Colours code blocks at build time with Shiki in the monochrome stage-mono theme, so pages ship
 * highlighted HTML and no highlighter script (ADR 0003).
 */
export default class SyntaxHighlightingPlugin extends CompilerPlugin<undefined> {
  /**
   * The key the plugin's data would sit under in templates. It collects none.
   */
  public key = "syntaxHighlighting";

  /**
   * @constructor
   */
  constructor() {
    super();

    const options: Options = {
      theme: stageMonoTheme,
      keepBackground: false,
    };

    this.registerRehype([rehypePrettyCode, options]);
  }

  /**
   * @inheritdoc
   *
   * @returns Nothing: the plugin only changes the HTML.
   */
  public getData(): undefined {
    return undefined;
  }

  /**
   * @inheritdoc
   */
  public reset(): void {}
}
