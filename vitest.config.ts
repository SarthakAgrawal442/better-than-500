import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/test.ts"], // Re-enable setup file with global mocks
    css: true,
    include: ["src/test/**/*.{test,spec}.{js,ts,tsx}"],
    exclude: ["src/test/setup.ts", "src/test/test.ts"], // Exclude setup files
  },
});
