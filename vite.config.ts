import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  preview: {
    port: 5173, // e2eテストのためにdevと同じポートにする
  },
  plugins: [react(), tailwindcss()],
});
