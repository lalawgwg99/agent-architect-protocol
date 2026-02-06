require('dotenv').config();
const { routeRequest } = require('./router');

class Agent {
  constructor(config = {}) {
    this.id = config.id || 'sovereign-agent';
    this.role = config.role || 'Generalist';
    this.memory = [];
    this.soul = config.soul || null;
  }

  async process(input) {
    console.log(` [${this.role}] 處理輸入: "${input.substring(0, 50)}..."`);

    try {
      const result = await routeRequest(input, { 
        agentId: this.id, 
        role: this.role, 
        history: this.memory 
      });
      
      // 儲存到記憶
      this.memory.push({
        input,
        output: result.response,
        model: result.model,
        timestamp: Date.now()
      });

      return { 
        model_used: result.model, 
        output: result.response 
      };
    } catch (error) {
      console.error(`[${this.role}] 錯誤:`, error.message);
      throw error;
    }
  }

  getMemory() {
    return this.memory;
  }

  clearMemory() {
    this.memory = [];
  }
}

module.exports = Agent;
