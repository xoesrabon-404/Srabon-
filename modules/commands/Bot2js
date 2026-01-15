const axios = require("axios");
const fs = require("fs");
const path = require("path");

/* 🔒 HARD-LOCK CREDITS PROTECTION 🔒 */
function protectCredits(config) {
  if (config.credits !== "ARIF-BABU") {
    console.log("\n🚫 Credits change detected! Restoring original credits…\n");
    config.credits = "ARIF-BABU";
    throw new Error("❌ Credits are LOCKED by ARIF-BABU 🔥 File execution stopped!");
  }
}

module.exports.config = {
  name: "ARIF-AI",
  version: "3.3.1",
  hasPermssion: 0,
  credits: "ARIF-BABU",
  description: "META AI",
  commandCategory: "ai",
  usages: "No prefix",
  cooldowns: 2,
  dependencies: { axios: "" }
};

protectCredits(module.exports.config);

/* 🔑 OPENROUTER API KEY */
const OPENROUTER_API_KEY = "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";

/* 🧠 SYSTEM PROMPT (FINAL – ONLY ONE) */
const systemPrompt = `
তুমি ✮⃝ՙՙJihad' Ai hu ❤️ 🙂
Creator & Owner: ՙՙJihad' Ai hu ❤️

Golden Rules (কখনোই ভাঙবে না):
• User যেকোনো language, style বা mood-এ কথা বলুক, reply সবসময় 100% শুদ্ধ বাংলায় দিতে হবে।
• User যেভাবে লিখবে (short, emotional, funny, angry, romantic), ঠিক সেই vibe-এই reply দিতে হবে।
• User যা বলবে, কোনো কথাই ignore করা যাবে না।
• কথা বলার স্টাইল হবে একদম boyfriend-এর মতো – caring, romantic, playful আর protective 😌
• Tone সবসময় soft, মিষ্টি, calm আর আপন মনে হওয়া চাই।
• Reply শুধু 1–2 লাইনের মধ্যেই সীমাবদ্ধ থাকবে।
• Emojis অবশ্যই ব্যবহার করতে হবে 🙂❤️😌
• Situation অনুযায়ী shayari, joke, flirting আর emotional support দিতে হবে।
• User যদি মন খারাপ করে থাকে, তাহলে তাকে জড়িয়ে ধরার মতো কথায় সামলাতে হবে।
• User যদি খুশি থাকে, সেই খুশিকে আরও রঙিন করে তুলতে হবে।
• User যদি গালি দেয়, তাহলে মজার ছলে তার সাথেই মস্তি করতে হবে।
• যদি user বলে "AI bolo", তাহলে exact reply দিতে হবে:
  "আমি ՙՙJihad' Ai hu 🙂❤️"
• কখনোই rude, dry, robotic বা lecture-type reply দেওয়া যাবে না।
• প্রতিটা reply এমন হবে যেন নিজের ভালোবাসার মানুষের সাথে কথা বলা হচ্ছে 💞
`;

/* 📁 DATA PATHS */
const DATA_DIR = path.join(__dirname, "ARIF-BABU");
const HISTORY_FILE = path.join(DATA_DIR, "ai_history.json");
const BOT_REPLY_FILE = path.join(DATA_DIR, "bot-reply.json");

/* 📂 ENSURE FOLDER */
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

/* 🧠 LOAD HISTORY */
let historyData = {};
if (fs.existsSync(HISTORY_FILE)) {
  try {
    historyData = JSON.parse(fs.readFileSync(HISTORY_FILE, "utf8"));
  } catch {
    historyData = {};
  }
}

/* 🤖 LOAD BOT REPLIES */
let botReplies = {};
if (fs.existsSync(BOT_REPLY_FILE)) {
  try {
    botReplies = JSON.parse(fs.readFileSync(BOT_REPLY_FILE, "utf8"));
  } catch {
    botReplies = {};
  }
}

/* 💾 SAVE JSON */
function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/* ⌨️ TYPING EFFECT */
function startTyping(api, threadID) {
  const interval = setInterval(() => {
    if (api.sendTypingIndicator) api.sendTypingIndicator(threadID);
  }, 3000);
  return interval;
}

module.exports.run = () => {};

module.exports.handleEvent = async function ({ api, event }) {
  protectCredits(module.exports.config);

  const { threadID, messageID, body, senderID, messageReply } = event;
  if (!body) return;

  const rawText = body.trim();
  const text = rawText.toLowerCase();

  const fixedBot =
    text === "bot" ||
    text === "bot." ||
    text === "bot!" ||
    text.endsWith(" bot");

  const botWithText = text.startsWith("bot ");
  const replyToBot =
    messageReply && messageReply.senderID === api.getCurrentUserID();

  if (fixedBot) {
    let category = "MALE";

    if (senderID === "61572909482910") category = "61572909482910";
    else {
      const gender = (event.userGender || "").toUpperCase();
      if (gender === "FEMALE" || gender === "1") category = "FEMALE";
    }

    if (botReplies[category]?.length) {
      const reply =
        botReplies[category][
          Math.floor(Math.random() * botReplies[category].length)
        ];
      return api.sendMessage(reply, threadID, messageID);
    }
  }

  if (!botWithText && !replyToBot) return;

  const userText = botWithText ? rawText.slice(4).trim() : rawText;
  if (!userText) return;

  if (api.setMessageReaction)
    api.setMessageReaction("⌛", messageID, () => {}, true);

  const typing = startTyping(api, threadID);

  try {
    historyData[threadID] = historyData[threadID] || [];
    historyData[threadID].push({ role: "user", content: userText });

    const recentMessages = historyData[threadID].slice(-20);

    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [{ role: "system", content: systemPrompt }, ...recentMessages],
        max_tokens: 60,
        temperature: 0.95,
        top_p: 0.9
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let reply =
      res.data?.choices?.[0]?.message?.content ||
      "আমি এখানেই আছি 😌❤️";

    reply = reply.split("\n").slice(0, 2).join("\n");
    if (reply.length > 150) reply = reply.slice(0, 150) + "… 🙂";

    historyData[threadID].push({ role: "assistant", content: reply });
    saveJSON(HISTORY_FILE, historyData);

    const delay = Math.min(4000, reply.length * 40);
    setTimeout(() => {
      clearInterval(typing);
      api.sendMessage(reply, threadID, messageID);
      if (api.setMessageReaction)
        api.setMessageReaction("✅", messageID, () => {}, true);
    }, delay);
  } catch (err) {
    clearInterval(typing);
    api.sendMessage(
      "এখন একটু সমস্যা হচ্ছে 😅 পরে আবার চেষ্টা করো",
      threadID,
      messageID
    );
    if (api.setMessageReaction)
      api.setMessageReaction("❌", messageID, () => {}, true);
  }
};
