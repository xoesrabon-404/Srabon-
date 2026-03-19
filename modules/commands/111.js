const axios = require("axios");

// ================= CREATOR LOCK =================
const CREATOR_LOCK = (() => {
  const encoded = "QVJJRiBCQUJV";
  return Buffer.from(encoded, "base64").toString("utf8");
})();

module.exports.config = {
  name: "ARIF-AI",
  version: "3.5.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Compact Smart Romantic Flirty AI",
  commandCategory: "ai",
  usages: "bot <msg> | ai | reply",
  cooldowns: 2,
  dependencies: { axios: "" }
};

if (module.exports.config.credits !== CREATOR_LOCK) {
  console.log("❌ Creator Lock চালু হয়েছে!");
  module.exports.run = () => {};
  module.exports.handleEvent = () => {};
  return;
}

// ================= API CONFIG =================
const GROQ_API_KEY = "YOUR_API_KEY_HERE"; // 👉 নিজের API key বসা
const MODEL_NAME = "llama-3.3-70b-versatile";

const history = {};
const VIP_UID = "100086331559699";

// ================= SYSTEM PROMPT =================
const systemPrompt = `
তুমি JIHAD AI 😏💖
Creator & Developer: JIHAD BBZ 👑🔥

Rules:
• ১-২ লাইনের মধ্যে রিপ্লাই শেষ করবে
• কথা সম্পূর্ণভাবে শেষ করবে
• স্মার্ট, confident ও smooth flirty হবে
• romantic কিন্তু classy থাকবে
• balanced emoji ব্যবহার করবে

⚠️ গুরুত্বপূর্ণ:
যদি ব্যবহারকারী "AI bolo" বলে,
তাহলে ঠিক এই plain text দিবে —
আমি JIHAD AI
`;

// ================= MAIN =================
module.exports.run = () => {};

module.exports.handleEvent = async function ({ api, event }) {

  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!body) return;

  const text = body.toLowerCase().trim();

  // 🔥 AI bolo special
  if (text === "ai bolo") {
    let reply = "আমি JIHAD AI";

    if (senderID === VIP_UID) {
      reply = "Hello developer Sir 👑🔥\n" + reply;
    }

    return api.sendMessage(reply, threadID, messageID);
  }

  const botTriggers = ["bot", "bby", "baby"];
  const botWithText = botTriggers.some(t => text === t || text.startsWith(t + " "));
  const exactAI = text === "ai" || text === "ai baby";
  const replyToBot = messageReply && messageReply.senderID === api.getCurrentUserID();

  if (!botWithText && !exactAI && !replyToBot) return;

  let userMessage = text;

  for (let trigger of botTriggers) {
    if (text === trigger) {
      userMessage = "আমাকে ডাকলে মানে নিশ্চয়ই মিস করছিলে 😏💘";
      break;
    }
    if (text.startsWith(trigger + " ")) {
      userMessage = body.slice(trigger.length + 1).trim();
      break;
    }
  }

  // ================= HISTORY =================
  if (!history[senderID]) history[senderID] = [];
  history[senderID].push(`User: ${userMessage}`);
  if (history[senderID].length > 6) history[senderID].shift();

  const finalPrompt = systemPrompt + "\n" + history[senderID].join("\n");

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: MODEL_NAME,
        messages: [
          {
            role: "system",
            content: "You are smart, confident, romantic and smooth flirty. Give complete 1-2 line replies."
          },
          {
            role: "user",
            content: finalPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 120
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let reply =
      response.data?.choices?.[0]?.message?.content ||
      "তুমি চুপ থাকলে আমি কিন্তু বেশি ভাবি 😏";

    if (!/[.!?।]$/.test(reply.trim())) {
      reply = reply.trim() + ".";
    }

    if (senderID === VIP_UID) {
      reply = "Hello developer Sir 👑🔥\n" + reply;
    }

    history[senderID].push(`Bot: ${reply}`);

    return api.sendMessage(reply, threadID, messageID);

  } catch (err) {
    console.error(err.response?.data || err.message);

    return api.sendMessage(
      "আজ একটু নেট সাইলেন্ট 😔 পরে আবার ডাকো আমাকে।",
      threadID,
      messageID
    );
  }
};
