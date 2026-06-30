import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    ignores: [
      "node_modules/",
      "playwright-report/",
      "test-results/"
    ]
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        process: "readonly",
        console: "readonly"
      }
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }]
    }
  },
  {
    files: ["tests/non-functional/performance/k6/**/*.js"],
    languageOptions: {
      globals: {
        __ENV: "readonly"
      }
    }
  }
];
