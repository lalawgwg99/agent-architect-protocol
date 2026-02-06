require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Anthropic = require("@anthropic-ai/sdk").default;

const CONFIG = {
  L1_MODEL: "gemini-1.5-flash",
  L2_MODEL: "claude-3-5-sonnet-20240620", // Fallback to 3.5 if 4.0 not available via API yet
  COMPLEXITY_THRESHOLD: 0.6
};

// 初始化 API 客戶端 (延遲初始化)
let gemini = null;
let anthropic = null;

function initClients() {
  if (!gemini && process.env.GOOGLE_API_KEY) {
    gemini = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }
  if (!anthropic && process.env.ANTHROPIC_API_KEY) {
    anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
}

async function routeRequest(prompt, context = {}) {
  initClients();
  console.log("⚡ L1 Router: 分析複雜度...");
  
  const complexityScore = estimateComplexity(prompt);
  console.log(`[Router] 複雜度分數: ${complexityScore.toFixed(2)}`);

  if (complexityScore > CONFIG.COMPLEXITY_THRESHOLD) {
    console.log(`🧠 L2 啟動 (分數: ${complexityScore.toFixed(2)}). 路由到 Claude...`);
    return await callL2(prompt, context);
  } else {
    console.log(`⚡ L1 處理 (分數: ${complexityScore.toFixed(2)}). 路由到 Gemini...`);
    return await callL1(prompt, context);
  }
}

function estimateComplexity(prompt) {
  let score = 0.1;
  // 長度因素
  if (prompt.length > 100) score += 0.1;
  if (prompt.length > 300) score += 0.15;
  if (prompt.length > 500) score += 0.15;
  
  // 策略性關鍵字
  if (/strategy|architect|analyze|分析|策略|設計|規劃|optimize|評估/.test(prompt.toLowerCase())) {
    score += 0.35;
  }
  // 程式碼相關
  if (/code|debug|程式|function|class|implement|實作/.test(prompt.toLowerCase())) {
    score += 0.25;
  }
  // 創意性任務
  if (/create|design|創作|寫|generate|發想/.test(prompt.toLowerCase())) {
    score += 0.15;
  }
  
  return Math.min(score, 1.0);
}

// Gemini API 呼叫
async function callL1(prompt, context) {
  if (!gemini) {
    throw new Error("GOOGLE_API_KEY 未設定");
  }
  console.log("⚡ L1 (Gemini Flash) 執行中...");
  try {
    const model = gemini.getGenerativeModel({ model: CONFIG.L1_MODEL });
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return { model: CONFIG.L1_MODEL, response };
  } catch (error) {
    console.error("L1 錯誤:", error.message);
    throw error;
  }
}

// Claude API 呼叫
async function callL2(prompt, context) {
  if (!anthropic) {
    throw new Error("ANTHROPIC_API_KEY 未設定");
  }
  console.log("🧠 L2 (Claude Sonnet) 執行中...");
  try {
    const message = await anthropic.messages.create({
      model: CONFIG.L2_MODEL,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }]
    });
    return { model: CONFIG.L2_MODEL, response: message.content[0].text };
  } catch (error) {
    console.error("L2 錯誤:", error.message);
    throw error;
  }
}

module.exports = { routeRequest, estimateComplexity, CONFIG };
