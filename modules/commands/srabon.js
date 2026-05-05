const axios = require("axios");

module.exports.config = {
  name: "SRABON-AI",
  version: "6.0.0",
  hasPermssion: 0,
  credits: "SRABON",
  description: "শ্রাবণ বললে সাড়া দিবে এবং সুপার ফাস্ট রিপ্লাই দিবে",
  commandCategory: "ai",
  usages: "শ্রাবণ [মেসেজ]",
  cooldowns: 2,
  dependencies: { "axios": "" }
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!body || senderID == api.getCurrentUserID()) return;

  const text = body.toLowerCase().trim();
  const GROQ_API_KEY = "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"; 
  const VIP_UID = "100023401563213"; // Boss SRABON

  // ১. ট্রিগার চেক: যদি মেসেজের মধ্যে "srabon" বা "শ্রাবণ" থাকে
  const botTriggers = ["srabon", "শ্রাবণ", "srabon ai", "ai srabon"];
  const isTriggered = botTriggers.some(t => text.includes(t)) || 
                      (messageReply && messageReply.senderID === api.getCurrentUserID());

  if (!isTriggered) return;

  try {
    let mood = "smart and confident";
    try {
      const userInfo = await api.getUserInfo(senderID);
      const gender = userInfo[senderID].gender;
      if (gender === 1) mood = "romantic and flirty"; 
    } catch (e) {}

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: `You are SRABON AI, developed by Boss SRABON. Reply in 1-2 lines. Mood: ${mood}.` 
          },
          { role: "user", content: text }
        ],
        temperature: 0.8
      },
      {
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let reply = response.data.choices[0].message.content;

    if (senderID === VIP_UID) {
      reply = "👑 Boss SRABON 🔥\n" + reply;
    }

    return api.sendMessage(reply, threadID, messageID);

  } catch (err) {
    // লিমিট শেষ হলে মেসেজ দিবে
    if (err.response && err.response.status === 429) {
      return api.sendMessage("depression 🐸", threadID, messageID);
    }
  }
};

module.exports.run = async function ({}) {};
