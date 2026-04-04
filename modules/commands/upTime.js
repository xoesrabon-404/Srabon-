const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "upt",
  version: "1.1.1",
  hasPermssion: 0, // এখন সব ইউজার ব্যবহার করতে পারবে
  credits: "Rx Abdullah + Edit by Srabon",
  usePrefix: false,
  description: "Bot status image with anime and stylish owner",
  commandCategory: "system",
  usages: "",
  cooldowns: 5,
};

module.exports.run = async function({ api, event }) {
  try {
    // 🖼 Background
    const bgPath = path.join(__dirname, "cache", "status_bg.png");
    const bgImage = await loadImage(bgPath);

    // 🎨 Canvas
    const canvas = createCanvas(bgImage.width, bgImage.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    // ⏰ Uptime + Ping
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const ping = Date.now() - event.timestamp;

    // 👑 Owner (স্টাইলিশ ফন্ট)
    const owner = "𝐴ℎ𝑚𝑒𝑑 𝑆𝑟𝑎𝑏𝑜𝑛";

    // ✍️ Text style
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 6;
    ctx.textAlign = "left";

    // 🧠 Title
    ctx.font = "bold 55px Arial";
    ctx.fillText("⚡ BOT STATUS ⚡", 50, 100);

    // 📍 Position
    const startX = 120;
    const line1Y = 200;
    const line2Y = 270;
    const line3Y = 340;

    // 🔠 Text
    ctx.font = "bold 40px Arial";
    ctx.fillText(`UPTIME : ${hours}h ${minutes}m ${seconds}s`, startX, line1Y);
    ctx.fillText(`PING   : ${ping}ms`, startX, line2Y);
    ctx.fillText(`OWNER  : ${owner}`, startX, line3Y);

    // 🧩 Emoji
    const emojiClock = await loadImage(path.join(__dirname, "cache", "emoji_clock.png"));
    const emojiSignal = await loadImage(path.join(__dirname, "cache", "emoji_signal.png"));
    const emojiBolt = await loadImage(path.join(__dirname, "cache", "emoji_bolt.png"));

    ctx.drawImage(emojiClock, 50, line1Y - 45, 50, 50);
    ctx.drawImage(emojiSignal, 50, line2Y - 45, 50, 50);
    ctx.drawImage(emojiBolt, 50, line3Y - 45, 50, 50);

    // 🐱 Anime image
    const animePath = path.join(__dirname, "cache", "anime.png");
    const animeImg = await loadImage(animePath);
    ctx.drawImage(animeImg, canvas.width - 280, 100, 250, 400);

    // 🖼 Save image
    const outPath = path.join(__dirname, "cache", `status_${event.senderID}.png`);
    fs.writeFileSync(outPath, canvas.toBuffer("image/png"));

    // 📤 Send
    return api.sendMessage(
      { attachment: fs.createReadStream(outPath) },
      event.threadID,
      () => fs.unlinkSync(outPath),
      event.messageID
    );

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ Error while generating status photo!", event.threadID);
  }
};
