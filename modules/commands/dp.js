module.exports.config = {
  name: "dp",
  version: "8.2.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Single DP (Exact Size Like Sample)",
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

module.exports.run = async function ({ api, event, Users }) {
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

  // ===== BACKGROUND =====
  const bgImg = await axios.get(
    "https://i.ibb.co/Y7MwM6S2/5121aa412f9f.jpg",
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

  // ===== EXACT SAMPLE SIZE =====
  // DP size & position tuned to match your image
  drawDP(ctx, img, 270, 170, 540);

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

// ===== DP DRAW FUNCTION =====
function drawDP(ctx, img, x, y, size) {
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 25;
  ctx.drawImage(img, x, y, size, size);
  ctx.restore();

  // white frame like sample
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 14;
  ctx.strokeRect(x, y, size, size);
}
