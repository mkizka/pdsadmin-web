import { mkizka } from "@mkizka/eslint-config";
import reactRefresh from "eslint-plugin-react-refresh";

export default [...mkizka, reactRefresh.configs.vite];
