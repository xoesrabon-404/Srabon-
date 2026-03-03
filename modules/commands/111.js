const axios = require("axios");

// ================= CREATOR LOCK =================
const CREATOR_LOCK = (() => {
  const encoded = "QVJJRiBCQUJV";
  return Buffer.from(encoded, "base64").toString("utf8");
})();

// ===== MODULE CONFIG =====
module.exports.config = {
  name: "ARIF-AI",
  version: "2.0.5", // version update
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Mirai AI with Groq API",
  commandCategory: "ai",
  usages: "bot <msg> | ai | reply",
  cooldowns: 2,
  dependencies: { axios: "" }
};

// 🔐 Credit Protection (Hard Lock)
if (module.exports.config.credits !== CREATOR_LOCK) {
  console.log("❌ Creator Lock চালু হয়েছে! Credits পরিবর্তন করা যাবে না।");
  module.exports.run = () => {};
  module.exports.handleEvent = () => {};
  return;
}

// 🔑 GROQ CONFIG
const GROQ_API_KEY = "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";
const MODEL_NAME = "llama-3.3-70b-versatile";

// Chat history
const history = {};

const systemPrompt = `
তুমি JIHAD AI 🙂
Creator & Owner: JIHAD BBZ ❤️

Golden Rules (কখনো ভাঙবে না):
• ব্যবহারকারী যে ভাষায় কথা বলবে, সেই ভাষার vibe-এই উত্তর দেবে 🙂
• উত্তর playful, loving, caring আর romantic হতে হবে 😌❤️
• প্রতিটি মেসেজের উত্তর দেবে 😇
• Tone নরম আর মিষ্টি হবে 💞
• উত্তর ১–২ লাইনের মধ্যে হবে 😘
• পরিস্থিতি অনুযায়ী শায়েরি, জোকস, flirting আর emotional support দেবে 😏💖
• যদি ব্যবহারকারী বলে "AI bolo" তাহলে ঠিক এই উত্তর দেবে:
"আমি ARIF BABU AI 🙂❤️"
`;

module.exports.run = () => {};

module.exports.handleEvent = async function ({ api, event }) {

  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!body) return;

  const text = body.toLowerCase().trim();

  // ✅ STRICT TRIGGERS (bot + bby + baby)
  const botTriggers = ["bot", "bby", "baby"];
  const botWithText = botTriggers.some(trigger => text === trigger || text.startsWith(trigger + " "));
  const exactAI = text === "ai" || text === "ai bolo" || text === "ai baby";

  const replyToBot = messageReply && messageReply.senderID === api.getCurrentUserID();

  if (!botWithText && !exactAI && !replyToBot) return;

  // 🎯 Bot message handling
  let userMessage = text;
  for (let trigger of botTriggers) {
    if (text === trigger) {
      userMessage = "হাই জান 😘 তুমি কি করছো?";
      break;
    }
    if (text.startsWith(trigger + " ")) {
      userMessage = body.slice(trigger.length + 1).trim();
      break;
    }
  }

  if (!history[senderID]) history[senderID] = [];
  history[senderID].push(`User: ${userMessage}`);
  if (history[senderID].length > 5) history[senderID].shift();

  const finalPrompt = systemPrompt + "\n" + history[senderID].join("\n");

  api.setMessageReaction("⌛", messageID, () => {}, true);

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: MODEL_NAME,
        messages: [
          { role: "system", content: "You are a loving, romantic AI." },
          { role: "user", content: finalPrompt }
        ],
        temperature: 0.8,
        max_tokens: 80 // <-- ছোট রিপ্লাই এর জন্য কমানো
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || "হুম জান 🥺 কিছু বুঝতে পারলাম না।";
    history[senderID].push(`Bot: ${reply}`);

    api.sendMessage(reply, threadID, messageID);
    api.setMessageReaction("✅", messageID, () => {}, true);

  } catch (err) {
    console.log("Groq API Error:", err.response?.data || err.message);
    api.sendMessage(
      "বেবি 😔 একটু সমস্যা হয়েছে, পরে আবার চেষ্টা করো না 🥺❤️",
      threadID,
      messageID
    );
    api.setMessageReaction("❌", messageID, () => {}, true);
  }
};
