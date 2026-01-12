const axios = require("axios");

module.exports.config = {
  name: "baby",
  version: "1.0.7",
  hasPermssion: 0,
  credits: "Rx Abdullah | Human-like AI by Jihad",
  description: "Baby auto reply + smart AI conversation (human-like, playful, light funny)",
  commandCategory: "AI",
  cooldowns: 1,
  usePrefix: false
};

let activeAIReplies = new Set();
let processedMessages = new Set();

/* 💖 Fixed baby replies */
const babyReplies = [
  "𝐻𝑒𝑎 𝑏𝑎𝑏𝑦 𝑏𝑜𝑙𝑜 𝐴𝑚𝑖 𝑎𝑐𝑖......🤭😶",
  "𝐽𝑖 𝑠𝑖𝑟 𝑏𝑜𝑙𝑒𝑛 𝐴𝑚𝑖 𝑎𝑐𝑖..... 😉🤗",
  "𝐴𝑠𝑠𝑎𝑙𝑎𝑚𝑢𝑙𝑎𝑖𝑘𝑢𝑚 𝑆𝑖𝑟 𝑏𝑜𝑙𝑒𝑛 𝐾𝑖𝑣𝑎 𝑏𝑒 ℎ𝑒𝑙𝑝 𝑘𝑜𝑟𝑡𝑒 𝑝𝑎𝑟𝑖..... 😇😌",
  "𝐻𝑢𝑢𝑢 𝑏𝑎𝑏𝑦 𝑏𝑜𝑙𝑜...... 😜😜",
  "𝐴𝑠𝑠𝑎𝑙𝑎𝑚𝑢𝑙𝑎𝑖𝑘𝑢𝑚 𝐽𝑖ℎ𝑎𝑑 𝑐ℎ𝑎𝑡 𝑏𝑜𝑡\n\n\n\n𝐻𝑜𝑤 𝑐𝑎𝑛 𝐼 ℎ𝑒𝑙𝑝 𝑦𝑜𝑢........ ?☺😎"
];

/* 👑 Fixed Admin/Boss/Developer replies */
const adminReplies = [
  "𝐴𝑚𝑎𝑟 𝑏𝑜𝑠𝑠 𝐽𝑖ℎ𝑎𝑑 𝑠𝑖𝑟 👑",
  "𝐴𝑚𝑎𝑟 𝑎𝑑𝑚𝑖𝑛 𝐽𝑖ℎ𝑎𝑑 𝑠𝑖𝑟 ❤️",
  "𝐽𝑖ℎ𝑎𝑑 𝑠𝑖𝑟 𝐴𝑚𝑎𝑟 𝑎𝑑𝑚𝑖𝑛 ✨"
];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function isAdminQuestion(text) {
  return (
    text.includes("Bot admin") ||
    text.includes("Tor admin k") ||
    text.includes("তোর বস কে") ||
    text.includes("developer") ||
    text.includes("ডেভেলপার") ||
  );
}

async function getBaseApiUrl() {
  const res = await axios.get(
    "https://raw.githubusercontent.com/rummmmna21/rx-api/refs/heads/main/baseApiUrl.json"
  );
  return res.data.gpt.trim().replace(/\/+$/, "");
}

/* 🧠 AI Reply – human-like, smart, playful (light funny) */
async function getAIReply(baseUrl, question) {
  const prompt = `
তুমি একজন মানুষের মতো chat bot 😌  
নিয়ম:
- মানুষের মতো কথা বলবে, AI মনে হবে না
- হালকা মজা, বুদ্ধিমান, চঞ্চল (playful)
- এক বা দুই লাইনে উত্তর দেবে
- একদম over-funny হবে না
- সাধারণ, মানবীয় ভাষা
- ১টি হালকা emoji থাকলেই যথেষ্ট 🙂  

User: ${question}
`;

  const apiUrl = `${baseUrl}/mrx/gpt.php?ask=${encodeURIComponent(prompt)}`;
  const res = await axios.get(apiUrl);

  return typeof res.data === "object" ? res.data.answer : res.data;
}

async function processAI(api, event, question) {
  if (processedMessages.has(event.messageID)) return;
  processedMessages.add(event.messageID);

  try {
    const baseUrl = await getBaseApiUrl();
    const reply = await getAIReply(baseUrl, question);
    const sent = await api.sendMessage(reply, event.threadID);
    activeAIReplies.add(sent.messageID);
  } catch {
    api.sendMessage("❌ এখন উত্তর দিতে পারছি না 😕", event.threadID);
  }
}

module.exports.handleEvent = async ({ api, event }) => {
  if (!event.body) return;

  const text = event.body.toLowerCase().trim();

  /* 👑 Boss/Admin question → fixed smart reply */
  if (isAdminQuestion(text)) {
    if (processedMessages.has(event.messageID)) return;
    processedMessages.add(event.messageID);

    const msg = await api.sendMessage(random(adminReplies), event.threadID);
    activeAIReplies.add(msg.messageID);
    return;
  }

  /* 🔁 Reply to baby → AI reply */
  if (
    event.messageReply &&
    activeAIReplies.has(event.messageReply.messageID)
  ) {
    return processAI(api, event, event.body);
  }

  /* 💖 Baby call → fixed cute/friendly reply */
  if (text === "baby") {
    if (processedMessages.has(event.messageID)) return;
    processedMessages.add(event.messageID);

    const msg = await api.sendMessage(random(babyReplies), event.threadID);
    activeAIReplies.add(msg.messageID);
  }
};

module.exports.run = async () => {};
