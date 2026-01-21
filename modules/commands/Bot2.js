const axios = require("axios");
const fs = require("fs");
const path = require("path");

/* 🔒 CREDIT LOCK */
function protectCredits(config) {
  if (config.credits !== "ARIF-BABU") {
    config.credits = "ARIF-BABU";
    throw new Error("Credits locked!");
  }
}

module.exports.config = {
  name: "ARIF-AI",
  version: "3.4.1",
  hasPermssion: 0,
  credits: "ARIF-BABU",
  description: "Normal AI reply chain system",
  commandCategory: "ai",
  cooldowns: 2,
  dependencies: { axios: "" }
};

protectCredits(module.exports.config);

/* 🔑 API KEY */
const OPENROUTER_API_KEY =
  "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";

/* 🧠 SYSTEM PROMPT */
const systemPrompt = `
তুমি একজন normal, friendly AI।
সব উত্তর পরিষ্কার ও স্বাভাবিক বাংলায় দেবে।
ChatGPT-এর মতো ব্যবহার করবে।
`;

/* 📁 DATA */
const DATA_DIR = path.join(__dirname, "ARIF-BABU");
const HISTORY_FILE = path.join(DATA_DIR, "ai_history.json");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

let history = {};
if (fs.existsSync(HISTORY_FILE)) {
  try {
    history = JSON.parse(fs.readFileSync(HISTORY_FILE));
  } catch {
    history = {};
  }
}

/* 🔁 AI ACTIVE THREAD */
const ACTIVE_THREAD = {}; // threadID : true

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
      "হ্যাঁ 🙂 আমি আছি, এখন বলো কী জানতে চাও?",
      threadID,
      messageID
    );
  }

  /* ❌ AI OFF IF NOT REPLY */
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
        temperature: 0.8
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
      "একটু সমস্যা হচ্ছে 🙂";

    history[threadID].push({ role: "assistant", content: reply });
    saveJSON();

    api.sendMessage(reply, threadID, messageID);
  } catch (e) {
    api.sendMessage("AI এখন ব্যস্ত 😅 পরে আবার বলো", threadID, messageID);
  }
};
