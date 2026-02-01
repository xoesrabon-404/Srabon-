const axios = require("axios");
const fs = require("fs");

/* 🔗 FIXED API LIST */
const BASE_API = {
  api: "https://api.noobs-api.rf.gd/dipto",
  baby: "https://api.cyber-ninjas.top",
  mentionapi: "https://tag.cyber-ninjas.top",
  rules: "https://rx-rules-api.onrender.com/rules"
};

const baseApiUrl = () => BASE_API.api;

module.exports.config = {
  name: "yt",
  version: "2.3.7",
  aliases: ["music", "play"],
  credits: "Jihad",
  countDown: 5,
  hasPermssion: 0,
  description: "Download audio from YouTube (auto first result)",
  commandCategory: "media",
  usages: "{pn} [song name or YouTube link]",
};

/* ⏳ Progress Frames */
const progressFrames = [
  "😾 ▰▰▱▱▱▱▱▱▱▱ 20%",
  "😩 ▰▰▰▰▱▱▱▱▱▱ 40%",
  "😁 ▰▰▰▰▰▰▱▱▱▱ 60%",
  "😘 ▰▰▰▰▰▰▰▰▱▱ 80%",
  "✅ ▰▰▰▰▰▰▰▰▰▰ 100%"
];

async function playLoading(api, threadID) {
  const sent = await api.sendMessage(progressFrames[0], threadID);

  for (let i = 1; i < progressFrames.length; i++) {
    await new Promise(r => setTimeout(r, 700));
    try {
      await api.editMessage(progressFrames[i], sent.messageID, threadID);
    } catch {}
  }

  await new Promise(r => setTimeout(r, 500));
  await api.unsendMessage(sent.messageID).catch(() => {});
}

module.exports.run = async ({ api, args, event }) => {
  const checkurl =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;

  if (!args[0]) {
    return api.sendMessage(
      "🎵 গান নাম বা YouTube লিংক দাও",
      event.threadID,
      event.messageID
    );
  }

  try {
    await playLoading(api, event.threadID);

    let videoID;
    const isUrl = checkurl.test(args[0]);

    if (isUrl) {
      const match = args[0].match(checkurl);
      videoID = match ? match[1] : null;

      const { data } = await axios.get(
        `${baseApiUrl()}/ytDl3?link=${videoID}&format=mp3`
      );

      const msg = await api.sendMessage(
        {
          body: `🎧 Title: ${data.title}\n🎶 Quality: ${data.quality}`,
          attachment: await downloadAudio(data.downloadLink, "audio.mp3"),
        },
        event.threadID,
        () => fs.unlinkSync("audio.mp3"),
        event.messageID
      );

      await api.setMessageReaction("✅", msg.messageID);
    } else {
      const keyWord = args.join(" ");
      const encoded = encodeURIComponent(keyWord);

      const search = await axios.get(
        `${baseApiUrl()}/ytFullSearch?songName=${encoded}`
      );

      if (!search.data || search.data.length === 0) {
        return api.sendMessage(
          `❌ '${keyWord}' এর জন্য কিছু পাওয়া যায়নি`,
          event.threadID,
          event.messageID
        );
      }

      const first = search.data[0];

      const { data } = await axios.get(
        `${baseApiUrl()}/ytDl3?link=${first.id}&format=mp3`
      );

      const msg = await api.sendMessage(
        {
          body:
            `⏤͟͟͞͞ᰔ 𝐽𝐼𝐻𝐴𝐷 𝐻𝐴𝑆𝐴𝑁 ☻ᰔᩚ\n` +
            `🎵 Title: ${data.title}\n` +
            `📺 Channel: ${first.channel.name}\n` +
            `🎶 Quality: ${data.quality}`,
          attachment: await downloadAudio(data.downloadLink, "audio.mp3"),
        },
        event.threadID,
        () => fs.unlinkSync("audio.mp3"),
        event.messageID
      );

      await api.setMessageReaction("✅", msg.messageID);
    }
  } catch (e) {
    console.error(e);
    api.sendMessage(
      "⚠️ অডিও আনতে সমস্যা হয়েছে",
      event.threadID,
      event.messageID
    );
  }
};

async function downloadAudio(url, pathName) {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(pathName, Buffer.from(res.data));
  return fs.createReadStream(pathName);
  }
