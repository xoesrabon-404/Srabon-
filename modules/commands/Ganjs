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

// 🎧 Updated 33 ta sad song link
const deepSongs = [
  // আগের 18টা
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
  "https://files.catbox.moe/nh5qvn.mp3",

  // নতুন 15টা
  "https://files.catbox.moe/swq8kr.mp3",
  "https://files.catbox.moe/6pdb9y.mp3",
  "https://files.catbox.moe/7a5pr6.mp3",
  "https://files.catbox.moe/evadyw.mp3",
  "https://files.catbox.moe/y18o74.mp3",
  "https://files.catbox.moe/rikix3.mp3",
  "https://files.catbox.moe/xvojq8.mp3",
  "https://files.catbox.moe/dk3rja.mp3",
  "https://files.catbox.moe/d037xu.mp3",
  "https://files.catbox.moe/dd2x6q.mp3",
  "https://files.catbox.moe/q07y8p.mp3",
  "https://files.catbox.moe/jcrgg4.mp3",
  "https://files.catbox.moe/25hj1k.mp3",
  "https://files.catbox.moe/uikbxb.mp3",
  "https://files.catbox.moe/ik545w.mp3"
];

const songProgress = {};

module.exports.handleEvent = async function({ api, event }) {
  const msgRaw = event.body;
  if (!msgRaw) return;

  const msg = msgRaw.toLowerCase();
  const threadID = event.threadID;
  const messageID = event.messageID;

  if (event.type === "message_reply" && ["next", "arekta"].includes(msg.trim())) {
    const progress = songProgress[threadID];
    if (!progress || progress.msgID !== event.messageReply?.messageID) return;

    const nextIndex = (progress.index + 1) % deepSongs.length;
    await sendSong(api, threadID, nextIndex, messageID);
    return;
  }

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
      body: "🎀𝑆𝑅𝐴𝐵𝑂𝑁 𝐶𝐻𝐴𝑇 𝐵𝑂𝑇 🎀\n 𝓡𝓮𝓹𝓵𝔂 𝓽𝓸 'next' 𝓯𝓸𝓻 𝓷𝓮𝔀 𝓖𝓪𝓷",
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
