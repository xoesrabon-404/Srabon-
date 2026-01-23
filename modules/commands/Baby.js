const axios = require("axios");
const simsim = "https://api.cyber-ninjas.top";

module.exports.config = {
  name: "baby",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "Jihad",
  description: "Baby AI with true reply detection",
  commandCategory: "fun",
  usages: "baby",
  cooldowns: 0
};

/* ───────── AUTO TRIGGER ───────── */
module.exports.handleEvent = async function ({ api, event, Users }) {
  if (!event.body) return;

  const text = event.body.toLowerCase().trim();
  const triggers = ["baby", "bot", "bby", "বেবি", "বট"];
  if (!triggers.includes(text)) return;

  const threadID = event.threadID;
  const senderID = event.senderID;

  const replies = [
    "Bolo baby 💖",
    "হ্যাঁ গো জান বলো 🙂",
    "Hea baby 😚"
  ];

  api.sendMessage(
    replies[Math.floor(Math.random() * replies.length)],
    threadID,
    (err, info) => {
      if (!err) {
        global.client.handleReply.push({
          name: "baby",
          author: senderID,
          messageID: info.messageID
        });
      }
    }
  );
};

/* ───────── HANDLE REPLY (REAL) ───────── */
module.exports.handleReply = async function ({ api, event, handleReply, Users }) {

  // 🔥 এটা না থাকলে কাজই করবে না
  if (event.type !== "message_reply") return;

  // 🔒 শুধু bot-এর ওই মেসেজে reply হলে
  if (event.messageReply.messageID !== handleReply.messageID) return;

  if (event.senderID !== handleReply.author) return;
  if (!event.body) return;

  const threadID = event.threadID;
  const senderID = event.senderID;
  const text = event.body.toLowerCase().trim();
  const senderName = await Users.getNameUser(senderID);

  try {
    const res = await axios.get(
      `${simsim}/simsimi?text=${encodeURIComponent(text)}&senderName=${encodeURIComponent(senderName)}`
    );

    let replyText = res.data.response || "hmm baby 😚";
    if (Array.isArray(replyText)) replyText = replyText[0];

    api.sendMessage(
      {
        body: replyText,
        replyTo: event.messageID
      },
      threadID,
      (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            name: "baby",
            author: senderID,
            messageID: info.messageID
          });
        }
      }
    );
  } catch (e) {
    api.sendMessage(
      {
        body: "Baby busy 🥺",
        replyTo: event.messageID
      },
      threadID
    );
  }
};

/* ───────── PREFIX COMMAND ───────── */
module.exports.run = async function ({ api, event }) {
  api.sendMessage(
    "শুধু `baby` লিখো, তারপর bot-এর মেসেজে reply দাও 😚",
    event.threadID
  );
};
