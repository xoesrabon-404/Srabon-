module.exports.config = {
  name: "dp2",
  version: "8.4.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Small Circular DP (Between Wings)",
  usePrefix: true,
  commandCategory: "fun",
  usages: "[reply | mention | self]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "canvas": ""
  }
};

module.exports.run = async function ({ api, event }) {
  const { createCanvas, loadImage } = require("canvas");
  const fs = require("fs-extra");
  const axios = require("axios");

  const cache = __dirname + "/cache/";
  if (!fs.existsSync(cache)) fs.mkdirSync(cache, { recursive: true });

  const out = cache + "dp.png";
  const av = cache + "av.png";
  const bg = cache + "bg.jpg";

  const { senderID, threadID, messageID } = event;

  let uid;
  if (event.messageReply?.senderID) uid = event.messageReply.senderID;
  else if (event.mentions && Object.keys(event.mentions).length === 1)
    uid = Object.keys(event.mentions)[0];
  else uid = senderID;

  const token = "6628568379|c1e620fa708a1d5696fb991c1bde5662";

  // ===== AVATAR =====
  const avatar = await axios.get(
    `https://graph.facebook.com/${uid}/picture?type=large&access_token=${token}`,
    { responseType: "arraybuffer" }
  );
  fs.writeFileSync(av, avatar.data);

  // ===== BACKGROUND (WINGS) =====
  const bgImg = await axios.get(
    "https://i.ibb.co/MxqbcjzL/25e7b945fb21.jpg",
    { responseType: "arraybuffer" }
  );
  fs.writeFileSync(bg, bgImg.data);

  // ===== CANVAS =====
  const W = 1080;
  const H = 1080;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  const background = await loadImage(bg);
  ctx.drawImage(background, 0, 0, W, H);

  const img = await loadImage(av);

  // ===== SMALL DP (BETWEEN WINGS) =====
  // size chhota + center mein
  drawCircularDP(ctx, img, 390, 360, 300);

  fs.writeFileSync(out, canvas.toBuffer("image/png"));

  fs.unlinkSync(av);
  fs.unlinkSync(bg);

  return api.sendMessage(
    { attachment: fs.createReadStream(out) },
    threadID,
    () => fs.unlinkSync(out),
    messageID
  );
};

// ===== CIRCULAR DP FUNCTION =====
function drawCircularDP(ctx, img, x, y, size) {
  const r = size / 2;
  const cx = x + r;
  const cy = y + r;

  ctx.save();

  // soft shadow
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 30;

  // clip circle
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(img, x, y, size, size);

  ctx.restore();

  // white circular border
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 12;
  ctx.stroke();
}
