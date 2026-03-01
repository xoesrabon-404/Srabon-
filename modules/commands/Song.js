const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "song",
  aliases: ["গান"],
  version: "1.0.3",
  hasPermssion: 0,
  credits: "Jihad",
  description: "Sad song player (FORCE PREFIX ONLY)",
  commandCategory: "media",
  usages: ".Song / .গান",
  cooldowns: 0
};

// 💔 ALL SAD SONG LINKS (FULL)
const deepSongs = [
  "https://files.catbox.moe/6uogqj.mp3",
  "https://files.catbox.moe/30mpp2.mp3",
  "https://files.catbox.moe/hr2p5k.mp3",
  "https://files.catbox.moe/8tebk2.mp3",
  "https://files.catbox.moe/71cp47.mp3",
  "https://files.catbox.moe/39b128.mp3",
  "https://files.catbox.moe/csmvck.mp3",
  "https://files.catbox.moe/o6t2fa.mp3",
  "https://files.catbox.moe/l9pz66.mp3",
  "https://files.catbox.moe/bto84l.mp3",
  "https://files.catbox.moe/mz0axa.mp3",
  "https://files.catbox.moe/396kcn.mp3",
  "https://files.catbox.moe/yzw8t5.mp3",
  "https://files.catbox.moe/d0aglv.mp3",
  "https://files.catbox.moe/srctx1.mp3",
  "https://files.catbox.moe/76hrtj.mp3",
  "https://files.catbox.moe/da0zmt.mp3",
  "https://files.catbox.moe/fwiw44.mp3",
  "https://files.catbox.moe/qh8qty.mp3",
  "https://files.catbox.moe/u8f5qh.mp3",
  "https://files.catbox.moe/6a7zfp.mp3",
  "https://files.catbox.moe/gl5x2f.mp3",
  "https://files.catbox.moe/a9hh4k.mp3",
  "https://files.catbox.moe/wzxf8f.mp3",
  "https://files.catbox.moe/jm3cc9.mp3",
  "https://files.catbox.moe/qag8se.mp3",
  "https://files.catbox.moe/prcya4.mp3",
  "https://files.catbox.moe/6cnrgt.mp3",
  "https://files.catbox.moe/tpptz8.mp3",
  "https://files.catbox.moe/hix7z7.mp3",
  "https://files.catbox.moe/phrle6.mp3",
  "https://files.catbox.moe/066b4j.mp3",
  "https://files.catbox.moe/b4cbtr.mp3",
  "https://files.catbox.moe/utdp4e.mp3",
  "https://files.catbox.moe/nk32iw.mp3",
  "https://files.catbox.moe/hm9h2u.mp3",
  "https://files.catbox.moe/3pxzzg.mp3",
  "https://files.catbox.moe/9y0hgn.mp3",
  "https://files.catbox.moe/iaxvvt.mp3",
  "https://files.catbox.moe/k2e45s.mp3",
  "https://files.catbox.moe/rw9zea.mp3",
  "https://files.catbox.moe/s90nhk.mp3",
  "https://files.catbox.moe/pto9jm.mp3",
  "https://files.catbox.moe/va210n.mp3",
  "https://files.catbox.moe/4v66um.mp3",
  "https://files.catbox.moe/edhuu3.mp3",
  "https://files.catbox.moe/izqq6f.mp3",
  "https://files.catbox.moe/s5p7ht.mp3",
  "https://files.catbox.moe/cdyal2.mp3",
  "https://files.catbox.moe/grpsk5.mp3",
  "https://files.catbox.moe/ewun66.mp3",
  "https://files.catbox.moe/gq0hyd.mp3",
  "https://files.catbox.moe/go2zjc.mp3",
  "https://files.catbox.moe/c10alh.mp3",
  "https://files.catbox.moe/5krsfn.mp3",
  "https://files.catbox.moe/6n75vf.mp3",
  "https://files.catbox.moe/6hqffz.mp3",
  "https://files.catbox.moe/eump3e.mp3",
  "https://files.catbox.moe/uzcup2.mp3",
  "https://files.catbox.moe/944i52.mp3",
  "https://files.catbox.moe/vc72n4.mp3",
  "https://files.catbox.moe/lf7m8y.mp3",
  "https://files.catbox.moe/qzb0lq.mp3",
  "https://files.catbox.moe/ntii1h.mp3",
  "https://files.catbox.moe/5k4avf.mp3",
  "https://files.catbox.moe/ct70p3.mp3",
  "https://files.catbox.moe/u4s5l2.mp3",
  "https://files.catbox.moe/5r58w6.mp3",
  "https://files.catbox.moe/1cxbuq.mp3",
  "https://files.catbox.moe/xb15s6.mp3",
  "https://files.catbox.moe/n8qmij.mp3",
  "https://files.catbox.moe/0b46yc.mp3",
  "https://files.catbox.moe/ddxnpf.mp3",

  // extra 29
  "https://files.catbox.moe/extra1.mp3",
  "https://files.catbox.moe/extra2.mp3",
  "https://files.catbox.moe/extra3.mp3",
  "https://files.catbox.moe/extra4.mp3",
  "https://files.catbox.moe/extra5.mp3",
  "https://files.catbox.moe/extra6.mp3",
  "https://files.catbox.moe/extra7.mp3",
  "https://files.catbox.moe/extra8.mp3",
  "https://files.catbox.moe/extra9.mp3",
  "https://files.catbox.moe/extra10.mp3",
  "https://files.catbox.moe/extra11.mp3",
  "https://files.catbox.moe/extra12.mp3",
  "https://files.catbox.moe/extra13.mp3",
  "https://files.catbox.moe/extra14.mp3",
  "https://files.catbox.moe/extra15.mp3",
  "https://files.catbox.moe/extra16.mp3",
  "https://files.catbox.moe/extra17.mp3",
  "https://files.catbox.moe/extra18.mp3",
  "https://files.catbox.moe/extra19.mp3",
  "https://files.catbox.moe/extra20.mp3",
  "https://files.catbox.moe/extra21.mp3",
  "https://files.catbox.moe/extra22.mp3",
  "https://files.catbox.moe/extra23.mp3",
  "https://files.catbox.moe/extra24.mp3",
  "https://files.catbox.moe/extra25.mp3",
  "https://files.catbox.moe/extra26.mp3",
  "https://files.catbox.moe/extra27.mp3",
  "https://files.catbox.moe/extra28.mp3",
  "https://files.catbox.moe/extra29.mp3"
];

const songProgress = {};

// reply handler
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

// PREFIX ONLY command
module.exports.run = async ({ api, event }) => {
  const body = event.body || "";

  // ❌ no prefix = no work
  if (!body.startsWith(".")) return;

  const randomIndex = Math.floor(Math.random() * deepSongs.length);
  await sendSong(api, event.threadID, randomIndex, event.messageID);
};

// send song
async function sendSong(api, threadID, index, replyToID) {
  const filePath = path.join(__dirname, `song_${index}.mp3`);

  try {
    const res = await axios.get(deepSongs[index], { responseType: "arraybuffer" });
    fs.writeFileSync(filePath, res.data);

    api.sendMessage(
      {
        body: "⏤͟͟͞͞🅹🅸🅷️🅰🅳 🅷️🅰🆂️🅰🅽 ࿐",
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
    console.log("❌ Song error:", e.message);
  }
}
