/**
 * IntentRouter.js
 * Core Responsibility: Dispatch intents and manage asynchronous state.
 * This is the "Spinal Cord" of the system.
 */

export class IntentRouter {
  constructor(agentHandler, apiHandler, uiStateManager) {
    this.agent = agentHandler; // AI reasoning endpoint
    this.api = apiHandler;     // System API endpoint
    this.ui = uiStateManager;  // UI State Manager (e.g., React State / Redux)
  }

  /**
   * Dispatch Entry Point
   * @param {Object} intentPayload - JSON conforming to Intent_Router_Protocol
   */
  async dispatch(intentPayload) {
    const { routing, payload, metadata } = intentPayload;
    console.log(`[Router] Dispatching: ${metadata.action_id} via ${routing.type}`);

    try {
      let result;

      switch (routing.type) {
        case 'LOCAL':
          result = this.handleLocal(payload);
          break;
        case 'AGENT':
          // Call the Brain for next steps
          this.ui.setLoading(true);
          result = await this.agent.process(payload);
          this.ui.setLoading(false);
          break;
        case 'SYSTEM':
          // Call System API for side effects
          result = await this.api.execute(payload.handler, payload.data);
          break;
        default:
          throw new Error(`Invalid routing type: ${routing.type}`);
      }

      // If the result contains a new UI protocol, trigger a re-render
      if (result && result.component) {
        this.ui.update(result);
      }

      return { status: 'success', metadata };
    } catch (error) {
      console.error(`[Router] Error:`, error);
      this.ui.notify({ type: 'error', message: error.message });
      return { status: 'error', error: error.message };
    }
  }

  handleLocal(payload) {
    // Example: Handle simple UI state changes like tab switching
    // In a real app, this might dispatch to a Redux reducer
    return { type: 'LOCAL_STATE_CHANGE', payload };
  }
}
