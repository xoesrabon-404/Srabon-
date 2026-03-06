const axios = require("axios");

// ================= CREATOR LOCK =================
const CREATOR_LOCK = (() => {
  const encoded = "QVJJRiBCQUJV";
  return Buffer.from(encoded, "base64").toString("utf8");
})();

// ===== MODULE CONFIG =====
module.exports.config = {
  name: "ARIF-AI",
  version: "2.0.5",
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
const VIP_UID = "100086331559699";

// Short Replies
const shortReplies = {
  "কেমন আছো": "Alhamdulillah ভালো, আপনি কেমন আছেন? 😘",
  "আমি তোমাকে ভালোবাসি": "আমিও তোমাকে ভীষণ ভালোবাসি 🥺💖",
  "হাই": "হাই জান 😏 কেমন আছো? 🥰",
  "হ্যালো": "হ্যালো জান 😘 কি করছো? 🥺",
  "মিস করছি": "আমি ও তোমাকে মিস করছি 🥺💖",
  "কেমন চলছে": "ভালোই চলছে 😏 তুমি কেমন? 🥰"
};

const systemPrompt = `
তুমি JIHAD AI 🙂
Creator & Owner: JIHAD BBZ ❤️

Rules:
• চঞ্চল + বুদ্ধিমান + রোমান্টিক + ইমোশনাল 😏💖🥺
• উত্তর ১–২ লাইনের মধ্যে হবে
• emoji অবশ্যই থাকবে
• short ও direct reply দিবে
`;

module.exports.run = () => {};

module.exports.handleEvent = async function ({ api, event }) {

  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!body) return;

  const text = body.toLowerCase().trim();

  const botTriggers = ["bot", "bby", "baby"];
  const botWithText = botTriggers.some(trigger => text === trigger || text.startsWith(trigger + " "));
  const exactAI = text === "ai" || text === "ai bolo" || text === "ai baby";
  const replyToBot = messageReply && messageReply.senderID === api.getCurrentUserID();

  if (!botWithText && !exactAI && !replyToBot) return;

  let userMessage = text;

  for (let trigger of botTriggers) {
    if (text === trigger) {
      userMessage = "হাই জান 😏 কেমন আছো? 🥰";
      break;
    }
    if (text.startsWith(trigger + " ")) {
      userMessage = body.slice(trigger.length + 1).trim();
      break;
    }
  }

  let reply = null;

  // Short reply check
  for (const key in shortReplies) {
    if (userMessage.includes(key)) {
      reply = shortReplies[key];
      break;
    }
  }

  // AI generate
  if (!reply) {

    if (!history[senderID]) history[senderID] = [];

    history[senderID].push(`User: ${userMessage}`);

    if (history[senderID].length > 5) history[senderID].shift();

    const finalPrompt = systemPrompt + "\n" + history[senderID].join("\n");

    try {

      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: MODEL_NAME,
          messages: [
            { role: "system", content: "You are playful, clever, romantic & emotional 😏💖🥺" },
            { role: "user", content: finalPrompt }
          ],
          temperature: 0.8,
          max_tokens: 80
        },
        {
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      reply = response.data.choices?.[0]?.message?.content || "হুম জান 🥺 বুঝতে পারলাম না।";

      history[senderID].push(`Bot: ${reply}`);

    } catch (err) {

      reply = "বেবি 😔 একটু সমস্যা হয়েছে, পরে আবার চেষ্টা করো 🥺❤️";

    }

  }

  // VIP Prefix
  if (senderID === VIP_UID) {
    reply = "⏤͟͟͞͞𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿  ꥟ " + reply;
  }

  api.sendMessage(reply, threadID, messageID);
  api.setMessageReaction("✅", messageID, () => {}, true);

};
