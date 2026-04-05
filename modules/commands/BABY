require("dotenv").config();
const axios = require("axios");

const VIP_UID = "100023401563213";
const API_KEY = process.env.GROQ_API_KEY;

module.exports.config = {
  name: "baby",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "Jihad",
  description: "Chonchol Smart Romantic AI (Groq Powered)",
  commandCategory: "AI",
  usages: "[text]",
  cooldowns: 3,
};

module.exports.handleEvent = async function ({ api, event }) {
  const { body, senderID, threadID, messageID } = event;
  if (!body) return;

  const msg = body.toLowerCase();
  let reply = "";

  // ===== SMART SHORT CUSTOM REPLIES =====

  if (msg.includes("কেমন আছো")) {
    reply = "আলহামদুলিল্লাহ ভালো আছি 😌 তুমি না থাকলে একটু ফাঁকা লাগে কিন্তু";
  }

  else if (msg.includes("কি করছো")) {
    reply = "তোমার কথাই ভাবছিলাম 😏 এখন তুমি বলো কি করছো";
  }

  else if (msg.includes("আমি তোমাকে ভালোবাসি") || msg.includes("আমি তোমারে ভালবাসি")) {
    reply = "আমি তো অনেক আগেই তোমার হয়ে গেছি 💖";
  }

  else if (msg.includes("মিস করি")) {
    reply = "এত মিস করলে সামনে এসে বসো না 😌";
  }

  else if (msg.includes("রাগ করছো")) {
    reply = "তোমার উপর রাগ টেকে নাকি 😏 একটু অভিমান থাকতে পারে";
  }

  // ===== DEFAULT GROQ AI REPLY =====
  else {
    try {
      const res = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: "তুমি চঞ্চল, বুদ্ধিমান, স্মার্ট এবং একটু রোমান্টিক বাংলা AI। উত্তর ছোট, আকর্ষণীয় এবং দুষ্টু-মিষ্টি হবে।"
            },
            {
              role: "user",
              content: body
            }
          ],
          temperature: 0.9,
          max_tokens: 150
        },
        {
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      reply = res.data.choices[0].message.content || "তোমার কথা একটু রহস্যময় লাগছে 😌";
    } catch (err) {
      reply = "এই মুহূর্তে একটু ব্যস্ত আছি 😅 পরে আবার ডাকো";
    }
  }

  // ===== SHORT STYLE (no full stop end) =====
  reply = reply.split("\n")[0];
  reply = reply.replace(/\.$/, "");

  // ===== VIP TAG =====
  if (senderID === VIP_UID) {
    reply = "⏤͟͟͞͞𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿  ꥟ " + reply;
  }

  return api.sendMessage(reply, threadID, messageID);
};

module.exports.run = async function ({ api, event }) {
  return api.sendMessage("আমি তো স্মার্ট বেবি 😌 ডাকলেই হাজির 💖", event.threadID, event.messageID);
};
