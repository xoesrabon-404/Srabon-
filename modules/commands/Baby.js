const axios = require("axios");

let simsim = "";

// Load API
(async () => {
  try {
    const res = await axios.get(
      "https://raw.githubusercontent.com/rxabdullah0007/rX-apis/main/xApis/rXallApi.json"
    );
    if (res.data && res.data.baby) {
      simsim = res.data.baby;
    }
  } catch (e) {
    console.log("❌ API load failed");
  }
})();

module.exports.config = {
  name: "baby",
  version: "1.0.9",
  hasPermssion: 0,
  credits: "Jihad",
  description: "Baby AI chat bot with auto trigger & reply",
  commandCategory: "chat",
  usages: "[query]",
  cooldowns: 0,
  prefix: false
};

// ================= RUN =================
module.exports.run = async function ({ api, event, args, Users }) {
  if (!simsim) return api.sendMessage("❌ API not loaded yet.", event.threadID);

  const senderName = await Users.getNameUser(event.senderID);
  const query = args.join(" ").toLowerCase();

  try {
    const res = await axios.get(
      `${simsim}/simsimi?text=${encodeURIComponent(
        query
      )}&senderName=${encodeURIComponent(senderName)}`
    );
    return api.sendMessage(res.data.response, event.threadID);
  } catch (e) {
    return api.sendMessage(`❌ Error: ${e.message}`, event.threadID);
  }
};

// ================= HANDLE REPLY =================
module.exports.handleReply = async function ({ api, event, Users }) {
  if (!simsim) return;
  const text = event.body?.toLowerCase();
  if (!text) return;

  const senderName = await Users.getNameUser(event.senderID);

  try {
    const res = await axios.get(
      `${simsim}/simsimi?text=${encodeURIComponent(
        text
      )}&senderName=${encodeURIComponent(senderName)}`
    );
    return api.sendMessage(res.data.response, event.threadID);
  } catch (e) {
    return api.sendMessage(`❌ Error: ${e.message}`, event.threadID);
  }
};

// ================= HANDLE EVENT =================
module.exports.handleEvent = async function ({ api, event, Users }) {
  if (!simsim) return;

  const text = event.body?.toLowerCase().trim();
  if (!text) return;

  const senderName = await Users.getNameUser(event.senderID);

  // 🔥 All triggers
  const triggers = [
    "baby","bby","bbz",
    "xan","xann","xannu",
    "jan","janu","jann",
    "জান","জানু","বেবি",
    "mari","মারিয়া"
  ];

  // ===== Only trigger word =====
  if (triggers.includes(text)) {
    const replies = [
      "⏤͟͟͞͞𝐴𝑠𝑠𝑎𝑙𝑎𝑚𝑢𝑙𝑎𝑖𝑘𝑢𝑚 𝑆𝑖𝑟 𝐾𝑖𝑣𝑎𝑏𝑒 ℎ𝑒𝑙𝑝 𝑘𝑜𝑟𝑡𝑒 𝑝𝑎𝑟𝑖..??",
      "বলেন sir__😌",
      "𝐁𝐨𝐥𝐨 𝐣𝐚𝐧 𝐤𝐢 𝐤𝐨𝐫𝐭𝐞 𝐩𝐚𝐫𝐢 𝐭𝐨𝐦𝐫 𝐣𝐨𝐧𝐧𝐨 ☻",
      "⏤͟͟͞͞𝐴𝑠𝑠𝑎𝑙𝑎𝑚𝑢𝑙𝑎𝑖𝑘𝑢𝑚 𝑆𝑖𝑟 \n\n\n\n 𝐽𝑖ℎ𝑎𝑑 𝐶ℎ𝑎𝑡 𝑏𝑜𝑡 𝐻𝑜𝑤 𝑐𝑎𝑛 𝐼 ℎ𝑒𝑙𝑝 𝑌𝑜𝑢 𝑇𝑜𝑑𝑦....??",
      "জিহাদ কে দেখছো ..? খুজে পাচ্ছি না 🥺☹️",
      "জিহাদ কে দেখছো ..? খুজে পাচ্ছি না 🥺☹️",
      "জিহাদ কে দেখছো ..? খুজে পাচ্ছি না 🥺☹️",
      "⏤͟͟͞͞𝐴𝑠𝑠𝑎𝑙𝑎𝑚𝑢𝑙𝑎𝑖𝑘𝑢𝑚 𝐷𝑒𝑎𝑟 💕\n\n\n\n 𝐻𝑜𝑤 𝑐𝑎𝑛 𝐼 ℎ𝑒𝑙𝑝 𝑌𝑜𝑢....??",
      "আম গাছে আম নাই ঢিল কেন মারো, তোমার সাথে প্রেম নাই বেবি কেন ডাকো 😒",
      "──‎ 𝐇𝐮𝐌..? 👉👈",
      "আম গাছে আম নাই ঢিল কেন মারো, তোমার সাথে প্রেম নাই বেবি কেন ডাকো 😒",
      "কি হলো, মিস টিস করচ্ছো নাকি 🤣",
      "𝑇𝑟𝑢𝑠𝑡 𝑀𝑒 𝐼 𝑎𝑚 𝐵𝑎𝑏𝑦 🧃",
      "baby baby করলে মেরে তোর মাথা ফাটাই দিবো 😒🔪"
    ];

    return api.sendMessage(
      replies[Math.floor(Math.random() * replies.length)],
      event.threadID
    );
  }

  // ===== Prefix chat =====
  const matchPrefix =
    /^(baby|bby|bbz|xan|xann|xannu|jan|janu|jann|জান|জানু|বেবি|mari|মারিয়া)\s+/i;

  if (matchPrefix.test(text)) {
    const q = text.replace(matchPrefix, "").trim();
    if (!q) return;

    try {
      const res = await axios.get(
        `${simsim}/simsimi?text=${encodeURIComponent(
          q
        )}&senderName=${encodeURIComponent(senderName)}`
      );
      return api.sendMessage(res.data.response, event.threadID);
    } catch (e) {
      return api.sendMessage(`❌ Error: ${e.message}`, event.threadID);
    }
  }
};
