# Standard UI Action Protocol (v3.0-preview)

> **The "Handshake" between Agent Intelligence and UI Execution.**
> How agents control interface state without writing executable code.

## 1. The Core Philosophy

**Separation of Concerns**: 
- **Agent**: Owns the *Intent* (What should happen next?)
- **Frontend**: Owns the *Implementation* (How does it look?)
- **Protocol**: The bridge that carries the intent.

---

## 2. The Action Schema

Every interactive element (Button, Form, Toggle) emitted by the Agent MUST adhere to this schema.

### 2.1 The Emitted JSON (Agent -> UI)

When an Agent wants to render a button that triggers an action:

```json
{
  "type": "component",
  "component": "ActionPanel",
  "props": {
    "title": "Arbitrage Risk Alert",
    "actions": [
      {
        "id": "act_adjust_price_v15",
        "label": "Adjust Price (-5%)",
        "variant": "primary",
        "intent": {
          "type": "server_action",
          "handler": "pricing_agent",
          "payload": { "sku": "DYSON-V15", "adjustment": -0.05 }
        }
      }
    ]
  }
}
```

### 2.2 The Callback JSON (UI -> Agent)

When the user clicks that button, the Frontend sends this **exact** payload back to the Agent system:

```json
{
  "protocol": "v3.0",
  "event": "action_triggered",
  "timestamp": 1707206400,
  "action_id": "act_adjust_price_v15",
  "context": {
    "user_id": "user_123",
    "session_id": "sess_abc"
  },
  "payload": { "sku": "DYSON-V15", "adjustment": -0.05 }
}
```

---

## 3. State Transitions (The Loop)

Upon receiving the Callback JSON, the Agent determines the next state.

**Scenario**: Price adjusted successfully.

**Agent Response (New UI State)**:
```json
{
  "type": "state_update",
  "target_component_id": "ActionPanel",
  "operation": "replace",
  "content": {
    "component": "SuccessCard",
    "props": {
      "message": "Price updated to $499. Margin secured.",
      "icon": "check-circle"
    }
  }
}
```

---

## 4. Error Handling

If the Agent cannot execute the action (e.g., API failure):

**Agent Response (Error State)**:
```json
{
  "type": "toast",
  "level": "error",
  "message": "Pricing API unavailable. Retrying in 5s..."
}
```
