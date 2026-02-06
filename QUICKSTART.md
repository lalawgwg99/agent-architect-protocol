# 🚀 Quick Start Guide

> **From Zero to Sovereign Agent in 30 Seconds.**

## Prerequisites
- **Node.js** (v18 or higher)
- **API Keys**: Google Gemini (Free tier works!) and/or Anthropic Claude.

---

## ⚡ The 3-Step Launch

### 1. Clone the Protocol
```bash
git clone https://github.com/lalawgwg99/agent-architect-protocol.git
cd agent-architect-protocol
```

### 2. Auto-Deploy (Recommended)
We provide a one-click setup script that handles dependencies and environment config:
```bash
chmod +x deploy.sh
./deploy.sh
```
*Follow the prompts to enter your API keys.*

### 3. Run the Demo Agent
Witness the **Brain Router** in action as it switches between L1 (Gemini) and L2 (Claude) based on task complexity:
```bash
npm start
```

---

## 👀 What You Will See

```text
🦞 Awakening the Sovereign Agent...

--------------------------------------------------
[Generalist] Processing input: "Hello! Who are you?"

⚡ L1 Router: Analyzing complexity...
[Router] Complexity Score: 0.20
⚡ L1 Handling (Score: 0.20). Routing to Gemini...
⚡ L1 (Gemini Flash) Activated

✅ Output (gemini-1.5-flash):
I am an instance of the Sovereign Agent Protocol...
--------------------------------------------------

[Generalist] Processing input: "Analyze the structural advantage..."

⚡ L1 Router: Analyzing complexity...
[Router] Complexity Score: 0.90
🧠 L2 Activated (Score: 0.90). Routing to Claude...
🧠 L2 (Claude Sonnet) Activated

✅ Output (claude-3-5-sonnet):
To analyze the structural advantage, we must look at the protocol layer...
--------------------------------------------------
```

## 🛠️ Next Steps

1.  **Modify Identity**: Edit `protocols/identity.yaml` to change your agent's personality.
2.  **Build UI**: Check `examples/v3-preview/` to see how to render the agent's output.
3.  **Scale**: Run `examples/python_agent_swarm.py` to deploy a multi-agent swarm.
