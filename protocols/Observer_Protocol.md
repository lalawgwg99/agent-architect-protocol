# Observer Protocol (v3.0)

> **Status:** Stable-Preview
> **Purpose:** Standardize system observability to enable self-monitoring dashboards.

## 1. 核心理念

觀察者協議遵循 **「反射層 (Reflective Layer)」** 原則，系統透過 V3.0 UI 協議來監控自身狀態，實現架構自洽性 (Self-referential)。

## 2. 數據結構 (System Snapshot)

監控系統接收的標準狀態快照 JSON：

```json
{
  "protocol": "v3.0/observer",
  "timestamp": 1707213600,
  "system_state": {
    "agents": [
      {
        "id": "agent_alpha",
        "role": "Architect",
        "status": "thinking",
        "task": "Designing V4 Protocol",
        "model": "Claude-4.5"
      },
      {
        "id": "agent_beta",
        "role": "Executor",
        "status": "idle",
        "last_active": "2m ago"
      }
    ],
    "queue": {
      "depth": 3,
      "top_priority": "CRITICAL"
    },
    "telemetry": {
      "intent_throughput": "12/min",
      "error_rate": "0.1%"
    }
  }
}
```

## 3. 專屬監控組件 (Monitoring Components)

除了標準 UI 組件，Observer Dashboard 使用以下專用組件：

1.  **`Agent_Status_Grid`**: 顯示 Agent 蜂群的即時狀態卡片。
2.  **`Intent_Timeline`**: 垂直時間軸，顯示 `IntentRouter` 的決策軌跡。
3.  **`Metric_Gauge`**: 環形或線性儀表，顯示隊列深度與健康度。
