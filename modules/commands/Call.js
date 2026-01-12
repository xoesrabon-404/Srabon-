module.exports.config = {
  name: "call",
  version: "5.2.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "WhatsApp Call DP style (image only)",
  usePrefix: true,
  commandCategory: "Giải trí",
  usages: "[reply | mention | random]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "canvas": ""
  }
};

module.exports.run = async function ({ api, event, Users }) {
  const { createCanvas, loadImage } = require("canvas");
  const fs = require("fs-extra");
  const axios = require("axios");

  const cache = __dirname + "/cache/";
  if (!fs.existsSync(cache)) fs.mkdirSync(cache, { recursive: true });

  const out = cache + "pair6.png";
  const a1 = cache + "a1.png";
  const a2 = cache + "a2.png";

  const { senderID, threadID, messageID } = event;

  const id1 = senderID;
  const name1 = await Users.getNameUser(id1);

  let id2;

  // ============ 1️⃣ REPLY ============
  if (event.messageReply?.senderID) {
    id2 = event.messageReply.senderID;
  }

  // ============ 2️⃣ MENTION ============
  else if (event.mentions && Object.keys(event.mentions).length === 1) {
    id2 = Object.keys(event.mentions)[0];
  }

  // ============ 3️⃣ RANDOM ============
  else {
    const info = await api.getThreadInfo(threadID);
    let members = info.participantIDs.filter(
      id => id !== id1 && id !== api.getCurrentUserID()
    );
    if (!members.length)
      return api.sendMessage(
        "❌ Koi aur member nahi mila.",
        threadID,
        messageID
      );
    id2 = members[Math.floor(Math.random() * members.length)];
  }

  if (!id2)
    return api.sendMessage("❌ Pair select nahi ho paya.", threadID, messageID);

  const name2 = await Users.getNameUser(id2);

  // ===== TOKEN (SAFE FORMAT) =====
  const token = "6628568379|c1e620fa708a1d5696fb991c1bde5662";

  // ===== DOWNLOAD AVATARS =====
  const av1 = await axios.get(
    `https://graph.facebook.com/${id1}/picture?type=large&access_token=${token}`,
    { responseType: "arraybuffer" }
  );
  fs.writeFileSync(a1, av1.data);

  const av2 = await axios.get(
    `https://graph.facebook.com/${id2}/picture?type=large&access_token=${token}`,
    { responseType: "arraybuffer" }
  );
  fs.writeFileSync(a2, av2.data);

  // ===== CANVAS (MOBILE) =====
  const W = 1080;
  const H = 1920;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  const img1 = await loadImage(a1);
  const img2 = await loadImage(a2);

  // SPLIT BACKGROUND
  ctx.drawImage(img1, 0, 0, W / 2, H);
  ctx.drawImage(img2, W / 2, 0, W / 2, H);

  // DARK OVERLAY
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(0, 0, W, H);

  // CENTER DIVIDER
  ctx.strokeStyle = "#ffffff55";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W / 2, 0);
  ctx.lineTo(W / 2, H);
  ctx.stroke();

  // ===== TOP SMALL DPs =====
  drawCircle(ctx, img1, W / 2 - 120, 360, 70);
  drawCircle(ctx, img2, W / 2 + 120, 360, 70);

  // ===== NAMES =====
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 48px Arial";
  ctx.textAlign = "center";
  ctx.fillText(name1, W / 2 - 200, 520);
  ctx.fillText(name2, W / 2 + 200, 520);

  ctx.font = "42px Arial";
  ctx.fillText("❤️", W / 2, 520);

  // ===== CALL TIME =====
  ctx.font = "36px Arial";
  ctx.fillStyle = "#dddddd";
  ctx.fillText("10:19", W / 2, 580);

  // ===== BOTTOM BUTTONS =====
  drawButton(ctx, W / 2 - 250, 1550, "🎤");
  drawButton(ctx, W / 2, 1550, "📞", true);
  drawButton(ctx, W / 2 + 250, 1550, "🔈");

  fs.writeFileSync(out, canvas.toBuffer("image/png"));
  fs.unlinkSync(a1);
  fs.unlinkSync(a2);

  // ===== SEND IMAGE ONLY =====
  return api.sendMessage(
    {
      attachment: fs.createReadStream(out)
    },
    threadID,
    () => fs.unlinkSync(out),
    messageID
  );
};

// ===== HELPERS =====
function drawCircle(ctx, img, x, y, r) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
  ctx.restore();
}

function drawButton(ctx, x, y, icon, red = false) {
  ctx.beginPath();
  ctx.arc(x, y, 75, 0, Math.PI * 2);
  ctx.fillStyle = red ? "#ff3b30" : "#2a2a2a";
  ctx.fill();

  ctx.font = "50px Arial";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(icon, x, y + 18);
}
