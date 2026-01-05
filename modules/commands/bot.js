const axios = require("axios");

module.exports.config = {
  name: "bot",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "rX Abdullah",
  description: "Maria custom frame only first time, then normal AI chat",
  commandCategory: "noprefix",
  usages: "bot",
  cooldowns: 3
};

// Invisible marker
const marker = "\u700B";
function withMarker(text) {
  return text + marker;
}

// Sessions
const sessions = {};

// Maria API endpoint
const MARIA_API_URL = "https://maria-languages-model.onrender.com/api/chat";

// Custom replies
const replies = [
  "𝕁𝕚 𝕊𝕚𝕣 𝕓𝕠𝕝𝕖𝕟 𝕜𝕚 𝕜𝕠𝕣𝕥𝕖 𝕡𝕒𝕣𝕚 ______💮🪽",
  "𝔸𝕞𝕒𝕣 𝕓𝕠𝕤𝕤 𝕁𝕚𝕙𝕒𝕕 k 𝔾𝕗 𝕕𝕒𝕨 ____💮👀",
  "শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নাই🥺",
  "ℍ𝕦𝕦𝕦 𝕏𝕒𝕟𝕟 𝕓𝕠𝕝𝕠 𝕒𝕞𝕚 𝕒𝕔𝕙𝕚 ......💮🐰",
  "এতো ডেকো না, প্রেমে পরে যাবো 🙈",
  "বার বার ডাকলে মাথা গরম হয়ে যায়😑",
  "এতো ডাকছিস কেন? 😒"
];

module.exports.handleEvent = async function ({ api, event, Users }) {
  const { threadID, messageID, body, senderID, messageReply } = event;
  if (!body) return;

  const name = await Users.getNameUser(senderID);

  // STEP 1: User types "bot"
  if (body.trim().toLowerCase() === "bot") {
    sessions[senderID] = { history: "", allowAI: true };

    const randReply = replies[Math.floor(Math.random() * replies.length)];

    const message =
`┏━━━━━❖❖━━━━━❖❖━━━━━┓
      🐰 𝔸𝕚 𝕒𝕤𝕤𝕚𝕤𝕥𝕒𝕟𝕥 🐰

  🌸 Dear : ${name}
  💬 Reply : ${randReply}

┗━━━━━❖❖━━━━━❖❖━━━━━┛`;

    try {
      await api.sendTypingIndicatorV2(true, threadID);
      await new Promise(r => setTimeout(r, 2500));
      await api.sendTypingIndicatorV2(false, threadID);
    } catch {}

    return api.sendMessage(withMarker(message), threadID, messageID);
  }

  // STEP 2: Reply to bot → AI chat
  if (
    messageReply &&
    messageReply.senderID === api.getCurrentUserID() &&
    messageReply.body?.includes(marker) &&
    sessions[senderID]
  ) {
    const userMsg = body.trim();
    if (!userMsg) return;

    api.setMessageReaction("⏳", messageID, () => {}, true);

    const creatorKeywords = ["tera creator", "developer kaun"];

    if (creatorKeywords.some(k => userMsg.toLowerCase().includes(k))) {
      api.setMessageReaction("✅", messageID, () => {}, true);
      return api.sendMessage(
        withMarker("👑 My creator Jihad hasan unhone muje banaya hai"),
        threadID,
        messageID
      );
    }

    sessions[senderID].history += `User: ${userMsg}\nMaria: `;

    try {
      await api.sendTypingIndicatorV2(true, threadID);
      await new Promise(r => setTimeout(r, 2000));
      await api.sendTypingIndicatorV2(false, threadID);
    } catch {}

    try {
      const resp = await axios.post(MARIA_API_URL, {
        user_id: senderID,
        query: sessions[senderID].history,
        meta: { need_realtime: true }
      });

      let reply = resp.data?.answer?.text || "🙂 I didn't understand.";
      reply = reply.replace(/openai/gi, "rX Abdullah");

      sessions[senderID].history += reply + "\n";

      api.setMessageReaction("✅", messageID, () => {}, true);
      return api.sendMessage(withMarker(reply), threadID, messageID);

    } catch (err) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      console.log(err);
      return api.sendMessage("❌ Maria API error.", threadID, messageID);
    }
  }
};

module.exports.run = () => {};
