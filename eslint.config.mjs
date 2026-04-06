import nextConfig from "eslint-config-next"

const tsConfig = Array.from(nextConfig).find((c) => c.plugins?.["@typescript-eslint"])

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...nextConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { "@typescript-eslint": tsConfig?.plugins["@typescript-eslint"] },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      // Hydration guard pattern (setMounted in useEffect) is intentional throughout the codebase
      "react-hooks/set-state-in-effect": "warn"
    }
  }
]

export default eslintConfig
