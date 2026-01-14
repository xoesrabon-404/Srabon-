const axios = require("axios").create({
  timeout: 8000
});

module.exports.config = {
  name: "baby",
  version: "1.0.8",
  hasPermssion: 0,
  credits: "Rx Abdullah | Human-like AI by Jihad",
  description: "Baby auto reply + ultra fast smart AI conversation",
  commandCategory: "AI",
  cooldowns: 1,
  usePrefix: false
};

let activeAIReplies = new Set();
let processedMessages = new Set();
let BASE_API_URL = null;

/* 💖 Fixed baby replies */
const babyReplies = [
  "⏤͟͟͞͞𝐻𝑒𝑎 𝑏𝑎𝑏𝑦 𝑏𝑜𝑙𝑜 𝐴𝑚𝑖 𝑎𝑐𝑖......🤭😶",
  "𝐽𝑖 𝑠𝑖𝑟 𝑏𝑜𝑙𝑒𝑛 𝐴𝑚𝑖 𝑎𝑐𝑖..... 😉🤗",
  "⏤͟͟͞͞𝐴𝑠𝑠𝑎𝑙𝑎𝑚𝑢𝑙𝑎𝑖𝑘𝑢𝑚 𝑆𝑖𝑟 𝑏𝑜𝑙𝑒𝑛 𝐾𝑖𝑣𝑎 𝑏𝑒 ℎ𝑒𝑙𝑝 𝑘𝑜𝑟𝑡𝑒 𝑝𝑎𝑟𝑖..... 😇😌",
  "𝐻𝑢𝑢𝑢 𝑏𝑎𝑏𝑦 𝑏𝑜𝑙𝑜...... 😜😜",
  "⏤͟͟͞͞𝐴𝑠𝑠𝑎𝑙𝑎𝑚𝑢𝑙𝑎𝑖𝑘𝑢𝑚 𝐽𝑖ℎ𝑎𝑑 𝑐ℎ𝑎𝑡 𝑏𝑜𝑡\n\n\n\n𝐻𝑜𝑤 𝑐𝑎𝑛 𝐼 ℎ𝑒𝑙𝑝 𝑦𝑜𝑢........ ?☺😎"
];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ⚡ Cached Base API URL */
async function getBaseApiUrl() {
  if (BASE_API_URL) return BASE_API_URL;

  const res = await axios.get(
    "https://raw.githubusercontent.com/rummmmna21/rx-api/refs/heads/main/baseApiUrl.json"
  );

  BASE_API_URL = res.data.gpt.trim().replace(/\/+$/, "");
  return BASE_API_URL;
}

/* 🧠 Ultra fast AI reply */
async function getAIReply(baseUrl, question) {
  const prompt = `
তুমি একজন মানুষের মতো chat bot 😌  
- মানুষের মতো কথা বলবে
- হালকা playful
- ১–২ লাইনে উত্তর
- একদম over-funny না
- ১টা হালকা emoji 🙂  

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
  } catch (e) {
    api.sendMessage("❌ একটু সমস্যা হচ্ছে, পরে বলো 😕", event.threadID);
  }
}

module.exports.handleEvent = async ({ api, event }) => {
  if (!event.body) return;

  const text = event.body.toLowerCase().trim();

  /* 🔁 Reply to bot → AI */
  if (
    event.messageReply &&
    activeAIReplies.has(event.messageReply.messageID)
  ) {
    return processAI(api, event, event.body);
  }

  /* 💖 Baby call */
  if (text === "baby") {
    if (processedMessages.has(event.messageID)) return;
    processedMessages.add(event.messageID);

    const msg = await api.sendMessage(random(babyReplies), event.threadID);
    activeAIReplies.add(msg.messageID);
  }
};

module.exports.run = async () => {};
