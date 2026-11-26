import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended, prettier],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
  {
    // Generated design screens carry `@ts-nocheck`: they are written under the
    // design phase's JS runtime contract, not as hand-written TypeScript.
    files: ["src/screens/**"],
    rules: { "@typescript-eslint/ban-ts-comment": "off" },
  },
  {
    // The generated schema is the generator's output, not code to lint.
    ignores: ["src/api/schema.ts"],
  },
  {
    // The API is called only through the generated client (src/api/), so a field renamed
    // on the server fails the type check, not a screen. Tests may stub fetch.
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/api/**", "src/**/*.test.{ts,tsx}", "src/test-setup.ts"],
    rules: {
      "no-restricted-globals": [
        "error",
        {
          name: "fetch",
          message:
            "Call the API only through the generated client in src/api/client.ts (run `npm run gen:api` after a backend change).",
        },
      ],
      "no-restricted-properties": [
        "error",
        {
          object: "window",
          property: "fetch",
          message:
            "Call the API only through the generated client in src/api/client.ts (run `npm run gen:api` after a backend change).",
        },
        {
          object: "globalThis",
          property: "fetch",
          message:
            "Call the API only through the generated client in src/api/client.ts (run `npm run gen:api` after a backend change).",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "axios",
              message:
                "Call the API only through the generated client in src/api/client.ts (run `npm run gen:api` after a backend change).",
            },
            {
              name: "openapi-fetch",
              message:
                "Call the API only through the generated client in src/api/client.ts (run `npm run gen:api` after a backend change).",
            },
          ],
        },
      ],
    },
  },
);
