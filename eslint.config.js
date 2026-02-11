// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const eslintPluginTemplate = require("@angular-eslint/eslint-plugin-template");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      ...angular.configs.tsRecommended,
    ],
    plugins: { "@angular-eslint-template": eslintPluginTemplate },
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      // "@typescript-eslint/member-ordering": [
      //   "warn",
      //   {
      //     default: {
      //       order: "alphabetically-case-insensitive",
      //     },
      //   },
      // ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      "@angular-eslint/template/attributes-order": ["error"],
    },
  },
);
