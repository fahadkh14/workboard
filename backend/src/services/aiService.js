// Abstraction layer for the AI provider. Swap this out for a real provider
// (Anthropic, OpenAI, etc.) by reading process.env.AI_PROVIDER / AI_API_KEY.
// Kept provider-agnostic so the rest of the app never talks to a vendor SDK directly.

export async function generateAssistantReply({ message, context }) {
  const provider = process.env.AI_PROVIDER;
  const apiKey = process.env.AI_API_KEY;

  if (!provider || !apiKey) {
    return fallbackReply(message, context);
  }

  // Real provider integration would live here, e.g.:
  // if (provider === "anthropic") { ...call the Anthropic API with apiKey... }
  return fallbackReply(message, context);
}

function fallbackReply(message, context) {
  const { taskCount = 0, overdueCount = 0, projectCount = 0 } = context || {};
  const lower = message.toLowerCase();

  if (lower.includes("summar")) {
    return `You have ${taskCount} open tasks across ${projectCount} projects, with ${overdueCount} overdue. Want me to prioritize what to tackle first?`;
  }
  if (lower.includes("plan")) {
    return `Here's a simple plan: clear anything overdue first (${overdueCount} right now), then focus on your highest-priority task for a deep-work block, and leave routine items for later in the day.`;
  }
  return `I can help you summarize your tasks, plan your day, or draft an update — just tell me what you need. (Connect an AI provider in your environment settings for richer answers.)`;
}
