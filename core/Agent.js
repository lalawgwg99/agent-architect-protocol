const BrainRouter = require('./BrainRouter');
const fs = require('fs');
const path = require('path');

/**
 * The Sovereign Agent Entity
 * Integrates Soul, Brain, and Memory into a functional worker.
 */

class Agent {
  constructor(config = {}) {
    this.id = config.id || "agent-01";
    this.role = config.role || "Generalist";
    this.brain = new BrainRouter(config.routerConfig);
    this.memory = [];
    
    // Load SOUL (Identity Protocol)
    this.soulPath = config.soulPath || path.join(__dirname, '../protocols/identity.yaml');
    if (!fs.existsSync(this.soulPath)) {
      console.warn("⚠️ No SOUL found. Agent running in stateless mode.");
    }
  }

  async process(input) {
    console.log(`\n[${this.role}] Processing input: "${input.substring(0, 50)}..."`);
    
    // 1. Context Hydration
    const context = {
      soulPath: this.soulPath,
      history: this.memory.slice(-5) // Short-term memory window
    };

    // 2. Cognitive Routing (Brain)
    const result = await this.brain.route(input, context);

    // 3. Memory Consolidation
    this.memory.push({ role: 'user', content: input });
    this.memory.push({ role: 'assistant', content: result.output });

    return {
      agent_id: this.id,
      model_used: result.model,
      output: result.output,
      timestamp: Date.now()
    };
  }
}

module.exports = Agent;
