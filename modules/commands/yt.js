const axios = require("axios");
const fs = require("fs");

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/rummmmna21/rx-api/main/baseApiUrl.json`
  );
  return base.data.api;
};

module.exports.config = {
  name: "yt",
  version: "2.3.7",
  aliases: ["music", "play"],
  credits: "𝐫𝐗",
  countDown: 5,
  hasPermssion: 0,
  description: "Download audio from YouTube (auto first result)",
  commandCategory: "media",
  usages: "{pn} [song name or YouTube link]",
};

// 🎞 Progress frames 10 → 100
const progressFrames = [
  "😾 ▰▰▱▱▱▱▱▱▱▱ 20%",
  "😩 ▰▰▰▰▱▱▱▱▱▱ 40%",
  "😁 ▰▰▰▰▰▰▱▱▱▱ 60%",
  "😘 ▰▰▰▰▰▰▰▰▱▱ 80%",
  "✅ ▰▰▰▰▰▰▰▰▰▰ 100%"
];

// ▶️ Controlled progress loading
async function playLoading(api, threadID) {
  // প্রথম message পাঠানো
  const sent = await api.sendMessage(progressFrames[0], threadID);

  // loop through frames 1-9
  for (let i = 1; i < progressFrames.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 700)); // 0.7s delay
    try {
      await api.editMessage(progressFrames[i], sent.messageID, threadID);
    } catch (err) {
      console.error("Progress update error:", err);
    }
  }

  // শেষ 100% এ পৌঁছালে message delete
  await new Promise(resolve => setTimeout(resolve, 500)); // 0.5s pause before delete
  await api.unsendMessage(sent.messageID).catch(() => {});

  return; // এখন loading message gone
}

module.exports.run = async ({ api, args, event }) => {
  const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;

  if (!args[0])
    return api.sendMessage(
      "🎵 Please provide a song name or YouTube link.",
      event.threadID,
      event.messageID
    );

  try {
    // ▶️ Start progress loading animation (auto delete at end)
    await playLoading(api, event.threadID);

    let videoID;
    const urlYtb = checkurl.test(args[0]);

    if (urlYtb) {
      const match = args[0].match(checkurl);
      videoID = match ? match[1] : null;

      const { data: { title, downloadLink, quality } } = await axios.get(
        `${await baseApiUrl()}/ytDl3?link=${videoID}&format=mp3`
      );

      // Send audio
      const sentMsg = await api.sendMessage({
        body: `🎧 Title: ${title}\n🎶 Quality: ${quality}`,
        attachment: await downloadAudio(downloadLink, 'audio.mp3')
      }, event.threadID, () => fs.unlinkSync('audio.mp3'), event.messageID);

      await api.setMessageReaction("✅", sentMsg.messageID);
    } else {
      // Keyword search
      const keyWord = args.join(" ").replace("?feature=share", "");
      const encodedKeyword = encodeURIComponent(keyWord);
      const result = (await axios.get(`${await baseApiUrl()}/ytFullSearch?songName=${encodedKeyword}`)).data;

      if (!result || result.length === 0) {
        return api.sendMessage(`❌ No results found for '${keyWord}'.`, event.threadID, event.messageID);
      }

      const firstResult = result[0];
      const idvideo = firstResult.id;

      const { data: { title, downloadLink, quality } } = await axios.get(
        `${await baseApiUrl()}/ytDl3?link=${idvideo}&format=mp3`
      );

      // Send audio
      const sentMsg = await api.sendMessage({
        body: `🎧 Title: ${title}\n📺 Channel: ${firstResult.channel.name}\n🎶 Quality: ${quality}`,
        attachment: await downloadAudio(downloadLink, 'audio.mp3')
      }, event.threadID, () => fs.unlinkSync('audio.mp3'), event.messageID);

      await api.setMessageReaction("✅", sentMsg.messageID);
    }

  } catch (err) {
    console.error(err);
    return api.sendMessage(
      "⚠️ Error while fetching or sending audio.",
      event.threadID,
      event.messageID
    );
  }
};

async function downloadAudio(url, pathName) {
  const response = (await axios.get(url, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(pathName, Buffer.from(response));
  return fs.createReadStream(pathName);
}
