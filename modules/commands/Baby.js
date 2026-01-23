const axios = require("axios");
const simsim = "https://api.cyber-ninjas.top";

module.exports.config = {
  name: "baby",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Jihad",
  description: "Cute AI Baby Chatbot (Auto Teach + Typing)",
  commandCategory: "fun",
  usages: "baby [text] | baby teach Q - A | baby list",
  cooldowns: 0
};

// ───────────── COMMAND ─────────────
module.exports.run = async function ({ api, event, args, Users }) {
  const threadID = event.threadID;
  const senderID = event.senderID;
  const senderName = await Users.getNameUser(senderID);
  const query = args.join(" ").trim().toLowerCase();

  const sendTyping = async () => {
    try {
      if (api.sendTypingIndicatorV2)
        await api.sendTypingIndicatorV2(threadID, true);
      await new Promise(r => setTimeout(r, 2500));
      if (api.sendTypingIndicatorV2)
        await api.sendTypingIndicatorV2(threadID, false);
    } catch (e) {}
  };

  try {
    // শুধু baby
    if (!query) {
      await sendTyping();
      const ran = ["হ্যাঁ গো জান বলো 🙂", "Bolo baby 💖", "Hea baby 😚"];
      return api.sendMessage(
        ran[Math.floor(Math.random() * ran.length)],
        threadID,
        (err, info) => {
          if (!err)
            global.client.handleReply.push({
              name: "baby",
              author: senderID,
              messageID: info.messageID
            });
        }
      );
    }

    // ─── teach ───
    if (args[0] === "teach") {
      const data = query.replace("teach ", "").split(" - ");
      if (data.length < 2)
        return api.sendMessage(
          "Use: baby teach প্রশ্ন - উত্তর",
          threadID
        );

      const [ask, ans] = data;
      const res = await axios.get(
        `${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(senderName)}`
      );
      return api.sendMessage(
        res.data.message || "শিখে ফেলেছি জান 😚",
        threadID
      );
    }

    // ─── list ───
    if (args[0] === "list") {
      const res = await axios.get(`${simsim}/list`);
      if (res.data.code === 200) {
        return api.sendMessage(
          `♾ Total Questions: ${res.data.totalQuestions}\n★ Replies: ${res.data.totalReplies}\n👑 Author: ${res.data.author}`,
          threadID
        );
      }
      return api.sendMessage("List আনতে পারিনি 🥲", threadID);
    }

    // ─── normal chat ───
    await sendTyping();
    const res = await axios.get(
      `${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`
    );

    const replies = Array.isArray(res.data.response)
      ? res.data.response
      : [res.data.response];

    if (!replies || replies.length === 0) {
      await axios.get(
        `${simsim}/teach?ask=${encodeURIComponent(query)}&ans=${encodeURIComponent("hmm baby 😚 (auto learned)")}&senderName=${encodeURIComponent(senderName)}`
      );
      return api.sendMessage("hmm baby 😚", threadID);
    }

    for (const msg of replies) {
      api.sendMessage(
        msg,
        threadID,
        (err, info) => {
          if (!err)
            global.client.handleReply.push({
              name: "baby",
              author: senderID,
              messageID: info.messageID
            });
        }
      );
    }
  } catch (e) {
    api.sendMessage("Baby error 🥺", threadID);
  }
};

// ───────────── HANDLE REPLY ─────────────
module.exports.handleReply = async function ({ api, event, handleReply, Users }) {
  const threadID = event.threadID;
  const senderID = event.senderID;
  const text = event.body?.toLowerCase().trim();
  if (!text) return;

  const senderName = await Users.getNameUser(senderID);

  try {
    const res = await axios.get(
      `${simsim}/simsimi?text=${encodeURIComponent(text)}&senderName=${encodeURIComponent(senderName)}`
    );

    const replies = Array.isArray(res.data.response)
      ? res.data.response
      : [res.data.response];

    if (!replies || replies.length === 0) {
      await axios.get(
        `${simsim}/teach?ask=${encodeURIComponent(text)}&ans=${encodeURIComponent("hmm baby 😚 (auto learned)")}&senderName=${encodeURIComponent(senderName)}`
      );
      return api.sendMessage("hmm baby 😚", threadID);
    }

    for (const msg of replies) {
      api.sendMessage(
        msg,
        threadID,
        (err, info) => {
          if (!err)
            global.client.handleReply.push({
              name: "baby",
              author: senderID,
              messageID: info.messageID
            });
        }
      );
    }
  } catch (e) {
    api.sendMessage("Reply error baby 😿", threadID);
  }
};

// ───────────── AUTO CHAT ─────────────
module.exports.handleEvent = async function ({ api, event, Users }) {
  if (!event.body) return;
  const text = event.body.toLowerCase().trim();
  const threadID = event.threadID;
  const senderID = event.senderID;
  const senderName = await Users.getNameUser(senderID);

  const triggers = ["baby", "bot", "bby", "বেবি", "বট", "oi", "oii", "jan"];
  if (!triggers.includes(text)) return;

  const replies = [
    "হ্যাঁ গো জান বলো 🙂",
    "⏤͟͟͞͞𝐻𝑒𝑎 𝐽𝑎𝑛𝑛 𝐵𝑜𝑙𝑜 𝐴𝑚𝑖 𝑎𝑐𝑖 ᥫ᭡",
    "জিহাদ কে দেখছো? 🥺",
    "ডাকিস না, তুই পচা 😼"
  ];

  api.sendMessage(
    replies[Math.floor(Math.random() * replies.length)],
    threadID,
    (err, info) => {
      if (!err)
        global.client.handleReply.push({
          name: "baby",
          author: senderID,
          messageID: info.messageID
        });
    }
  );
};
