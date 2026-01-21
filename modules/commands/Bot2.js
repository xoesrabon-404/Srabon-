const axios = require("axios");
const fs = require("fs");
const path = require("path");

/* 🔒 HARD-LOCK CREDITS PROTECTION 🔒 */
function protectCredits(config) {
  if (config.credits !== "ARIF-BABU") {
    config.credits = "ARIF-BABU";
    throw new Error("❌ Credits are LOCKED by ARIF-BABU 🔥");
  }
}

module.exports.config = {
  name: "ARIF-AI",
  version: "3.4.0",
  hasPermssion: 0,
  credits: "ARIF-BABU",
  description: "Normal AI like ChatGPT (reply thread based)",
  commandCategory: "ai",
  usages: "bot → reply → chat",
  cooldowns: 2,
  dependencies: { axios: "" }
};

protectCredits(module.exports.config);

/* 🔑 OPENROUTER API KEY */
const OPENROUTER_API_KEY =
  "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";

/* 🧠 SYSTEM PROMPT (NORMAL AI STYLE) */
const systemPrompt = `
তুমি একজন নরমাল, স্মার্ট ও বন্ধুসুলভ AI।
সব উত্তর 100% প্রাঞ্জল বাংলায় দেবে।
Tone হবে natural, helpful, caring – একদম ChatGPT-এর মতো।
User যেভাবে কথা বলবে, সেভাবেই উত্তর দেবে।
অপ্রয়োজনীয় নাটক বা forced romance করবে না।
`;

/* 📁 DATA */
const DATA_DIR = path.join(__dirname, "ARIF-BABU");
const HISTORY_FILE = path.join(DATA_DIR, "ai_history.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

let historyData = {};
if (fs.existsSync(HISTORY_FILE)) {
  try {
    historyData = JSON.parse(fs.readFileSync(HISTORY_FILE, "utf8"));
  } catch {
    historyData = {};
  }
}

/* 🧠 ACTIVE AI THREAD TRACK */
const ACTIVE_AI_THREAD = {};

/* 💾 SAVE */
function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/* ⌨️ TYPING */
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

  const text = body.trim().toLowerCase();

  /* 🤖 BOT CALL */
  if (text === "bot" || text === "bot." || text === "bot!") {
    const botReply = "হ্যাঁ, আমি আছি 🙂 কী জানতে চাও?";
    ACTIVE_AI_THREAD[messageID] = true; // 👈 এই reply thread active
    return api.sendMessage(botReply, threadID, messageID);
  }

  /* 🧠 CHECK REPLY-CHAIN */
  let isActive = false;
  if (messageReply) {
    if (ACTIVE_AI_THREAD[messageReply.messageID]) {
      ACTIVE_AI_THREAD[messageID] = true;
      isActive = true;
    }
  }

  if (!isActive) return;

  const typing = startTyping(api, threadID);

  try {
    historyData[threadID] = historyData[threadID] || [];
    historyData[threadID].push({ role: "user", content: body });

    const recentMessages = historyData[threadID].slice(-15);

    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          ...recentMessages
        ],
        max_tokens: 120,
        temperature: 0.8
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
      "একটু সমস্যা হচ্ছে, আবার বলো 🙂";

    historyData[threadID].push({ role: "assistant", content: reply });
    saveJSON(HISTORY_FILE, historyData);

    setTimeout(() => {
      clearInterval(typing);
      api.sendMessage(reply, threadID, messageID);
    }, 1200);
  } catch (e) {
    clearInterval(typing);
    api.sendMessage("AI এখন ব্যস্ত 😅 একটু পর আবার বলো", threadID, messageID);
  }
};
