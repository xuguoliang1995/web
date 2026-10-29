import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchHealth } from "../api/client";
import { HealthStatus } from "./health-status";

vi.mock("../api/client", () => ({
  fetchHealth: vi.fn(),
}));

const mockedFetchHealth = vi.mocked(fetchHealth);

/**
 * 对应 spec「前端连通状态展示」的三个观察点：
 * 初始先给出「检查中」，后端可达展示连通，请求失败/超时展示异常——
 * 任何时刻都不允许出现空白或崩溃。
 */
describe("HealthStatus 的后端连通状态展示", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("首次渲染先展示检查中提示", () => {
    // 挂起不返回，锁定「尚未出结果」的中间态。
    mockedFetchHealth.mockReturnValue(new Promise<never>(() => {}));

    render(<HealthStatus />);

    expect(screen.getByText("正在检查后端连通状态…")).toBeInTheDocument();
  });

  it("后端返回 ok 后展示连通提示", async () => {
    mockedFetchHealth.mockResolvedValue({ status: "ok" });

    render(<HealthStatus />);

    expect(await screen.findByText("后端连通")).toBeInTheDocument();
  });

  it("请求失败时展示异常提示", async () => {
    mockedFetchHealth.mockRejectedValue(new Error("network down"));

    render(<HealthStatus />);

    expect(await screen.findByText("后端连接异常")).toBeInTheDocument();
  });
});
