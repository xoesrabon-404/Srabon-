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
const VIP_UID = "100086331559699"; // ✅ VIP UID

// short response mapping
const shortReplies = {
  "কেমন আছো": "Alhamdulillah ভালো, আপনি কেমন আছেন? 😘",
  "আমি তোমাকে ভালোবাসি": "আমিও তোমাকে ভীষণ ভালোবাসি 🥺💖",
  "হাই": "হাই জান 😏💞 কেমন আছো? 🥰",
  "হ্যালো": "হ্যালো জান 😘 আজ কি করছো? 🥺",
  "মিস করছি": "আমি ও তোমাকে মিস করছি 🥺💖",
  "কেমন চলছে": "সব ঠিক আছে জান 😏 তুমি কেমন আছো? 🥰"
};

const systemPrompt = `
তুমি JIHAD AI 🙂
Creator & Owner: JIHAD BBZ ❤️

Golden Rules:
• ব্যবহারকারী যে ভাষায় কথা বলবে, সেই ভাষার vibe-এ উত্তর দেবে 🙂
• তুমি চঞ্চল, বুদ্ধিমান, রোমান্টিক আর ইমোশনাল 😏💖🥺
• প্রতিটি মেসেজ playful, loving, caring হবে 💞
• উত্তর ১–২ লাইনের মধ্যে হবে, emoji অবশ্যই থাকবে 😘❤️
• context অনুযায়ী short & direct reply দেবে
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
      userMessage = "হাই জান 😏💞 তুমি কেমন আছো? 🥰";
      break;
    }
    if (text.startsWith(trigger + " ")) {
      userMessage = body.slice(trigger.length + 1).trim();
      break;
    }
  }

  // check for short reply
  let reply = null;
  for (const key in shortReplies) {
    if (userMessage.includes(key)) {
      reply = shortReplies[key];
      break;
    }
  }

  // যদি short reply না থাকে, AI দিয়ে generate করবে
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
          temperature: 0.85,
          max_tokens: 80
        },
        {
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      reply = response.data.choices?.[0]?.message?.content || "হুম জান 🥺 কিছু বুঝতে পারলাম না।";
      history[senderID].push(`Bot: ${reply}`);

    } catch (err) {
      console.log("Groq API Error:", err.response?.data || err.message);
      reply = "বেবি 😔 একটু সমস্যা হয়েছে, পরে আবার চেষ্টা করো না 🥺❤️";
    }
  }

  // ✅ VIP UID reply prefix
  if (senderID === VIP_UID) reply = "Sir. " + reply;

  api.sendMessage(reply, threadID, messageID);
  api.setMessageReaction("✅", messageID, () => {}, true);
};
