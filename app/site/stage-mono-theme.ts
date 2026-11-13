import type { ThemeRegistrationRaw } from "shiki";

/**
 * The four greys of the monochrome code theme, matched to stage.sgail.com's `stage-mono`.
 */
const GREY = {
  /**
   * Punctuation and comments: the quietest text.
   */
  Faint: "#62666D",

  /**
   * Keywords, variables, numbers and operators: the default text.
   */
  Base: "#8A8F98",

  /**
   * Types, classes and function names.
   */
  Bright: "#D0D6E0",

  /**
   * Strings: the brightest text.
   */
  White: "#F7F8F8",
} as const;

/**
 * Which grey each kind of token gets. The first rule, with no scope, is the default.
 */
const TOKEN_RULES: ThemeRegistrationRaw["settings"] = [
  {
    settings: { foreground: GREY.Base },
  },
  {
    scope: [
      "punctuation",
      "meta.brace",
      "punctuation.definition.string",
      "punctuation.definition.template-expression",
      "meta.decorator punctuation.decorator",
    ],
    settings: { foreground: GREY.Faint },
  },
  {
    scope: ["comment", "punctuation.definition.comment", "string.quoted.docstring"],
    settings: { foreground: GREY.Faint, fontStyle: "italic" },
  },
  {
    // Doc tags and the names they describe (`@param data`) read one step up from the comment.
    scope: [
      "comment storage.type",
      "comment keyword",
      "comment variable",
      "comment entity.name.type",
      "comment.block.documentation variable.other",
    ],
    settings: { foreground: GREY.Base, fontStyle: "italic" },
  },
  {
    scope: [
      "entity.name.function",
      "support.function",
      "meta.function-call entity.name.function",
      "entity.name.type",
      "entity.name.class",
      "entity.other.inherited-class",
      "support.type",
      "support.class",
      "entity.name.tag",
      "entity.name.function.macro",
    ],
    settings: { foreground: GREY.Bright },
  },
  {
    scope: ["string", "string.template", "markup.inline.raw"],
    settings: { foreground: GREY.White },
  },
];

/**
 * A monochrome Shiki theme in the style of stage.sgail.com: names stand out by brightness, not
 * colour. The block background comes from the site's CSS, so it is left out here.
 *
 * The rules sit under both keys on purpose: Shiki reads `settings`, and rehype-pretty-code only
 * treats an object as a theme when it has `tokenColors`.
 */
const stageMonoTheme: ThemeRegistrationRaw = {
  name: "stage-mono",
  type: "dark",
  settings: TOKEN_RULES,
  tokenColors: TOKEN_RULES,
};

export default stageMonoTheme;
