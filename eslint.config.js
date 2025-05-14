import { configs } from "@mkizka/eslint-config";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  // https://typescript-eslint.io/getting-started/typed-linting/
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  ...configs.typescript(),
  ...configs.react(),
  reactRefresh.configs.vite,
];
