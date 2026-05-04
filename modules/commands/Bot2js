const axios = require("axios");
const fs = require("fs");
const path = require("path");

/* 🔒 CREDIT LOCK */
function protectCredits(config) {
  if (config.credits !== "ARIF-BABU") {
    config.credits = "ARIF-BABU";
    throw new Error("❌ Credits are LOCKED!");
  }
}

module.exports.config = {
  name: "ARIF-AI",
  version: "3.5.0",
  hasPermssion: 0,
  credits: "ARIF-BABU",
  description: "Emotional, playful & smart AI (reply-chain based)",
  commandCategory: "ai",
  cooldowns: 2,
  dependencies: { axios: "" }
};

protectCredits(module.exports.config);

/* 🔑 OPENROUTER API KEY */
const OPENROUTER_API_KEY =
  "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";

/* 🧠 SYSTEM PROMPT (EMOTIONAL + SMART) */
const systemPrompt = `
তুমি একজন খুব স্মার্ট, ইমোশনাল আর চঞ্চল AI।
তোমার কথা হবে একদম মানুষের মতো—প্রাণবন্ত, আপন আর বুঝদার।

নিয়ম:
• সব রিপ্লাই প্রাঞ্জল বাংলায় হবে
• User যেভাবে কথা বলবে, সেই vibe-এই উত্তর
• Tone হবে friendly, emotional, playful কিন্তু natural
• User দুঃখী হলে সান্ত্বনা দেবে
• User খুশি হলে হাসি-মজা বাড়াবে
• হালকা আবেগ + স্মার্ট রিঅ্যাকশন থাকবে
• কখনো robotic শোনাবে না
• প্রয়োজনে ১–২টা মানানসই emoji 🙂😌✨
• ChatGPT-এর মতো বুদ্ধিমান, কিন্তু আরও warm
`;

/* 📁 DATA */
const DATA_DIR = path.join(__dirname, "ARIF-BABU");
const HISTORY_FILE = path.join(DATA_DIR, "ai_history.json");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

let history = {};
if (fs.existsSync(HISTORY_FILE)) {
  try {
    history = JSON.parse(fs.readFileSync(HISTORY_FILE, "utf8"));
  } catch {
    history = {};
  }
}

/* 🔁 ACTIVE AI THREAD (threadID based) */
const ACTIVE_THREAD = {};

/* 💾 SAVE */
function saveJSON() {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

module.exports.run = () => {};

module.exports.handleEvent = async function ({ api, event }) {
  protectCredits(module.exports.config);

  const { threadID, messageID, body, messageReply } = event;
  if (!body) return;

  const text = body.trim().toLowerCase();

  /* 🤖 BOT START */
  if (text === "bot" || text === "bot." || text === "bot!") {
    ACTIVE_THREAD[threadID] = true;
    return api.sendMessage(
      "হ্যাঁ 🙂 আমি আছি—মন দিয়ে শুনছি, বলো কী ভাবছো? 😌",
      threadID,
      messageID
    );
  }

  /* ❌ AI ONLY WORKS IN REPLY CHAIN */
  if (!ACTIVE_THREAD[threadID]) return;
  if (!messageReply) return;
  if (messageReply.senderID !== api.getCurrentUserID()) return;

  try {
    history[threadID] = history[threadID] || [];
    history[threadID].push({ role: "user", content: body });

    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          ...history[threadID].slice(-15)
        ],
        max_tokens: 120,
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

    const reply =
      res.data?.choices?.[0]?.message?.content ||
      "আমি এখানেই আছি 😌 আরেকটু বলো…";

    history[threadID].push({ role: "assistant", content: reply });
    saveJSON();

    api.sendMessage(reply, threadID, messageID);
  } catch (e) {
    api.sendMessage(
      "এই মুহূর্তে একটু ঝামেলা হচ্ছে 😅 কিন্তু আমি যাচ্ছি না, পরে আবার বলো ❤️",
      threadID,
      messageID
    );
  }
};
