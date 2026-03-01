const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "gan",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "Jihad",
  description: "Sad song player (FORCE PREFIX ONLY)",
  commandCategory: "media",
  usages: ".gan",
  cooldowns: 0
};

// 🎧 42 ta sad song link (audio only)
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

// 🔁 reply handler (next / arekta)
module.exports.handleEvent = async ({ api, event }) => {
  if (!event.body) return;

  const msg = event.body.toLowerCase().trim();
  const threadID = event.threadID;

  if (
    event.type === "message_reply" &&
    ["next", "arekta"].includes(msg)
  ) {
    const progress = songProgress[threadID];
    if (!progress) return;
    if (progress.msgID !== event.messageReply?.messageID) return;

    const nextIndex = (progress.index + 1) % deepSongs.length;
    await sendSong(api, threadID, nextIndex, event.messageID);
  }
};

// ▶️ PREFIX ONLY COMMAND
module.exports.run = async ({ api, event }) => {
  const body = event.body || "";

  // ❌ prefix ছাড়া হলে কাজ করবে না
  if (!body.startsWith(".")) return;

  const randomIndex = Math.floor(Math.random() * deepSongs.length);
  await sendSong(api, event.threadID, randomIndex, event.messageID);
};

// 🎵 send song
async function sendSong(api, threadID, index, replyToID) {
  const filePath = path.join(__dirname, `gan_${index}.mp3`);

  try {
    const res = await axios.get(deepSongs[index], {
      responseType: "arraybuffer"
    });
    fs.writeFileSync(filePath, res.data);

    api.sendMessage(
      {
        body: "ᥫ᭡ 🅹🅸🅷️🅰🅳 🅷️🅰🆂️🅰🅽 ࿐",
        attachment: fs.createReadStream(filePath)
      },
      threadID,
      (err, info) => {
        fs.unlinkSync(filePath);
        if (!err) {
          songProgress[threadID] = {
            index,
            msgID: info.messageID
          };
        }
      },
      replyToID
    );
  } catch (e) {
    console.log("❌ Gan error:", e.message);
  }
}
