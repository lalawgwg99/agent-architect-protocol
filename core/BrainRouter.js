import { GoogleGenAI } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";
import fs from 'fs';
import path from 'path';

/**
 * Real Brain Router Implementation (ESM)
 * Handles cognitive switching between L1 (Gemini) and L2 (Claude).
 */

export default class BrainRouter {
  constructor(config = {}) {
    // Load keys from env
    this.geminiKey = process.env.GEMINI_API_KEY;
    this.anthropicKey = process.env.ANTHROPIC_API_KEY;
    
    // Initialize clients
    if (this.geminiKey) this.gemini = new GoogleGenAI({ apiKey: this.geminiKey });
    if (this.anthropicKey) this.anthropic = new Anthropic({ apiKey: this.anthropicKey });
    
    this.threshold = config.complexityThreshold || 0.7;
  }

  async route(prompt, context = {}) {
    const complexity = await this.estimateComplexity(prompt);
    console.log(`[Router] Complexity Score: ${complexity.toFixed(2)}`);

    if (complexity > this.threshold && this.anthropic) {
      return await this.callL2(prompt, context);
    }
    return await this.callL1(prompt, context);
  }

  async estimateComplexity(prompt) {
    let score = 0.2;
    if (prompt.length > 500) score += 0.3;
    if (/code|function|class|api|debug/i.test(prompt)) score += 0.3;
    if (/strategy|plan|architect|analyze/i.test(prompt)) score += 0.4;
    return Math.min(score, 1.0);
  }

  async callL1(prompt, context) {
    console.log("⚡ L1 (Gemini Flash) Activated");
    try {
      const model = this.gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(this._buildSystemPrompt(context) + "\n" + prompt);
      return {
        model: "gemini-1.5-flash",
        output: result.response.text(),
        cost_tier: "low"
      };
    } catch (e) {
      console.error("L1 Failed:", e.message);
      throw e;
    }
  }

  async callL2(prompt, context) {
    console.log("🧠 L2 (Claude Sonnet) Activated");
    try {
      const msg = await this.anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 4096,
        system: this._buildSystemPrompt(context),
        messages: [{ role: "user", content: prompt }]
      });
      return {
        model: "claude-3-5-sonnet",
        output: msg.content[0].text,
        cost_tier: "high"
      };
    } catch (e) {
      console.error("L2 Failed:", e.message);
      console.log("⚠️ Fallback to L1...");
      return this.callL1(prompt, context);
    }
  }

  _buildSystemPrompt(context) {
    let soul = "";
    if (context.soulPath && fs.existsSync(context.soulPath)) {
      soul = fs.readFileSync(context.soulPath, 'utf8');
    }
    return `[SYSTEM IDENTITY]\n${soul}\n\n[TASK]\n`;
  }
}
