import js from "@eslint/js";

const globalsNode = {
  process: "readonly",
  console: "readonly",
  URL: "readonly",
  Buffer: "readonly",
  __dirname: "readonly",
  __filename: "readonly",
  structuredClone: "readonly",
};

const globalsJest = {
  describe: "readonly",
  test: "readonly",
  it: "readonly",
  expect: "readonly",
  beforeEach: "readonly",
  afterEach: "readonly",
  beforeAll: "readonly",
  afterAll: "readonly",
  jest: "readonly",
};

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globalsNode,
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "indent": ["error", 2],
    },
  },
  {
    files: ["tests/**/*.js", "tests/**/*.test.js"],
    languageOptions: {
      globals: { ...globalsNode, ...globalsJest },
    },
  },
];
