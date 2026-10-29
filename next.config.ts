import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // 契约里后端路径已带 /api 前缀，这里只做同源转发、不改写路径。
        // 刻意写 127.0.0.1 而非 localhost：本机 localhost 可能优先解析到 ::1，
        // 与后端 IPv4 监听错位会导致转发超时。
        source: "/api/:path*",
        destination: "http://127.0.0.1:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;
