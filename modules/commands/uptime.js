const { createCanvas, loadImage } = require("canvas");
const os = require("os");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "upt",
  version: "2.1.0",
  hasPermission: 0,
  credits: "Srabon + Rahim",
  description: "Uptime Image with Right Side Anime",
  commandCategory: "system",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const width = 900;
  const height = 500;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // 🌌 Background
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, width, height);

  // 🌸 RIGHT SIDE IMAGE
  const img = await loadImage("https://i.imgur.com/KHyMLov.png");

  // 👉 perfect right align
  const imgWidth = 300;
  const imgHeight = 420;
  const imgX = width - imgWidth - 20; // right side margin
  const imgY = 40;

  ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

  // ✨ Title
  ctx.fillStyle = "#00ffff";
  ctx.font = "bold 40px Sans";
  ctx.shadowColor = "#00ffff";
  ctx.shadowBlur = 20;
  ctx.fillText("SRABON BOT", 50, 80);

  ctx.shadowBlur = 0;

  // 🖥 System Info (LEFT SIDE)
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const mins = Math.floor((uptime % 3600) / 60);
  const secs = Math.floor(uptime % 60);

  ctx.fillStyle = "#ffffff";
  ctx.font = "22px Sans";

  ctx.fillText(`🖥 OS: ${os.platform()}`, 50, 150);
  ctx.fillText(`⚙ CPU: ${os.cpus().length} Core`, 50, 190);
  ctx.fillText(`💾 RAM: ${(os.totalmem()/1024/1024/1024).toFixed(2)} GB`, 50, 230);
  ctx.fillText(`⏰ Uptime: ${hours}h ${mins}m ${secs}s`, 50, 270);

  // 🔥 Footer
  ctx.fillStyle = "#ff00ff";
  ctx.font = "bold 26px Sans";
  ctx.fillText("Developed by SRABON 😎", 50, 420);

  // Save
  const filePath = path.join(__dirname, "upt.png");
  fs.writeFileSync(filePath, canvas.toBuffer());

  return api.sendMessage(
    {
      body: "🔥 Uptime Status",
      attachment: fs.createReadStream(filePath)
    },
    event.threadID,
    () => fs.unlinkSync(filePath)
  );
};
