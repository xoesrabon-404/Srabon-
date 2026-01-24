const axios = require("axios");

module.exports.config = {
  name: "bot",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "rX Abdullah",
  description: "Maria custom frame only first time, then normal AI chat",
  commandCategory: "noprefix",
  usages: "ai",
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

// Custom first message replies
const customReplies = [
  "মেরে তোর মাথা পাঠাই দিবো 😾",
  "🥛-🍍👈 -লে খাহ্..!😒",
  "শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নাই🥺",
  "জিহাদ কে দেখছো...?খুজে পাচ্ছি না",
  "এতো ডেকো না, প্রেমে পরে যাবো 🙈",
  "বার বার ডাকলে মাথা গরম হয়ে যায়😑",
  "⏤͟͟͞͞𝐴𝑠𝑠𝑎𝑙𝑎𝑚𝑢𝑙𝑎𝑖𝑘𝑢𝑚 𝑆𝑖𝑟 ☻ᥫ᭡\n𝐽𝑖ℎ𝑎𝑑 𝑐ℎ𝑎𝑡 𝑏𝑜𝑡 𝐻𝑜𝑤 𝑐𝑎𝑛 𝐼 ℎ𝑒𝑙𝑝 𝑦𝑜𝑢 𝑇𝑜𝑑𝑎𝑦...?",
  "এতো ডাকছিস কেন? গালি শুনবি নাকি? 🤬"
];

module.exports.handleEvent = async function({ api, event, Users }) {
  const { threadID, messageID, body, senderID, messageReply } = event;
  if (!body) return;

  const name = await Users.getNameUser(senderID);

  // ---------------------------------------------------------------------
  // STEP 1: User types "ai" → First stylish message only
  // ---------------------------------------------------------------------
  if (body.trim().toLowerCase() === "bot") {
    sessions[senderID] = { history: "", allowAI: true };

    const rand = customReplies[Math.floor(Math.random() * customReplies.length)];

    const firstMessage =
`╭─────༺♡༻─────╮
      ⏤͟͟͞͞𝐴𝑖 ⏤͟͟͞͞𝐴𝑠𝑠𝑖𝑠𝑡𝑎𝑛𝑡 ☻

 ☻ ⏤͟͟͞͞𝐷𝑒𝑎𝑟 ⏤͟͟͞͞${name},
 
 💌 ${rand}
╰─────༺♡༻─────╯`;

    try {
      await api.sendTypingIndicatorV2(true, threadID);
      await new Promise(r => setTimeout(r, 2500));
      await api.sendTypingIndicatorV2(false, threadID);
    } catch {}

    return api.sendMessage(withMarker(firstMessage), threadID, messageID);
  }

  // ---------------------------------------------------------------------
  // STEP 2: User replies to Maria → Normal AI message
  // ---------------------------------------------------------------------
  if (
    messageReply &&
    messageReply.senderID === api.getCurrentUserID() &&
    messageReply.body?.includes(marker) &&
    sessions[senderID]
  ) {
    const userMsg = body.trim();
    if (!userMsg) return;

    // Add ⏳ loading react
    api.setMessageReaction("🤔", messageID, () => {}, true);

    // If user asks about creator
    const creatorKeywords = [
      "tera creator", "developer kaun"
    ];

    if (creatorKeywords.some(k => userMsg.toLowerCase().includes(k))) {

      // SUCCESS ✔ react
      api.setMessageReaction("🫣", messageID, () => {}, true);

      return api.sendMessage(
        withMarker("👑 𝑀𝑦 𝑐𝑟𝑒𝑎𝑡𝑜𝑟 𝐽𝑖ℎ𝑎𝑑 𝑢𝑛ℎ𝑜𝑛𝑒 𝑚𝑢𝑗𝑒 𝑏𝑎𝑛𝑎𝑦𝑎 ℎ𝑎𝑖"),
        threadID,
        messageID
      );
    }

    // Add to session memory
    sessions[senderID].history += `User: ${userMsg}\n𝐴𝑖 𝑎𝑠𝑠𝑖𝑠𝑡𝑎𝑛𝑡 : `;

    try {
      await api.sendTypingIndicatorV2(true, threadID);
      await new Promise(r => setTimeout(r, 2000));
      await api.sendTypingIndicatorV2(false, threadID);
    } catch {}

    try {
      // Send to Maria API
      const resp = await axios.post(MARIA_API_URL, {
        user_id: senderID,
        query: sessions[senderID].history,
        meta: { need_realtime: true }
      });

      let reply = resp.data?.answer?.text || "🙂 I didn't understand.";

      // Replace OpenAI → rX Abdullah
      reply = reply.replace(/openai/gi, "rX Abdullah");

      sessions[senderID].history += reply + "\n";

      // SUCCESS ✔ react
      api.setMessageReaction("🫣", messageID, () => {}, true);

      // NORMAL plain answer
      return api.sendMessage(withMarker(reply), threadID, messageID);

    } catch (err) {

      // ERROR ❌ react
      api.setMessageReaction("❌", messageID, () => {}, true);

      console.log(err);
      return api.sendMessage("❌ 𝐽𝑖ℎ𝑎𝑑 𝐴𝑝𝑖 𝐸𝑟𝑟𝑜𝑟.", threadID, messageID);
    }
  }
};

module.exports.run = () => {};
