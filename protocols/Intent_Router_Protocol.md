# Intent Router Protocol (v3.0)

> **Status:** Stable-Preview
> **Purpose:** Define the "Spinal Cord" logic that routes UI-triggered actions to the appropriate processing unit.

## 1. 路由核心概念 (The Routing Core)

本協議確保 Agent 發出的 UI 指令在產生使用者回饋後，能精確回傳至對應的處理路徑。

### 1.1 路由類型定義 (Routing Types)

| 路由標籤 | 處理主體 | 響應性質 | 典型範例 |
| :--- | :--- | :--- | :--- |
| **LOCAL** | Frontend Middleware | 即時/同步 | 切換 Tab、關閉彈窗、前端表單校驗。 |
| **AGENT** | AI Decision Engine | 異步/推理 | "根據此數據重新生成報表"、"分析異常原因"。 |
| **SYSTEM** | External API / DB | 副作用執行 | 執行支付、寫入資料庫、發送硬體指令。 |

## 2. 數據封裝結構 (The Intent Envelope)

所有從 ProtocolRenderer 發出的 Action 必須封裝為以下 JSON 格式：

```json
{
  "protocol": "v3.0/intent",
  "metadata": {
    "action_id": "UNIQUE_ACTION_ID",
    "timestamp": 1707206400,
    "source_component": "Standard_Table"
  },
  "routing": {
    "type": "AGENT | SYSTEM | LOCAL",
    "require_confirmation": false,
    "fallback_action": "RETRY"
  },
  "payload": {
    "handler": "target_service_name",
    "data": {
      "key": "value"
    }
  }
}
```

## 3. 狀態流轉協議 (State Loop)

1.  **Emit**: UI 組件根據 `Component_Registry_Protocol` 觸發事件。
2.  **Route**: Router 根據 `routing.type` 導向路徑。
3.  **Resolve**: 處理器完成任務，回傳 `UI_PROTOCOL JSON` 或 `NOTIFICATION`。
4.  **Update**: Renderer 接收新 JSON，局部或全部更新 UI。
