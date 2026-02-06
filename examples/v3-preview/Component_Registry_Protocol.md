# Component Registry Protocol (v3.0-preview)

> **The "Menu" of Available UI Elements.**
> How the Agent discovers what it can render on the user's screen.

## 1. The Registry Schema

The Frontend MUST expose a `registry.json` endpoint that the Agent can query to understand available capabilities.

### Example `registry.json`
```json
{
  "version": "1.0.0",
  "components": {
    "Standard_Table": {
      "description": "A sortable, paginated table for data display.",
      "props": {
        "columns": { "type": "array", "required": true },
        "data": { "type": "array", "required": true },
        "actions": { "type": "array", "description": "Buttons per row" }
      }
    },
    "Data_Card": {
      "description": "A KPI card with an optional trend indicator.",
      "props": {
        "title": { "type": "string", "required": true },
        "value": { "type": "string", "required": true },
        "trend": { "type": "enum", "options": ["up", "down", "neutral"] }
      }
    },
    "Input_Form": {
      "description": "A form for collecting user input.",
      "props": {
        "fields": { "type": "array", "required": true },
        "submit_label": { "type": "string", "default": "Submit" }
      }
    }
  }
}
```

## 2. Agent Usage Pattern

Before generating a UI response, the Agent should:
1.  **Recall** the registry from its memory/context.
2.  **Validate** that the intended component exists in the registry.
3.  **Conform** strictly to the defined `props` schema.

## 3. Dynamic Discovery

In a multi-client environment (e.g., Web vs Mobile), the Agent receives a `client_capabilities` header. 

*   **Web**: Supports `Standard_Table`.
*   **Mobile**: Supports `Simple_List` (Fallback for Table).

The Agent dynamically adjusts its output based on this handshake.
