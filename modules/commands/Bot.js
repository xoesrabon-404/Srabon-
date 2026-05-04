const axios = require("axios");

module.exports.config = {
  name: "bot",
  version: "3.0.3",
  hasPermission: 0,
  credits: "Srabon",
  description: "Maria first frame only, then normal AI chat plain",
  commandCategory: "noprefix",
  usages: "bot",
  cooldowns: 3
};

// Sessions memory
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
  "এতো ডাকছিস কেন? গালি শুনবি নাকি? 🤬",
  "বস বল বলদ মার্কা পোলাপান 😑",
  "আরে বলদ এতো ডাকিস কেন🤬",
  "আরে বুঝলাম তোমার birn পুটকিতে 🦍",
  "বট না বলে প্রতিদিন হাইহেন গু সব মাথাই😂",
  "⚡️boss শ্রাবন অনুমতি দেন তারে চুটকি মারি দেয়🦍",
  "কিরে বলদ কী বলবি বল 😏🤧"
];

module.exports.handleEvent = async function ({ api, event, Users }) {
  const { threadID, messageID, body, senderID, messageReply } = event;
  if (!body) return;

  const name = await Users.getNameUser(senderID);

  // STEP 1: First trigger "bot"
  if (body.trim().toLowerCase() === "bot") {
    sessions[senderID] = { history: "" };

    const rand = customReplies[Math.floor(Math.random() * customReplies.length)];

    const firstMessage = `┏━━━━━❖❖━━━━━❖❖━━━━━┓
      🐰Sʀᴀʙᴏɴ〆Cʜᴀᴛ〆Bᴏᴛ🐰

  🌸 Dear : ${name}
  💬 Reply : ⏤͟͟͞͞☻ ${rand}
┗━━━━━❖❖━━━━━❖❖━━━━━┛`;

    try {
      api.sendTypingIndicator(threadID); // সহজ টাইপিং ইন্ডিকেটর
    } catch (e) {}

    return api.sendMessage(firstMessage, threadID, messageID);
  }

  // STEP 2: Normal AI chat (Reply interaction)
  if (
    messageReply &&
    messageReply.senderID === api.getCurrentUserID() &&
    sessions[senderID]
  ) {
    const userMsg = body.trim();
    if (!userMsg) return;

    api.setMessageReaction("⏳", messageID, () => {}, true);

    // Developer details logic
    const creatorKeywords = ["creator", "developer", "owner", "বানাইছে"];
    if (creatorKeywords.some(k => userMsg.toLowerCase().includes(k))) {
      api.setMessageReaction("✅", messageID, () => {}, true);
      return api.sendMessage("👑 My creator is Srabon. He is my boss.", threadID, messageID);
    }

    try {
      // API call to Maria
      const resp = await axios.post(MARIA_API_URL, {
        user_id: senderID,
        query: userMsg, // সরাসরি ইউজার মেসেজ পাঠানো সেশনের জন্য ভালো
        meta: { need_realtime: true }
      });

      let reply = resp.data?.answer?.text || "🙂 I didn't understand.";
      
      // ব্র্যান্ডিং পরিবর্তন
      reply = reply.replace(/openai|google|gpt/gi, "Srabon");

      api.setMessageReaction("✅", messageID, () => {}, true);

      // Plain text reply
      return api.sendMessage(reply, threadID, messageID);

    } catch (err) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      console.error(err);
      return api.sendMessage("❌ সার্ভারে সমস্যা হচ্ছে, পরে চেষ্টা করো।", threadID, messageID);
    }
  }
};

module.exports.run = () => {};
