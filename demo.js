const Agent = require('./core/Agent');

/**
 * The Proof of Concept Demo
 * Run this to see the Sovereign Agent think, route, and act.
 */

async function main() {
  console.log("🦞 Awakening the Sovereign Agent...\n");

  const uuzero = new Agent({
    id: "uuzero-v2",
    role: "Evolutionary Architect"
  });

  const tasks = [
    "Hello! Who are you?", // Simple task -> L1
    "Analyze the structural advantage of using a decentralized identity protocol for AI agents. Provide a strategic breakdown.", // Complex task -> L2
    "Write a Python script to calculate Fibonacci sequence." // Code task -> L1/L2
  ];

  for (const task of tasks) {
    console.log("--------------------------------------------------");
    try {
      const result = await uuzero.process(task);
      console.log(`\n✅ Output (${result.model_used}):`);
      console.log(result.output.trim());
    } catch (e) {
      console.error("❌ Task Failed:", e.message);
    }
    console.log("--------------------------------------------------\n");
  }
}

main();
