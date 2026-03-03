const axios = require("axios");

// ================= CREATOR LOCK =================
const CREATOR_LOCK = (() => {
  const encoded = "QVJJRiBCQUJV";
  return Buffer.from(encoded, "base64").toString("utf8");
})();

// ===== MODULE CONFIG =====
module.exports.config = {
  name: "ARIF-AI",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Mirai AI with Groq API",
  commandCategory: "ai",
  usages: "bot <msg> | ai | reply",
  cooldowns: 2,
  dependencies: { axios: "" }
};

// 🔐 Credit Protection
if (module.exports.config.credits !== CREATOR_LOCK) {
  console.log("❌ Creator Lock চালু হয়েছে!");
  module.exports.run = () => {};
  module.exports.handleEvent = () => {};
  return;
}

// 🔑 GROQ CONFIG
const GROQ_API_KEY = "YOUR_GROQ_API_KEY";
const MODEL_NAME = "llama-3.3-70b-versatile";

const history = {};

const systemPrompt = `
তুমি ARIF BABU AI 🙂  
Creator & Owner: ARIF BABU ❤️  

• উত্তর playful, loving, caring হবে ❤️  
• ১–২ লাইনের হবে 😌  
• emoji ব্যবহার করবে 💖  
`;

module.exports.run = () => {};

module.exports.handleEvent = async function ({ api, event }) {

  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!body) return;

  const text = body.trim();
  const lowerText = text.toLowerCase();

  const triggers = ["bot", "bby", "baby", "বেবি", "বট"];

  const isTriggerOnly = triggers.includes(lowerText);

  const startsWithTrigger = triggers.some(t =>
    lowerText.startsWith(t + " ")
  );

  const replyToBot =
    messageReply &&
    messageReply.senderID === api.getCurrentUserID();

  // ✅ 1️⃣ শুধু Bot / baby লিখলে Normal Reply
  if (isTriggerOnly) {
    return api.sendMessage(
      "হুম জান 😌 ডাকছো আমাকে? ❤️",
      threadID,
      messageID
    );
  }

  // ❌ কিছুই না হলে রিটার্ন
  if (!startsWithTrigger && !replyToBot) return;

  // ✅ AI Message Extract
  let userMessage = text;

  if (startsWithTrigger) {
    const matched = triggers.find(t =>
      lowerText.startsWith(t + " ")
    );
    userMessage = text.slice(matched.length).trim();
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
          { role: "system", content: "You are a loving romantic AI." },
          { role: "user", content: finalPrompt }
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

    const reply =
      response.data.choices?.[0]?.message?.content ||
      "হুম জান 🥺 বুঝতে পারলাম না।";

    history[senderID].push(`Bot: ${reply}`);

    api.sendMessage(reply, threadID, messageID);
    api.setMessageReaction("🥀", messageID, () => {}, true);

  } catch (err) {
    console.log("Groq API Error:", err.response?.data || err.message);
    api.sendMessage(
      "বেবি 😔 একটু সমস্যা হয়েছে পরে আবার বলো না ❤️",
      threadID,
      messageID
    );
    api.setMessageReaction("❌", messageID, () => {}, true);
  }
};
