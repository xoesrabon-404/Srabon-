const axios = require("axios");

const VIP_UID = "100086331559699";

module.exports.config = {
  name: "baby",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "Jihad",
  description: "Smart Romantic AI with Jihad Search Mode",
  commandCategory: "AI",
  usages: "[text]",
  cooldowns: 3,
};

let waitingReply = {};

module.exports.handleEvent = async function ({ api, event }) {
  const { body, senderID, threadID, messageID } = event;
  if (!body) return;

  const msg = body.toLowerCase();
  let reply = "";

  // ===== BOT CALL KEYWORDS =====
  const botCall = ["bot", "baby", "bby", "বেবি", "বট"];

  if (botCall.includes(msg.trim())) {
    const texts = [
      "জিহাদ কোথায়? খুঁজে পাচ্ছিনা 🥺",
      "কেউ জিহাদকে দেখছো? খুঁজে পাচ্ছি না 🥺"
    ];

    reply = texts[Math.floor(Math.random() * texts.length)];
    waitingReply[threadID] = true;
  }

  // ===== IF USER REPLIED AFTER JIHAD SEARCH =====
  else if (waitingReply[threadID]) {
    waitingReply[threadID] = false;

    try {
      const res = await axios.get(`https://api.simsimi.vn/v2/simtalk`, {
        params: {
          text: body,
          lc: "bn"
        }
      });

      reply = res.data.message || "তোমার কথা বেশ ইন্টারেস্টিং 😌";
    } catch (err) {
      reply = "এই মুহূর্তে একটু লজ্জা পাচ্ছি 😅";
    }
  }

  // ===== NORMAL SMART REPLIES =====
  else if (msg.includes("কেমন আছো")) {
    reply = "আলহামদুলিল্লাহ দারুণ আছি 😌 তুমি কেমন আছো?";
  }

  else if (msg.includes("আমি তোমারে ভালবাসি") || msg.includes("আমি তোমাকে ভালোবাসি")) {
    reply = "আমি তো অনেক আগেই তোমার হয়ে গেছি 💖";
  }

  // ===== DEFAULT AI =====
  else {
    try {
      const res = await axios.get(`https://api.simsimi.vn/v2/simtalk`, {
        params: {
          text: body,
          lc: "bn"
        }
      });

      reply = res.data.message || "তোমার কথা রহস্যময় লাগছে 😏";
    } catch (err) {
      reply = "এই মুহূর্তে কথা বলতে পারছি না 😅";
    }
  }

  // ===== VIP TAG =====
  if (senderID === VIP_UID) {
    reply = "⏤͟͟͞͞𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿  ꥟ " + reply;
  }

  return api.sendMessage(reply, threadID, messageID);
};

module.exports.run = async function ({ api, event }) {
  return api.sendMessage("আমি তো তোমার স্মার্ট বেবি 😘", event.threadID, event.messageID);
};
