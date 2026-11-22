import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import babelParser from "@babel/eslint-parser";

export default [
  // .next/ et dist/ = builds ; supabase/functions = code Deno (runtime distinct,
  // typé TS) linté séparément. On les exclut du lint front-end.
  { ignores: [".next/**", "dist/**", "coverage/**", "supabase/functions/**", "*.config.*", "next-env.d.ts"] },
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
      // Composants serveur (process.env) et client (window) dans le même projet.
      globals: { ...globals.browser, ...globals.node },
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