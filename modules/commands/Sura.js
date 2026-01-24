const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

module.exports.config = {
  name: "Sura",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Jihad",
  description: "Sura REAL MP3 Voice Player (FFMPEG)",
  commandCategory: "media",
  usages: ".Sura",
  cooldowns: 0
};

// 🎵 All Sura MP4 links (unique)
const suraLinks = [
  "https://files.catbox.moe/j9oqqv.mp4",
  "https://files.catbox.moe/lrbuvt.mp4",
  "https://files.catbox.moe/drg0t8.mp4",
  "https://files.catbox.moe/88ts6s.mp4",
  "https://files.catbox.moe/bxkxkg.mp4",
  "https://files.catbox.moe/d1ucvw.mp4",
  "https://files.catbox.moe/tudbja.mp4",
  "https://files.catbox.moe/diyipp.mp4",
  "https://files.catbox.moe/fbs85x.mp4",
  "https://files.catbox.moe/nhmpcb.mp4",

  "https://files.catbox.moe/7ashq6.mp4",
  "https://files.catbox.moe/0lcv3y.mp4",
  "https://files.catbox.moe/t9ux6r.mp4",
  "https://files.catbox.moe/h57scr.mp4",
  "https://files.catbox.moe/vjpl5z.mp4",
  "https://files.catbox.moe/usivpm.mp4",
  "https://files.catbox.moe/vxaq0m.mp4",
  "https://files.catbox.moe/wqq417.mp4"
];

const suraProgress = {};

// 🔁 reply handler
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

// 🎧 MP4 → REAL MP3 → SEND AS VOICE
async function sendVoice(api, threadID, index, replyToID) {
  const mp4Path = path.join(__dirname, `sura_${index}.mp4`);
  const mp3Path = path.join(__dirname, `sura_${index}.mp3`);

  try {
    // download mp4
    const res = await axios.get(suraLinks[index], {
      responseType: "arraybuffer"
    });
    fs.writeFileSync(mp4Path, res.data);

    // convert to mp3
    exec(`ffmpeg -y -i "${mp4Path}" -vn -ab 128k "${mp3Path}"`, (err) => {
      fs.unlinkSync(mp4Path);
      if (err) return console.log("❌ FFMPEG error:", err.message);

      api.sendMessage(
        {
          body: "⏤͟͟͟͟͞͞͞͞𝐽𝑖 ℎ𝑎𝑑 𝐻𝑎𝑠𝑎𝑛 ☹︎ᥫ᭡",
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
    console.log("❌ Sura Voice Error:", e.message);
  }
}
