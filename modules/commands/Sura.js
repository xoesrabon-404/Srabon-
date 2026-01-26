const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

module.exports.config = {
  name: "sura",
  version: "2.1.1",
  hasPermssion: 0,
  credits: "Jihad",
  description: "Sura REAL MP3 Voice Player (LOUD)",
  commandCategory: "media",
  usages: ".sura",
  cooldowns: 0
};

// 🎵 Sura links
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

// ▶️ Command run (NO DOT CHECK ❗)
module.exports.run = async ({ api, event }) => {
  const randomIndex = Math.floor(Math.random() * suraLinks.length);
  await sendVoice(api, event.threadID, randomIndex, event.messageID);
};

// 🎧 Convert & send voice
async function sendVoice(api, threadID, index, replyToID) {
  const mp4Path = path.join(__dirname, `sura_${index}.mp4`);
  const mp3Path = path.join(__dirname, `sura_${index}.mp3`);

  try {
    const res = await axios.get(suraLinks[index], {
      responseType: "arraybuffer"
    });
    fs.writeFileSync(mp4Path, res.data);

    exec(
      `ffmpeg -y -i "${mp4Path}" -vn -af "volume=2.8,loudnorm" -ab 128k "${mp3Path}"`,
      (err) => {
        fs.unlinkSync(mp4Path);
        if (err) return console.log("FFMPEG error:", err.message);

        api.sendMessage(
          {
            body: "⏤͟͟͟͟͞͞͞͞𝐽𝑖ℎ𝑎𝑑 𝐻𝑎𝑠𝑎𝑛 ☹︎ᥫ᭡",
            attachment: fs.createReadStream(mp3Path)
          },
          threadID,
          (e, info) => {
            fs.unlinkSync(mp3Path);
            if (!e) {
              suraProgress[threadID] = {
                index,
                msgID: info.messageID
              };
            }
          },
          replyToID
        );
      }
    );
  } catch (e) {
    console.log("Sura error:", e.message);
  }
}
