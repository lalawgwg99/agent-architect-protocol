/**
 * AgentPoolManager.js
 * Core Responsibility: Managing the roster of specialized agents and handling task delegation.
 * This is the "HR Department" of your virtual AI organization.
 */

export class AgentPoolManager {
  constructor() {
    this.agents = new Map(); // Stores specialized agent instances
  }

  /**
   * Register a new agent role in the pool
   * @param {string} role - The role identifier (e.g., 'senior_manager', 'risk_auditor')
   * @param {Object} agentInstance - The initialized agent class or API wrapper
   */
  registerAgent(role, agentInstance) {
    this.agents.set(role, agentInstance);
    console.log(`[AgentPool] Role registered: ${role}`);
  }

  /**
   * Delegate a task to a specific role based on Handover Protocol
   * @param {string} role - Target role from the handover intent
   * @param {Object} context - The context snapshot from the previous agent
   */
  async delegate(role, context) {
    const targetAgent = this.agents.get(role);
    
    if (!targetAgent) {
      console.error(`[AgentPool] Critical: Target role '${role}' not found in pool.`);
      throw new Error(`Agent role '${role}' unavailable.`);
    }

    console.log(`[AgentPool] 🔄 Delegating task trace ${context.metadata?.trace_id || 'unknown'} to: ${role}`);
    
    // Inject context to ensure continuity (No amnesia)
    // The target agent will process this as a continued conversation
    return await targetAgent.process({
      ...context,
      system_instruction: `You are taking over a task. Previous context: ${JSON.stringify(context.context_snapshot)}`
    });
  }
}
