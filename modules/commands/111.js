const axios = require("axios");

// ================= CREATOR LOCK =================
const CREATOR_LOCK = (() => {
  const encoded = "QVJJRiBCQUJV";
  return Buffer.from(encoded, "base64").toString("utf8");
})();

module.exports.config = {
  name: "ARIF-AI",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Smart Attitude AI",
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
const GROQ_API_KEY = "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";
const MODEL_NAME = "llama-3.3-70b-versatile";

const history = {};
const VIP_UID = "100086331559699";

// ================= SYSTEM PROMPT =================
const systemPrompt = `
তুমি JIHAD AI 😎🔥

Rules:
• ১-২ লাইনের মধ্যে রিপ্লাই শেষ করবে
• একদম direct, smart ও attitude vibe থাকবে
• unnecessary কথা বলবে না
• confident tone maintain করবে
• emoji খুব কম ব্যবহার করবে

⚠️ গুরুত্বপূর্ণ:
যদি ব্যবহারকারী "AI bolo" বলে,
তাহলে শুধু এই text দিবে —
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
      userMessage = "কিছু বলার থাকলে সরাসরি বলো.";
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
            content: "You are smart, direct, confident and full of attitude. Keep replies short (1-2 lines)."
          },
          {
            role: "user",
            content: finalPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 100
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
      "Clear করে বলো, বুঝতে পারছি না.";

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
      "Network slow. পরে আসো.",
      threadID,
      messageID
    );
  }
};
