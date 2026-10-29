import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

/**
 * 测试环境只服务组件测试：JSX 由 plugin-react 转译，
 * 不再挂 Vite 的开发/构建能力（那部分已交给 Next.js）。
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
  },
});
