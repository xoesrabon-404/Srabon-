const axios = require("axios");

module.exports.config = {
  name: "bot",
  version: "3.0.2",
  hasPermssion: 0,
  credits: "rX Abdullah",
  description: "Maria first frame only, then normal AI chat plain",
  commandCategory: "noprefix",
  usages: "bot",
  cooldowns: 3
};

// Sessions
const sessions = {};

// Maria API endpoint
const MARIA_API_URL = "https://maria-languages-model.onrender.com/api/chat";

// Custom first message replies
const customReplies = [
  "বেশি Bot Bot করলে leave নিবো কিন্তু😒",
  "🥛-🍍👈 -লে খাহ্..!😒",
  "শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নাই🥺",
  "আমি আবাল দের সাথে কথা বলি না😒",
  "এতো ডেকো না, প্রেমে পরে যাবো 🙈",
  "বার বার ডাকলে মাথা গরম হয়ে যায়😑",
  "𝐓𝐨𝐫 𝐧𝐚𝐧𝐢𝐫 𝐮𝐢𝐝 𝐦𝐞 𝐝𝐞 𝐤𝐡𝐚𝐢 𝐝𝐢 𝐚𝐦𝐢 🦆",
  "এতো ডাকছিস কেন? গালি শুনবি নাকি? 🤬"
];

module.exports.handleEvent = async function ({ api, event, Users }) {
  const { threadID, messageID, body, senderID, messageReply } = event;
  if (!body) return;

  const name = await Users.getNameUser(senderID);

  // STEP 1: First trigger "bot"
  if (body.trim().toLowerCase() === "bot") {
    sessions[senderID] = { history: "" };

    const rand = customReplies[Math.floor(Math.random() * customReplies.length)];

    const firstMessage =
`┏━━━━━❖❖━━━━━❖❖━━━━━┓
      🐰𝑆𝑟𝑎𝑏𝑜𝑛 𝐶ℎ𝑎𝑇 𝐵𝑜𝑡🐰

  🌸 Dear : ${name}

  💬 Reply : ⏤͟͟͞͞☻ ${rand}
┗━━━━━❖❖━━━━━❖❖━━━━━┛`;

    try {
      await api.sendTypingIndicatorV2(true, threadID);
      await new Promise(r => setTimeout(r, 2000));
      await api.sendTypingIndicatorV2(false, threadID);
    } catch {}

    return api.sendMessage(firstMessage, threadID, messageID);
  }

  // STEP 2: Normal AI chat (plain text, no frame)
  if (
    messageReply &&
    messageReply.senderID === api.getCurrentUserID() &&
    sessions[senderID]
  ) {
    const userMsg = body.trim();
    if (!userMsg) return;

    api.setMessageReaction("⏳", messageID, () => {}, true);

    // Creator check
    const creatorKeywords = ["tera creator", "developer kaun"];
    if (creatorKeywords.some(k => userMsg.toLowerCase().includes(k))) {
      api.setMessageReaction("✅", messageID, () => {}, true);

      return api.sendMessage("👑 My creator rX Abdullah unhone muje banaya hai", threadID, messageID);
    }

    // Add to session memory
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

      // Plain text reply, no frame
      return api.sendMessage(reply, threadID, messageID);

    } catch (err) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      console.log(err);
      return api.sendMessage("❌ Maria API error.", threadID, messageID);
    }
  }
};

module.exports.run = () => {};
