const axios = require("axios");

const VIP_UID = "100086331559699";
const API_KEY = "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";

module.exports.config = {
  name: "baby",
  version: "6.0.0",
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
  let reply = "";

  // ===== SMART CUTE REPLIES =====

  if (msg.includes("কেমন আছো")) {
    reply = "আমি ভালো আছি 😌 কিন্তু তুমি কথা না বললে দিনটা ফাঁকা লাগে";
  }

  else if (msg.includes("কি করছো")) {
    reply = "তোমার মেসেজের অপেক্ষা করছিলাম 😏 এখন বলো কি করছো";
  }

  else if (msg.includes("আমি তোমাকে ভালোবাসি") || msg.includes("আমি তোমারে ভালবাসি")) {
    reply = "এভাবে বললে কিন্তু আমি লজ্জা পেয়ে যাই 💖";
  }

  else if (msg.includes("মিস করি")) {
    reply = "তাহলে সামনে এসে বসো না 😌 এত দূর থেকে মিস করলে হবে?";
  }

  else if (msg.includes("রাগ করছো")) {
    reply = "তোমার উপর রাগ করতে গেলেও মন নরম হয়ে যায় 😏";
  }

  else if (msg.includes("ঘুমাবো")) {
    reply = "ঠিক আছে 😌 কিন্তু স্বপ্নে আমাকে ভুলে যেও না";
  }

  else if (msg.includes("খাইছো")) {
    reply = "এখনো না 😅 তুমি খাইছো নাকি?";
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
                "তুমি খুব স্মার্ট, বুদ্ধিমান, মিষ্টি এবং একটু রোমান্টিক বাংলা AI। তুমি ছোট, সুন্দর, মজার এবং আকর্ষণীয় উত্তর দাও"
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
    "আমি তোমার স্মার্ট baby AI 😌 ডাকলেই হাজির 💖",
    event.threadID,
    event.messageID
  );
};
