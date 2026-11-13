import js from "@eslint/js";
import tseslint from "typescript-eslint";
import jsdoc from "eslint-plugin-jsdoc";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: ["dist", ".wrangler", "node_modules"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { jsdoc },
    settings: {
      jsdoc: {
        tagNamePreference: { class: "constructor" },
      },
    },
    rules: {
      // House style: guard and return, never else (CODING.md).
      "no-restricted-syntax": [
        "warn",
        {
          selector: "IfStatement[alternate]",
          message: "Avoid else: return early or guard instead.",
        },
      ],

      // House style: a docblock on every declaration (CODING.md).
      "jsdoc/require-jsdoc": [
        "warn",
        {
          publicOnly: false,
          require: {
            ClassDeclaration: true,
            FunctionDeclaration: true,
            MethodDefinition: true,
          },
          contexts: [
            "TSInterfaceDeclaration",
            "TSTypeAliasDeclaration",
            "TSPropertySignature",
            "PropertyDefinition",
            "Program > VariableDeclaration",
            "ExportNamedDeclaration[declaration.type='VariableDeclaration']",
          ],
        },
      ],
      "jsdoc/require-param": "warn",
      "jsdoc/require-returns": "warn",
      "jsdoc/check-param-names": "warn",
      "jsdoc/check-tag-names": ["warn", { definedTags: ["inheritdoc"] }],
    },
  },
  {
    // Specs and tool config files are exempt from docblocks.
    files: ["**/*.spec.ts", "**/*.config.ts", "eslint.config.mjs"],
    rules: {
      "jsdoc/require-jsdoc": "off",
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",
    },
  },
  prettier,
);
