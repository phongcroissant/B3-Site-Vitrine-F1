import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import babelParser from "@babel/eslint-parser";

export default [
  // dist/ = bundle de build ; supabase/functions = code Deno (runtime distinct,
  // typé TS) linté séparément. On les exclut du lint front-end.
  { ignores: ["dist/**", "coverage/**", "supabase/functions/**"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { react: pluginReact },
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
      },
      globals: globals.browser,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
  // Scripts de test de charge k6 : runtime distinct exposant des globales
  // propres (__ENV, __VU, __ITER) que le runtime navigateur ne connaît pas.
  {
    files: ["load-tests/**/*.js"],
    languageOptions: {
      globals: {
        __ENV: "readonly",
        __VU: "readonly",
        __ITER: "readonly",
      },
    },
  },
];