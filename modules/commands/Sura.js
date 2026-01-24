const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "Sura",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Jihad",
  description: "Sura MP3 Audio Player (FORCE PREFIX ONLY)",
  commandCategory: "media",
  usages: ".Sura",
  cooldowns: 0
};

// 🎵 Sura source links (mp4 but sent as mp3)
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
  "https://files.catbox.moe/nhmpcb.mp4"
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
    await sendAudio(api, threadID, nextIndex, event.messageID);
  }
};

// ▶️ PREFIX ONLY COMMAND
module.exports.run = async ({ api, event }) => {
  if (!event.body || !event.body.startsWith(".")) return;

  const randomIndex = Math.floor(Math.random() * suraLinks.length);
  await sendAudio(api, event.threadID, randomIndex, event.messageID);
};

// 🎧 send audio (mp4 → mp3 trick)
async function sendAudio(api, threadID, index, replyToID) {
  const filePath = path.join(__dirname, `sura_${index}.mp3`);

  try {
    const res = await axios.get(suraLinks[index], {
      responseType: "arraybuffer"
    });

    fs.writeFileSync(filePath, res.data);

    api.sendMessage(
      {
        body: "🕋 SURA MP3 | JIHAD 🕋",
        attachment: fs.createReadStream(filePath)
      },
      threadID,
      (err, info) => {
        fs.unlinkSync(filePath);
        if (!err) {
          suraProgress[threadID] = {
            index,
            msgID: info.messageID
          };
        }
      },
      replyToID
    );
  } catch (err) {
    console.log("❌ Sura MP3 Error:", err.message);
  }
}
