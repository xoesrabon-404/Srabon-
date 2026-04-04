const { createCanvas, loadImage } = require("canvas");
const os = require("os");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "upt",
  version: "1.3.0",
  hasPermssion: 0,
  credits: "Rx + Gemini",
  usePrefix: true,
  description: "Bot status with Anime/Emoji icons from 1st code",
  commandCategory: "system",
  usages: "",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event }) {
  try {
    // 🖼 ব্যাকগ্রাউন্ড ইমেজ লোড
    const bgPath = path.join(__dirname, "cache", "status_bg.png");
    if (!fs.existsSync(bgPath)) {
        return api.sendMessage("❌ 'cache' ফোল্ডারে 'status_bg.png' ছবিটি নেই!", event.threadID);
    }
    const bgImage = await loadImage(bgPath);

    // 🎨 ক্যানভাস সেটআপ
    const canvas = createCanvas(bgImage.width, bgImage.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    // 📊 সিস্টেম ডাটা ক্যালকুলেশন
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    const ping = Date.now() - event.timestamp;
    
    const totalRAM = (os.totalmem() / 1024 ** 3).toFixed(1);
    const usedRAM = ((os.totalmem() - os.freemem()) / 1024 ** 3).toFixed(1);
    const owner = "👑 AHMED SRABON 👑";

    // ✍️ টেক্সট ডিজাইন (১ম কোডের স্টাইল)
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 8;
    ctx.textAlign = "left";

    // 🧠 টাইটেল
    ctx.font = "bold 55px Arial, sans-serif";
    ctx.fillText("⚡ BOT STATUS ⚡", 50, 100);

    // টেক্সট পজিশন
    const startX = 120;
    const line1Y = 200;
    const line2Y = 280;
    const line3Y = 360;
    const line4Y = 440;

    ctx.font = "bold 40px Arial, sans-serif";

    // লেখাগুলো বসানো
    ctx.fillText(`UPTIME : ${h}h ${m}m ${s}s`, startX, line1Y);
    ctx.fillText(`PING   : ${ping}ms`, startX, line2Y);
    ctx.fillText(`RAM    : ${usedRAM}GB / ${totalRAM}GB`, startX, line3Y);
    ctx.fillText(`OWNER  : ${owner}`, startX, line4Y);

    // 🧩 ১ম কোডের মতো অনলাইন থেকে আইকন লোড করা
    const icon1 = await loadImage("https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/23f1.png"); // Uptime
    const icon2 = await loadImage("https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4f6.png"); // Ping
    const icon3 = await loadImage("https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4be.png"); // RAM
    const icon4 = await loadImage("https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/26a1.png");   // Owner/Bolt

    // আইকনগুলো পজিশন অনুযায়ী বসানো
    ctx.drawImage(icon1, 50, line1Y - 45, 50, 50);
    ctx.drawImage(icon2, 50, line2Y - 45, 50, 50);
    ctx.drawImage(icon3, 50, line3Y - 45, 50, 50);
    ctx.drawImage(icon4, 50, line4Y - 45, 50, 50);

    // 🖼 ইমেজ আউটপুট এবং পাঠানো
    const outPath = path.join(__dirname, "cache", `status_${event.senderID}.png`);
    fs.writeFileSync(outPath, canvas.toBuffer("image/png"));

    return api.sendMessage(
      { attachment: fs.createReadStream(outPath) },
      event.threadID,
      () => { if (fs.existsSync(outPath)) fs.unlinkSync(outPath); },
      event.messageID
    );

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ Error: " + err.message, event.threadID, event.messageID);
  }
};
