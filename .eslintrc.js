module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true,
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
  ],
  rules: {
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/quotes": ["error", "double"],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-extraneous-class": "off",
  },
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
}