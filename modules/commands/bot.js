const axios = require("axios");
const fs = global.nodemodule["fs-extra"];

const apiJsonURL = "https://raw.githubusercontent.com/rummmmna21/rx-api/refs/heads/main/baseApiUrl.json";

module.exports.config = {
  name: "obot",
  version: "1.2.3",
  hasPermssion: 0,
  credits: "𝐫𝐗",
  description: "Maria Baby-style reply system with typing effect",
  commandCategory: "noprefix",
  usages: "bot / বট",
  cooldowns: 3
};

// RX API fetch
async function getRxAPI() {
  try {
    const res = await axios.get(apiJsonURL);
    if (res.data && res.data.rx) return res.data.rx;
    throw new Error("rx key not found");
  } catch (e) {
    console.error("RX API error:", e.message);
    return null;
  }
}

// marker
const marker = "\u200B";
function withMarker(text) {
  return text + marker;
}

module.exports.handleEvent = async function({ api, event, Users }) {
  const { threadID, messageID, body, senderID, messageReply, mentions } = event;
  if (!body) return;

  const name = await Users.getNameUser(senderID);

  // ✅ Two target UIDs
  const TARGET_IDS = ["61555373897001", "61559621819754"];

  if (
    body.trim().toLowerCase() === "bot" ||
    (mentions && Object.keys(mentions).some(id => TARGET_IDS.includes(id)))
  ) {
    const replies = [
      "𝕁𝕚 𝕊𝕚𝕣 𝕓𝕠𝕝𝕖𝕟 𝕜𝕚 𝕜𝕠𝕣𝕥𝕖 𝕡𝕒𝕣𝕚 ______💮🪽",
      "𝔸𝕞𝕒𝕣 𝕓𝕠𝕤𝕤 𝕁𝕚𝕙𝕒𝕕 k 𝔾𝕗 𝕕𝕒𝕨 ____💮👀",
      "শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নাই🥺",
      "ℍ𝕦𝕦𝕦 𝕏𝕒𝕟𝕟 𝕓𝕠𝕝𝕠 𝕒𝕞𝕚 𝕒𝕔𝕙𝕚 ......💮🐰",
      "এতো ডেকো না, প্রেমে পরে যাবো 🙈",
      "বার বার ডাকলে মাথা গরম হয়ে যায়😑",
      "এতো ডাকছিস কেন? 😒"
    ];
    const randReply = replies[Math.floor(Math.random() * replies.length)];

    // ✅ NEW BOX STYLE
    const message =
`┏━━━━━❖❖━━━━━❖❖━━━━━┓
      🐰 𝔸𝕚 𝕒𝕤𝕤𝕚𝕤𝕥𝕒𝕟𝕥 🐰

  🌸 Dear : ${name}
  💬 Reply : ${randReply}

┗━━━━━❖❖━━━━━❖❖━━━━━┛`;

    try {
      await api.sendTypingIndicatorV2(true, threadID);
      await new Promise(r => setTimeout(r, 5000));
      await api.sendTypingIndicatorV2(false, threadID);
    } catch {}

    return api.sendMessage(withMarker(message), threadID, messageID);
  }

  // reply trigger
  if (
    messageReply &&
    messageReply.senderID === api.getCurrentUserID() &&
    messageReply.body?.includes(marker)
  ) {
    const replyText = body.trim();
    if (!replyText) return;

    const rxAPI = await getRxAPI();
    if (!rxAPI) return api.sendMessage("❌ RX API load failed.", threadID, messageID);

    try {
      await api.sendTypingIndicatorV2(true, threadID);
      await new Promise(r => setTimeout(r, 2000));
      await api.sendTypingIndicatorV2(false, threadID);
    } catch {}

    try {
      const res = await axios.get(
        `${rxAPI}/simsimi?text=${encodeURIComponent(replyText)}&senderName=${encodeURIComponent(name)}`
      );
      const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

      for (const reply of responses) {
        await new Promise(resolve => {
          api.sendMessage(withMarker(reply), threadID, () => resolve(), messageID);
        });
      }
    } catch (err) {
      return api.sendMessage(`| Error: ${err.message}`, threadID, messageID);
    }
  }
};

module.exports.run = function() {};
