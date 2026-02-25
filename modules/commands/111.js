const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "gan",
  version: "1.0.4",
  hasPermssion: 0,
  credits: "Jihad",
  description: "Sad song player (NO PREFIX)",
  commandCategory: "media",
  usages: "gan",
  cooldowns: 0
};

// 🎧 84 ta sad song link
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
  "https://files.catbox.moe/cxhmq2.mp3",
  "https://files.catbox.moe/i2n8y4.mp3",
  "https://files.catbox.moe/07cnwl.mp3",
  "https://files.catbox.moe/6tx7g5.mp3",
  "https://files.catbox.moe/ceviu5.mp3",
  "https://files.catbox.moe/e07g3g.mp3",
  "https://files.catbox.moe/ihcw9h.mp3",
  "https://files.catbox.moe/1qy9o8.mp3",
  "https://files.catbox.moe/q5f21o.mp3",
  "https://files.catbox.moe/0yqdwg.mp3",
  "https://files.catbox.moe/36jnhy.mp3",
  "https://files.catbox.moe/ju2lkr.mp3",
  "https://files.catbox.moe/4r9nt8.mp3",
  "https://files.catbox.moe/qk7f3w.mp3",
  "https://files.catbox.moe/m7hy14.mp3",
  "https://files.catbox.moe/xftwwi.mp3",
  "https://files.catbox.moe/zrkary.mp3",
  "https://files.catbox.moe/f98rp3.mp3",
  "https://files.catbox.moe/sm4h5z.mp3",
  "https://files.catbox.moe/igy1oq.mp3",
  "https://files.catbox.moe/f3pyt2.mp3",
  "https://files.catbox.moe/1a2vn5.mp3",
  "https://files.catbox.moe/9zyc9z.mp3",
  "https://files.catbox.moe/ksk5iz.mp3",
  "https://files.catbox.moe/u6o7g3.mp3",
  "https://files.catbox.moe/9vtcgv.mp3",
  "https://files.catbox.moe/cbxvh8.mp3",
  "https://files.catbox.moe/o65uvg.mp3",
  "https://files.catbox.moe/wluj21.mp3",
  "https://files.catbox.moe/gqg0gh.mp3",
  "https://files.catbox.moe/8gsu80.mp3",
  "https://files.catbox.moe/9zzm2h.mp3",
  "https://files.catbox.moe/n4u0sl.mp3",
  "https://files.catbox.moe/dv99cu.mp3",
  "https://files.catbox.moe/wt0h8a.mp3",
  "https://files.catbox.moe/6kcjtb.mp3",
  "https://files.catbox.moe/kn8dt2.mp3",
  "https://files.catbox.moe/jood8u.mp3",
  "https://files.catbox.moe/5u4y9r.mp3",
  "https://files.catbox.moe/j3yb4a.mp3",
  "https://files.catbox.moe/jcnlmm.mp3",
  "https://files.catbox.moe/x15zbm.mp3",
  "https://files.catbox.moe/5jxa41.mp3",
  "https://files.catbox.moe/0xi82q.mp3",
  "https://files.catbox.moe/5nfppj.mp3",
  "https://files.catbox.moe/ipidzd.mp3",
  "https://files.catbox.moe/0jgagi.mp3",
  "https://files.catbox.moe/zb8zxp.mp3",
  "https://files.catbox.moe/913by6.mp3",
  "https://files.catbox.moe/cm1in4.mp3",
  "https://files.catbox.moe/aeg9ca.mp3",
  "https://files.catbox.moe/pl0xox.mp3",
  "https://files.catbox.moe/yh9qzi.mp3",
  "https://files.catbox.moe/j4wet1.mp3",
  "https://files.catbox.moe/czmoe7.mp3",
  "https://files.catbox.moe/a801mq.mp3",
  "https://files.catbox.moe/z71fwi.mp3",
  "https://files.catbox.moe/j235wd.mp3",
  "https://files.catbox.moe/nduel7.mp3",
  "https://files.catbox.moe/n7by70.mp3"
];

const songProgress = {};

module.exports.handleEvent = async ({ api, event }) => {
  if (!event.body) return;

  const msg = event.body.toLowerCase().trim();
  const threadID = event.threadID;

  if (msg === "gan") {
    const randomIndex = Math.floor(Math.random() * deepSongs.length);
    return sendSong(api, threadID, randomIndex, event.messageID);
  }

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

async function sendSong(api, threadID, index, replyToID) {
  const filePath = path.join(__dirname, `gan_${index}.mp3`);

  try {
    const res = await axios.get(deepSongs[index], {
      responseType: "arraybuffer"
    });

    fs.writeFileSync(filePath, res.data);

    api.sendMessage(
      {
        body: "⏤͟͟͞͞𝐽𝐼𝐻𝐴𝐷☻ ⏤͟͟͞͞𝐻𝐴𝑆𝐴𝑁☻",
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
