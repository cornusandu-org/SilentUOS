import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import tsParser from "@typescript-eslint/parser";

export default defineConfig([
  {
    files: ["**/*.d.ts"],
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off"
    }
  },
  
  { 
    files: ["**/*.{js,mjs,cjs}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { 
      globals: {
        ...globals.node,
        USI: "readonly",
        main: "writable" 
      } 
    } 
  },
  
  {
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error"
    }
  }
]);
