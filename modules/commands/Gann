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

// 🎧 Updated 42 ta sad song link (সবই audio/mp3)
const deepSongs = [
  "https://files.catbox.moe/npzr5e.mp3",
  "https://files.catbox.moe/5ydg4o.mp3",
  "https://files.catbox.moe/plvu6e.mp3",
  "https://files.catbox.moe/l8imf9.mp3",
  "https://files.catbox.moe/7gw7ge.mp3",
  "https://files.catbox.moe/g18htz.mp3",
  "https://files.catbox.moe/ro4gnj.mp3",
  "https://files.catbox.moe/htozxk.mp3",
  "https://files.catbox.moe/lljano.mp3",
  "https://files.catbox.moe/shv748.mp3",
  "https://files.catbox.moe/u481dw.mp3",
  "https://files.catbox.moe/qz28kf.mp3",
  "https://files.catbox.moe/1slikp.mp3",
  "https://files.catbox.moe/j1b9fa.mp3",
  "https://files.catbox.moe/28orw2.mp3",
  "https://files.catbox.moe/wvbd4s.mp3",
  "https://files.catbox.moe/3bvlso.mp3",
  "https://files.catbox.moe/pydnnw.mp3",
  "https://files.catbox.moe/cxhmq2.mp4",
  "https://files.catbox.moe/i2n8y4.mp3",
  "https://files.catbox.moe/07cnwl.mp3",
  "https://files.catbox.moe/6tx7g5.mp3",
  "https://files.catbox.moe/ceviu5.mp3",
  "https://files.catbox.moe/e07g3g.mp3",
  "https://files.catbox.moe/ihcw9h.mp3",
  "https://files.catbox.moe/1qy9o8.mp3",
  "https://files.catbox.moe/yepi69.mp4",
  "https://files.catbox.moe/q5f21o.mp3",
  "https://files.catbox.moe/0yqdwg.mp3",
  "https://files.catbox.moe/36jnhy.mp3",
  "https://files.catbox.moe/ju2lkr.mp3",
  "https://files.catbox.moe/4r9nt8.mp3",
  "https://files.catbox.moe/qk7f3w.mp3",
  "https://files.catbox.moe/m7hy14.mp3",
  "https://files.catbox.moe/bln6en.mp4",
  "https://files.catbox.moe/rpl5uy.mp4",
  "https://files.catbox.moe/1fg3k4.mp4",
  "https://files.catbox.moe/xftwwi.mp3",
  "https://files.catbox.moe/zrkary.mp3",
  "https://files.catbox.moe/f98rp3.mp3",
  "https://files.catbox.moe/sm4h5z.mp3",
  "https://files.catbox.moe/65miuh.mp4"
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
  const fileName = `sad_${index}.mp3`; // সবকিছু mp3 হিসেবে
  const filePath = path.join(__dirname, fileName);

  try {
    const res = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(filePath, res.data);

    api.sendMessage({
      body: "𝑆𝑅𝐴𝐵𝑂𝑁 𝐶𝐻𝐴𝑇 𝐵𝑂𝑇n 𝓡𝓮𝓹𝓵𝔂 𝓽𝓸 'next' 𝓯𝓸𝓻 𝓷𝓮𝔀 𝓖𝓪𝓷",
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
