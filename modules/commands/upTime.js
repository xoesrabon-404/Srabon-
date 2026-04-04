const { createCanvas, loadImage } = require("canvas");
const os = require("os");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

module.exports.config = {
  name: "upt",
  version: "1.3.0",
  hasPermssion: 0,
  credits: "Rx + Srabon",
  description: "Full anime style uptime info",
  commandCategory: "system",
  usages: "upt / uptime",
  cooldowns: 5,
  aliases: ["uptime"]
};

// --- Network graph history ---
const HISTORY_LENGTH = 10;
let netHistory1 = Array.from({ length: HISTORY_LENGTH }, () => Math.floor(Math.random() * 40 + 30));
let netHistory2 = Array.from({ length: HISTORY_LENGTH }, () => Math.floor(Math.random() * 40 + 20));

// --- Restart counter ---
const restartFile = path.join(__dirname, "restart.json");
let restartCount = 1;
if (fs.existsSync(restartFile)) restartCount = JSON.parse(fs.readFileSync(restartFile)).count + 1;
fs.writeFileSync(restartFile, JSON.stringify({ count: restartCount }));

function getCpuUsageAsync() {
  return new Promise((resolve) => {
    const start = os.cpus();
    setTimeout(() => {
      const end = os.cpus();
      let idleDiff = 0, totalDiff = 0;
      for (let i = 0; i < start.length; i++) {
        const s = start[i].times, e = end[i].times;
        idleDiff += e.idle - s.idle;
        totalDiff += Object.keys(e).reduce((acc, key) => acc + (e[key] - s[key]), 0);
      }
      resolve(100 - Math.round((idleDiff / totalDiff) * 100));
    }, 100);
  });
}

function getDiskUsage() {
  try {
    const out = execSync("df -k /").toString().split("\n")[1].split(/\s+/);
    return { percent: Math.round((parseInt(out[2]) / parseInt(out[1])) * 100) };
  } catch {
    return { percent: 0 };
  }
}

module.exports.run = async function({ api, event }) {
  try {
    const cpu = await getCpuUsageAsync();
    const totalRAM = os.totalmem();
    const usedRAM = totalRAM - os.freemem();
    const ramPercent = usedRAM / totalRAM;
    const disk = getDiskUsage();

    const allUsers = global.data?.allUserID || [];
    const realUserCount = allUsers.length;

    const dataSent = ((restartCount * 1.2) + (realUserCount * 0.05)).toFixed(1);
    const dataReceived = ((restartCount * 0.8) + (realUserCount * 0.03)).toFixed(1);

    const up = process.uptime();
    const d = Math.floor(up / 86400);
    const h = Math.floor((up % 86400) / 3600);
    const m = Math.floor((up % 3600) / 60);

    netHistory1.push(Math.floor(Math.random() * 40 + 30));
    if (netHistory1.length > HISTORY_LENGTH) netHistory1.shift();
    netHistory2.push(Math.floor(Math.random() * 40 + 10));
    if (netHistory2.length > HISTORY_LENGTH) netHistory2.shift();

    // --- Canvas ---
    const canvas = createCanvas(480, 480);
    const ctx = canvas.getContext("2d");

    // Background
    const bgPath = path.join(__dirname, "cache", "status_bg.png");
    if (fs.existsSync(bgPath)) {
      const bg = await loadImage(bgPath);
      ctx.drawImage(bg, 0, 0, 480, 480);
    } else {
      ctx.fillStyle = "#111111";
      ctx.fillRect(0, 0, 480, 480);
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // --- Owner Title ---
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00f2ff";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px Arial";
    ctx.fillText("👑 𝐴ℎ𝑚𝑒𝑑 𝑆𝑟𝑎𝑏𝑜𝑛 👑", 240, 40);
    ctx.shadowBlur = 0;

    // CPU
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#00f2ff";
    ctx.shadowColor = "#00f2ff";
    ctx.font = "bold 24px Arial";
    ctx.fillText(`CPU: ${cpu}%`, 100, 120);

    // RAM
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px Arial";
    ctx.fillText(`${(usedRAM / 1024 ** 3).toFixed(1)}G / ${(totalRAM / 1024 ** 3).toFixed(1)}G`, 240, 105);
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fillRect(200, 120, 80, 6);
    ctx.fillStyle = "#00f2ff";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00f2ff";
    ctx.fillRect(200, 120, 80 * ramPercent, 6);

    // SERVER STATUS
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#00ff8a";
    ctx.shadowColor = "#00ff8a";
    ctx.font = "bold 18px Arial";
    ctx.fillText("ONLINE", 385, 120);

    // DISK
    ctx.fillStyle = "#bc00ff";
    ctx.shadowColor = "#bc00ff";
    ctx.font = "bold 20px Arial";
    ctx.fillText(`${disk.percent}%`, 100, 255);

    // UPTIME
    ctx.fillStyle = "#00f2ff";
    ctx.shadowColor = "#00f2ff";
    ctx.font = "bold 14px Courier New";
    ctx.fillText(`${d}D ${h}H ${m}M`, 240, 235);

    // NETWORK GRAPHS
    const startX = 355, startY = 265, graphW = 65, graphH = 30;
    ctx.beginPath();
    ctx.strokeStyle = "#ff00ff";
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ff00ff";
    netHistory2.forEach((val, i) => {
      const x = startX + (i * (graphW / (HISTORY_LENGTH - 1)));
      const y = (startY + 5) - (val * (graphH / 100));
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#00f2ff";
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00f2ff";
    netHistory1.forEach((val, i) => {
      const x = startX + (i * (graphW / (HISTORY_LENGTH - 1)));
      const y = startY - (val * (graphH / 100));
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // RESTART
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#bc00ff";
    ctx.font = "bold 20px Arial";
    ctx.fillText(`${restartCount}`, 95, 360);

    // USERS
    ctx.fillStyle = "#00f2ff";
    ctx.font = "bold 18px Arial";
    ctx.fillText(`${realUserCount}`, 240, 360);

    // DATA
    ctx.fillStyle = "#bc00ff";
    ctx.font = "bold 11px Arial";
    ctx.fillText(`↑${dataSent}GB ↓${dataReceived}GB`, 385, 360);

    // ANIME IMAGE
    const animePath = path.join(__dirname, "cache", "anime.png");
    if (fs.existsSync(animePath)) {
      const animeImg = await loadImage(animePath);
      ctx.drawImage(animeImg, canvas.width - 280, 100, 250, 400);
    }

    // SAVE IMAGE
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
    const imgPath = path.join(cacheDir, `uptime_${Date.now()}.png`);
    fs.writeFileSync(imgPath, canvas.toBuffer());

    // SEND
    api.sendMessage(
      { attachment: fs.createReadStream(imgPath) },
      event.threadID,
      () => fs.unlinkSync(imgPath),
      event.messageID
    );

  } catch (err) {
    api.sendMessage("❌ Error: " + err.message, event.threadID);
  }
};
