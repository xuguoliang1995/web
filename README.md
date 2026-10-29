# apps/web

前端可部署单元：**Next.js 16（App Router）+ React 19 + TypeScript（strict）**。
只做前端渲染，不用 SSR 取数——数据全部来自 `apps/api`。

选型依据见 `docs/decisions/0004-adopt-typescript-fullstack.md`。

## 开发

```bash
npm install                          # 在仓库根执行，一次装好所有 workspace
npm run dev --workspace apps/web     # 默认 http://localhost:3000
```

dev server 通过 `next.config.ts` 的 rewrite 把 `/api/*` 转发到 `http://127.0.0.1:8080`，
因此需要后端同时运行。目标刻意写 `127.0.0.1` 而非 `localhost`：本机 `localhost`
优先解析到 `::1`，与后端 IPv4 监听错位会表现为连接超时。

## 脚本

| 命令 | 作用 |
| --- | --- |
| `npm run dev --workspace apps/web` | 启动 dev server |
| `npm run test --workspace apps/web` | Vitest + Testing Library |
| `npm run typecheck --workspace apps/web` | `tsc --noEmit` |
| `npm run build --workspace apps/web` | `next build`（内含类型检查） |
| `npm run codegen --workspace apps/web` | 由 `contracts/openapi.json` 重新生成 `src/api/schema.d.ts` |

`src/api/schema.d.ts` 是**生成物**，不要手改——改了下一次 `codegen` 就丢，
且 `scripts/verify.sh` 的 `contract:frontend` 阶段会判红。

## 目录

- `src/app/` —— App Router 入口（`layout.tsx` / `page.tsx`，服务端组件）
- `src/components/` —— 交互组件（如 `health-status.tsx`，标 `"use client"`）
- `src/api/` —— 契约派生类型与 fetch 封装

## 边界

- 不直接连数据库；数据一律经 `apps/api`
- 不手写后端 API 类型，类型全部由契约派生
- 只依赖 `packages/shared`（类型与纯函数）与本包内部模块
