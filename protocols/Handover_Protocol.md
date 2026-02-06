# Multi-Agent Handover Protocol (v3.0)

> **Status:** Stable-Preview
> **Purpose:** Define the standard format for task delegation between agents (Context Switching).

## 1. 核心理念

本協議定義了 Agent 之間「交接棒」的標準格式，確保上下文 (Context) 在轉移過程中不丟失，實現「權限委託 (Delegation)」與「層級遞歸 (Escalation)」。

## 2. 交接指令結構 (Handover Intent)

當 Agent A 判定需要交接時，回傳的標準 JSON 格式：

```json
{
  "protocol": "v3.0/handover",
  "metadata": {
    "source_agent_id": "junior_support_01",
    "trace_id": "tx_998877",
    "timestamp": 1707210000
  },
  "transfer": {
    "target_role": "senior_manager",
    "reason": "INSUFFICIENT_PERMISSION",
    "priority": "URGENT"
  },
  "context_snapshot": {
    "user_intent": "請求 50% 折扣",
    "previous_steps": ["驗證會員身份", "查詢歷史訂單"],
    "current_state": {
      "discount_requested": 0.5
    }
  }
}
```

## 3. 交接策略 (Strategies)

*   **Transparent (透明交接)**: 用戶無感，後台自動切換模型或角色。
*   **Notified (通知交接)**: UI 顯示「正在為您轉接至資深顧問...」。

## 4. 路由邏輯

`IntentRouter` 在接收到此協議時，應暫停 UI 渲染，將 `context_snapshot` 作為新 Prompt 的輸入，遞歸調用 `AgentPool` 中的 `target_role`。
