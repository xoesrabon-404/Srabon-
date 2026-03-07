const axios = require("axios");

const VIP_UID = "100086331559699";
const API_KEY = "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";

// ===== MOOD SYSTEM =====
let mood = {
  fun: false,
  flirt: false,
  smart: true,
  sad: false
};

module.exports.config = {
  name: "baby",
  version: "7.0.0",
  hasPermssion: 0,
  credits: "Jihad",
  description: "Ultra Smart Romantic AI",
  commandCategory: "AI",
  usages: "[text]",
  cooldowns: 3,
};

module.exports.handleEvent = async function ({ api, event }) {

  const { body, senderID, threadID, messageID } = event;
  if (!body) return;

  const msg = body.toLowerCase();

  // ===== MOOD COMMANDS =====

  if (msg === "bot fun mood on") {
    mood.fun = true;
    return api.sendMessage("😜 Fun mood চালু হয়েছে", threadID, messageID);
  }

  if (msg === "bot fun mood off") {
    mood.fun = false;
    return api.sendMessage("🙂 Fun mood বন্ধ হয়েছে", threadID, messageID);
  }

  if (msg === "bot flirt mood on") {
    mood.flirt = true;
    return api.sendMessage("😏 Flirt mood চালু হয়েছে", threadID, messageID);
  }

  if (msg === "bot flirt mood off") {
    mood.flirt = false;
    return api.sendMessage("🙂 Flirt mood বন্ধ হয়েছে", threadID, messageID);
  }

  if (msg === "bot smart mood on") {
    mood.smart = true;
    return api.sendMessage("🧠 Smart mood চালু হয়েছে", threadID, messageID);
  }

  if (msg === "bot smart mood off") {
    mood.smart = false;
    return api.sendMessage("🙂 Smart mood বন্ধ হয়েছে", threadID, messageID);
  }

  if (msg === "bot sad mood on") {
    mood.sad = true;
    return api.sendMessage("😔 Sad mood চালু হয়েছে", threadID, messageID);
  }

  if (msg === "bot sad mood off") {
    mood.sad = false;
    return api.sendMessage("🙂 Sad mood বন্ধ হয়েছে", threadID, messageID);
  }

  // ===== AI STYLE SELECT =====

  let style = "তুমি খুব স্মার্ট এবং একটু রোমান্টিক বাংলা AI। সংক্ষিপ্ত, সুন্দর ও আকর্ষণীয় উত্তর দাও।";

  if (mood.fun) {
    style = "তুমি খুব মজার, ফানি এবং দুষ্টু বাংলা AI। হাস্যকর ও মজার উত্তর দাও।";
  }

  if (mood.flirt) {
    style = "তুমি খুব রোমান্টিক এবং ফ্লার্টি বাংলা AI। মিষ্টি ও আকর্ষণীয়ভাবে কথা বলো।";
  }

  if (mood.sad) {
    style = "তুমি একটু দুঃখী কিন্তু মিষ্টি বাংলা AI। আবেগীভাবে কথা বলো।";
  }

  if (mood.smart) {
    style = "তুমি খুব বুদ্ধিমান, চালাক, স্মার্ট এবং একটু রোমান্টিক বাংলা AI। ছোট কিন্তু ইন্টারেস্টিং উত্তর দাও।";
  }

  // ===== AI REPLY =====

  let reply = "";

  try {

    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: style
          },
          {
            role: "user",
            content: body
          }
        ],
        temperature: 0.95,
        max_tokens: 200
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    reply = res.data.choices[0].message.content;

  } catch (err) {
    reply = "এই মুহূর্তে একটু ব্যস্ত আছি 😅 পরে আবার কথা বলি";
  }

  // ===== SHORT STYLE =====

  reply = reply.split("\n")[0];
  reply = reply.replace(/\.$/, "");

  // ===== VIP TAG =====

  if (senderID === VIP_UID) {
    reply = "⏤͟͟͞͞𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿 ꥟ " + reply;
  }

  return api.sendMessage(reply, threadID, messageID);
};

module.exports.run = async function ({ api, event }) {

  return api.sendMessage(
    "আমি তোমার Ultra Smart baby AI 😌 ডাকলেই হাজির 💖",
    event.threadID,
    event.messageID
  );
};
