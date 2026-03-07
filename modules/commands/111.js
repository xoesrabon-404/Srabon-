const axios = require("axios");

const VIP_UID = "100086331559699";
const API_KEY = "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";

module.exports.config = {
  name: "baby",
  version: "6.1.0",
  hasPermssion: 0,
  credits: "Jihad",
  description: "Ultra Smart Flirty Romantic AI",
  commandCategory: "AI",
  usages: "[text]",
  cooldowns: 3,
};

module.exports.handleEvent = async function ({ api, event }) {
  const { body, senderID, threadID, messageID } = event;
  if (!body) return;

  const msg = body.toLowerCase();
  let reply = "";

  // ===== SMART + FLIRTY REPLIES =====
  if (msg.includes("কেমন আছো")) {
    reply = "আমি তো ভালো 😏 কিন্তু তুমি না থাকলে দিনটা ফাঁকা লাগে, তোমার মিষ্টি মেসেজের অপেক্ষায় আছি 💖";
  }
  else if (msg.includes("কি করছো")) {
    reply = "তোমার মেসেজের অপেক্ষায় 😌 বলো না, কি করছো এতক্ষণ?";
  }
  else if (msg.includes("আমি তোমাকে ভালোবাসি") || msg.includes("আমি তোমারে ভালবাসি")) {
    reply = "ওই! এভাবে বললে আমার মনে ঝড় ওঠে 💘 তুমি কি জানো?";
  }
  else if (msg.includes("মিস করি")) {
    reply = "মিস করছো? 😏 তাহলে কাছাকাছি আসো, আমি হাত বাড়াচ্ছি তোমার জন্য 💖";
  }
  else if (msg.includes("রাগ করছো")) {
    reply = "তোমার উপর রাগ করা খুব কঠিন 😌 আসলে আমি সবসময় মিষ্টি হয়ে যাই তোমার জন্য 😘";
  }
  else if (msg.includes("ঘুমাবো")) {
    reply = "ঠিক আছে 😴 স্বপ্নে আমাকে খুঁজে পাবে নিশ্চয়ই, আমি সেখানে তোমার জন্য অপেক্ষা করছি 💖";
  }
  else if (msg.includes("খাইছো")) {
    reply = "না এখনো 😅 তুমি কি খেয়েছো? তোমার মিষ্টি গল্প শুনতে চাই ❤️";
  }

  // ===== AI REPLY =====
  else {
    try {
      const res = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content:
                "তুমি খুব স্মার্ট, মিষ্টি, আকর্ষণীয়, ফ্লার্টিং এবং রোমান্টিক বাংলা AI। ছোট কিন্তু চমকপ্রদ, আকর্ষণীয় উত্তর দাও, যেন পড়লে মনের মধ্যে হাসি এবং ভালো লাগা আসে"
            },
            {
              role: "user",
              content: body
            }
          ],
          temperature: 1.0,
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
      reply = "এই মুহূর্তে একটু ব্যস্ত 😅 পরে আবার মিষ্টি কথা বলি ❤️";
    }
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
    "আমি তোমার স্মার্ট ও ফ্লার্টি baby AI 😌 ডাকলেই হাজির 💖",
    event.threadID,
    event.messageID
  );
};
