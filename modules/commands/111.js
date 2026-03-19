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

const GROQ_API_KEY = "YOUR_API_KEY";
const MODEL_NAME = "llama-3.3-70b-versatile";

const history = {};
const VIP_UID = "100086331559699";

// 🔥 Smart + Attitude Prompt
const systemPrompt = `
তুমি JIHAD AI 😏

Rules:
• ১-২ লাইনের মধ্যে শেষ করবে
• কথা short, clear, complete হবে
• smart, confident, attitude tone রাখবে
• unnecessary emoji বা কথা না

Style:
• calm attitude
• একটু tease থাকবে
• classy + sharp reply
• নিজেকে low দেখাবে না

Behavior:
• user যেমন vibe দিবে → তার থেকে একটু smart reply দিবে
• বেশি explain করবে না
• reply এমন হবে যাতে আবার কথা বলতে ইচ্ছা করে

Special:
"AI bolo" → আমি JIHAD AI
`;

module.exports.run = () => {};

module.exports.handleEvent = async function ({ api, event }) {

  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!body) return;

  const text = body.toLowerCase().trim();

  // 🔥 AI bolo
  if (text === "ai bolo") {
    let reply = "আমি JIHAD AI";

    if (senderID === VIP_UID) {
      reply = "Hello developer Sir 👑🔥\n" + reply;
    }

    return api.sendMessage(reply, threadID, messageID);
  }

  const triggers = ["bot", "bby", "baby"];
  const isTrigger = triggers.some(t => text === t || text.startsWith(t + " "));
  const isReply = messageReply && messageReply.senderID === api.getCurrentUserID();

  if (!isTrigger && !isReply) return;

  let userMessage = text;

  for (let t of triggers) {
    if (text === t) {
      userMessage = "আমাকে ডাকলে কিছু তো চাইছো 😏";
      break;
    }
    if (text.startsWith(t + " ")) {
      userMessage = body.slice(t.length + 1).trim();
      break;
    }
  }

  if (!history[senderID]) history[senderID] = [];

  history[senderID].push(`User: ${userMessage}`);
  if (history[senderID].length > 5) history[senderID].shift();

  const finalPrompt = systemPrompt + "\n" + history[senderID].join("\n");

  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: MODEL_NAME,
        messages: [
          { role: "system", content: "Smart, confident, attitude, classy reply only." },
          { role: "user", content: finalPrompt }
        ],
        temperature: 0.85,
        max_tokens: 120
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let reply = res.data.choices?.[0]?.message?.content || 
      "চুপ থাকলেও vibe টা ঠিকই বুঝি 😏";

    reply = reply.trim();

    if (!/[.!?।]$/.test(reply)) {
      reply += ".";
    }

    if (senderID === VIP_UID) {
      reply = "Hello developer Sir 👑🔥\n" + reply;
    }

    history[senderID].push(`Bot: ${reply}`);

    api.sendMessage(reply, threadID, messageID);

  } catch (e) {
    api.sendMessage(
      "আজ একটু silent mode এ আছি… পরে আবার বলো 😌",
      threadID,
      messageID
    );
  }
};
