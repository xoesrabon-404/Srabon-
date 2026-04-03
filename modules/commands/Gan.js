const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "gan",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Jihad",
  description: "Auto sad song player (all audio, no video)",
  commandCategory: "auto",
  usages: "",
  cooldowns: 0,
  prefix: false
};

// 🎧 Updated 18 ta sad song link
const deepSongs = [
  "https://files.catbox.moe/5ja7m0.mp3",
  "https://files.catbox.moe/3jvltj.mp3",
  "https://files.catbox.moe/uek891.mp3",
  "https://files.catbox.moe/t247gm.mp3",
  "https://files.catbox.moe/k4b4tu.mp3",
  "https://files.catbox.moe/xk2c4o.mp3",
  "https://files.catbox.moe/jh1aaz.mp3",
  "https://files.catbox.moe/zrx5l4.mp3",
  "https://files.catbox.moe/0q92xk.mp3",
  "https://files.catbox.moe/6qu82o.mp3",
  "https://files.catbox.moe/fzw82f.mp3",
  "https://files.catbox.moe/0803sk.mp3",
  "https://files.catbox.moe/baad8f.mp3",
  "https://files.catbox.moe/36ilnv.mp3",
  "https://files.catbox.moe/ffy7ju.mp3",
  "https://files.catbox.moe/3f9wg9.mp3",
  "https://files.catbox.moe/93wspb.mp3",
  "https://files.catbox.moe/nh5qvn.mp3"
];

const songProgress = {};

module.exports.handleEvent = async function({ api, event }) {
  const msgRaw = event.body;
  if (!msgRaw) return;

  const msg = msgRaw.toLowerCase();
  const threadID = event.threadID;
  const messageID = event.messageID;

  // Next song reply
  if (event.type === "message_reply" && ["next", "arekta"].includes(msg.trim())) {
    const progress = songProgress[threadID];
    if (!progress || progress.msgID !== event.messageReply?.messageID) return;

    const nextIndex = (progress.index + 1) % deepSongs.length;
    await sendSong(api, threadID, nextIndex, messageID);
    return;
  }

  // Trigger word → "gan"
  if (msg.includes("gan")) {
    const randomIndex = Math.floor(Math.random() * deepSongs.length);
    await sendSong(api, threadID, randomIndex, messageID);
    return;
  }
};

async function sendSong(api, threadID, index, replyToID) {
  const url = deepSongs[index];
  const fileName = `sad_${index}.mp3`;
  const filePath = path.join(__dirname, fileName);

  try {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(filePath, res.data);

    api.sendMessage({
      body: "🅹🅸🅷️🅰🅳 ️🅷️🅰🆂️🅰🅽",
      attachment: fs.createReadStream(filePath)
    }, threadID, (err, info) => {
      fs.unlinkSync(filePath);
      if (!err) songProgress[threadID] = { index, msgID: info.messageID };
    }, replyToID);

  } catch (e) {
    console.log("❌ Error:", e.message);
  }
}

module.exports.run = () => {};
