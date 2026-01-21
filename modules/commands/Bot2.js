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
  version: "3.3.2",
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
const OPENROUTER_API_KEY =
  "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";

/* 🧠 SYSTEM PROMPT */
const systemPrompt = `
তুমি ✮⃝ՙՙJihad' Ai hu ❤️ 🙂
Creator & Owner: ՙՙJihad' Ai hu ❤️

Golden Rules:
• সব রিপ্লাই 100% শুদ্ধ বাংলায় হবে
• User এর vibe অনুযায়ী reply
• Boyfriend-style caring, romantic 😌
• Reply 1–2 লাইনের মধ্যে
• Emojis অবশ্যই 🙂
• "AI bolo" বললে exact reply:
  "আমি ՙՙJihad' Ai hu 🙂❤️"
`;

/* 📁 DATA PATHS */
const DATA_DIR = path.join(__dirname, "ARIF-BABU");
const HISTORY_FILE = path.join(DATA_DIR, "ai_history.json");

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

/* 🤖 BOT REPLY TRACK */
const BOT_REPLY_TRACK = {};

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

  const { threadID, messageID, body, messageReply } = event;
  if (!body) return;

  const rawText = body.trim();
  const text = rawText.toLowerCase();

  /* 🤖 BOT FIXED CALL */
  const fixedBot =
    text === "bot" ||
    text === "bot." ||
    text === "bot!" ||
    text.endsWith(" bot");

  if (fixedBot) {
    const reply = "হ্যাঁ জান 😌❤️ আমি এখানেই আছি, বলো কী বলবে? 🙂";
    BOT_REPLY_TRACK[threadID] = true;
    return api.sendMessage(reply, threadID, messageID);
  }

  /* 🧠 AI ONLY IF REPLY TO BOT */
  const replyToBot =
    messageReply &&
    messageReply.senderID === api.getCurrentUserID() &&
    BOT_REPLY_TRACK[threadID] === true;

  if (!replyToBot) return;

  if (api.setMessageReaction)
    api.setMessageReaction("⌛", messageID, () => {}, true);

  const typing = startTyping(api, threadID);

  try {
    historyData[threadID] = historyData[threadID] || [];
    historyData[threadID].push({ role: "user", content: rawText });

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
      "আমি এখানেই আছি জান 😌❤️";

    reply = reply.split("\n").slice(0, 2).join("\n");

    historyData[threadID].push({ role: "assistant", content: reply });
    saveJSON(HISTORY_FILE, historyData);

    setTimeout(() => {
      clearInterval(typing);
      api.sendMessage(reply, threadID, messageID);
      delete BOT_REPLY_TRACK[threadID];
      if (api.setMessageReaction)
        api.setMessageReaction("✅", messageID, () => {}, true);
    }, 1500);
  } catch (err) {
    clearInterval(typing);
    delete BOT_REPLY_TRACK[threadID];
    api.sendMessage(
      "এখন একটু সমস্যা হচ্ছে জান 😅 পরে আবার বলো ❤️",
      threadID,
      messageID
    );
    if (api.setMessageReaction)
      api.setMessageReaction("❌", messageID, () => {}, true);
  }
};
