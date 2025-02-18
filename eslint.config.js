import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    rules: {
      "prefer-const": "warn",
      "no-constant-binary-expression": "error",
      "no-unused-vars": "error",
      camelcase: "error",
      quotes: ["error", "single"],
      "no-duplicate-imports": "error",
      "no-empty-function": "error",
    },
  },
  eslintPluginPrettierRecommended,
];