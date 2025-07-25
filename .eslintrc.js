module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    project: "./tsconfig.json",         // ➊ подключаем TS-схему для DOM-типов
    tsconfigRootDir: __dirname,
  },
  env: {
    browser: true,                       // ➋ включаем DOM-глобалы
    es2021: true,
    node: true,                          // чтобы module.exports не пинался
  },
  settings: {
    react: { version: "detect" },
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking", // ➌ включает правила, работающие с type-info
  ],
  rules: {
    "no-undef": "off",                    // ➍ убираем проверку undefined (TS-компилятор сам всё отловит)
    // use TS-версию правила вместо базового
    "@typescript-eslint/no-explicit-any": ["warn", { "fixToUnknown": true }],
    "@typescript-eslint/no-unused-vars": ["error", {
      "vars": "all", "args": "after-used", "ignoreRestSiblings": true,
      "varsIgnorePattern": "^_",
      "argsIgnorePattern": "^_"
    }],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": ["warn"],
  },
}; 