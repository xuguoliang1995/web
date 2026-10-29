"use client";

import { useEffect, useState } from "react";
import { fetchHealth } from "../api/client";

type ConnectionState = "checking" | "ok" | "error";

/** 超过该时长未响应即视为不可达，避免页面长时间停在"检查中" */
const HEALTH_TIMEOUT_MS = 5000;

/**
 * 后端连通状态：一次探针、三态呈现。
 *
 * 刻意只在挂载时探一次（不轮询）——对应 health-check 主规约，
 * 轮询属新能力，应另开变更。
 */
export function HealthStatus() {
  const [connection, setConnection] = useState<ConnectionState>("checking");

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);

    fetchHealth(controller.signal)
      .then(() => setConnection("ok"))
      .catch(() => setConnection("error"))
      .finally(() => clearTimeout(timeoutId));

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  return (
    <>
      {connection === "checking" && <p>正在检查后端连通状态…</p>}
      {connection === "ok" && <p>后端连通</p>}
      {connection === "error" && <p>后端连接异常</p>}
    </>
  );
}
