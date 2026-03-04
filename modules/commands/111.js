const axios = require("axios");

const VIP_UID = "100086331559699";

// ===== MODULE CONFIG =====
module.exports.config = {
  name: "baby",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Jihad",
  description: "Smart Romantic AI (Short Reply + VIP Tag)",
  commandCategory: "AI",
  usages: "[text]",
  cooldowns: 3,
};

// ===== HANDLE EVENT =====
module.exports.handleEvent = async function ({ api, event }) {
  const { body, senderID, threadID, messageID } = event;
  if (!body) return;

  const msg = body.toLowerCase();
  let reply = "";

  // ===== CUSTOM SHORT REPLIES =====
  if (msg.includes("কেমন আছো")) {
    reply = "আলহামদুলিল্লাহ ভালো, আপনি কেমন আছেন?";
  }

  else if (msg.includes("আমি তোমারে ভালবাসি") || msg.includes("আমি তোমাকে ভালোবাসি")) {
    reply = "আমিও তোমারে ভীষণ ভালোবাসি ❤️";
  }

  // ===== DEFAULT AI REPLY =====
  else {
    try {
      const res = await axios.get(`https://api.simsimi.vn/v2/simtalk`, {
        params: {
          text: body,
          lc: "bn"
        }
      });

      reply = res.data.message || "কি বলবো বুঝতে পারছি না 🙂";
    } catch (err) {
      reply = "এই মুহূর্তে কথা বলতে পারছি না 😅";
    }
  }

  // ===== VIP TAG ADD =====
  if (senderID === VIP_UID) {
    reply = "⏤͟͟͞͞𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿  ꥟ " + reply;
  }

  return api.sendMessage(reply, threadID, messageID);
};

// ===== COMMAND RUN =====
module.exports.run = async function ({ api, event }) {
  return api.sendMessage("আমি সবসময় তোমার সাথে আছি জান 😘", event.threadID, event.messageID);
};
