const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

module.exports.config = {
  name: "সূরা",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "Jihad",
  description: "সূরা REAL MP3 Voice Player (FFMPEG)",
  commandCategory: "media",
  usages: ".সূরা",
  cooldowns: 0
};

// 🎵 ১৪টা সূরা লিংক
const suraLinks = [
  "https://files.catbox.moe/7tq7rn.mp4",
  "https://files.catbox.moe/kvh58w.mp4",
  "https://files.catbox.moe/7tk0on.mp4",
  "https://files.catbox.moe/d6zfmu.mp4",
  "https://files.catbox.moe/939jk1.mp4",
  "https://files.catbox.moe/u688hq.mp4",
  "https://files.catbox.moe/ual2zj.mp4",
  "https://files.catbox.moe/v438as.mp4",
  "https://files.catbox.moe/atiy6e.mp4",
  "https://files.catbox.moe/vscql8.mp4",
  "https://files.catbox.moe/gu22hc.mp4",
  "https://files.catbox.moe/8lbfs6.mp4",
  "https://files.catbox.moe/4xl8qg.mp4",
  "https://files.catbox.moe/3zv290.mp4"
];

const suraProgress = {};

// 🔁 reply handler (next / arekta)
module.exports.handleEvent = async ({ api, event }) => {
  if (!event.body) return;

  const msg = event.body.toLowerCase().trim();
  const threadID = event.threadID;

  if (
    event.type === "message_reply" &&
    ["next", "arekta"].includes(msg)
  ) {
    const progress = suraProgress[threadID];
    if (!progress) return;
    if (progress.msgID !== event.messageReply?.messageID) return;

    const nextIndex = (progress.index + 1) % suraLinks.length;
    await sendVoice(api, threadID, nextIndex, event.messageID);
  }
};

// ▶️ PREFIX COMMAND
module.exports.run = async ({ api, event }) => {
  if (!event.body || !event.body.startsWith(".")) return;

  const randomIndex = Math.floor(Math.random() * suraLinks.length);
  await sendVoice(api, event.threadID, randomIndex, event.messageID);
};

// 🎧 MP4 → REAL MP3 → VOICE
async function sendVoice(api, threadID, index, replyToID) {
  const mp4Path = path.join(__dirname, `sura_${index}.mp4`);
  const mp3Path = path.join(__dirname, `sura_${index}.mp3`);

  try {
    const res = await axios.get(suraLinks[index], {
      responseType: "arraybuffer"
    });
    fs.writeFileSync(mp4Path, res.data);

    exec(`ffmpeg -y -i "${mp4Path}" -vn -ab 128k "${mp3Path}"`, (err) => {
      fs.unlinkSync(mp4Path);
      if (err) return console.log("❌ FFMPEG error:", err.message);

      api.sendMessage(
        {
          body: "⏤͟͟͟͟͞͞͞͞𝐽𝑖 ℎ𝑎𝑑 𝐻𝑎𝑠𝑎𝑛 ☻",
          attachment: fs.createReadStream(mp3Path)
        },
        threadID,
        (error, info) => {
          fs.unlinkSync(mp3Path);
          if (!error) {
            suraProgress[threadID] = {
              index,
              msgID: info.messageID
            };
          }
        },
        replyToID
      );
    });
  } catch (e) {
    console.log("❌ সূরা Error:", e.message);
  }
}
