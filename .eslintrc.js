module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'plugin:@next/next/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    "react/jsx-no-target-blank": "off",
    "react/no-unescaped-entities": "off",
    "@next/next/no-img-element": "off",
    "jsx-a11y/alt-text": "off"
  },
};
