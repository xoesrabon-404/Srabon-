module.exports.config = {
  name: "dp3",
  version: "9.4.0",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "MADE BY ARIF BABU 😉",
  usePrefix: true,
  commandCategory: "fun",
  usages: "[reply + 2 mentions] or just #DP",
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
  const av1 = cache + "av1.png";
  const av2 = cache + "av2.png";
  const av3 = cache + "av3.png";
  const bg = cache + "bg.jpg";
  const { senderID, threadID, messageID, mentions, messageReply } = event;
  const ids = Object.keys(mentions || {});
  // ===== USER IDS FIX =====
  let one, two, three;
  if (messageReply) {
    // Reply case
    one = messageReply.senderID;          // LEFT square = reply sender
    two = ids[0] || senderID;             // RIGHT 1 = first mention or sender
    three = ids[1] || senderID;           // RIGHT 2 = second mention or sender
  } else if (ids.length > 0) {
    // Mentions only
    one = senderID;                       // LEFT square = sender
    two = ids[0];                          // RIGHT 1 = first mention
    three = ids[1] || senderID;           // RIGHT 2 = second mention or sender
  } else {
    // #DP alone
    one = senderID;
    two = senderID;
    three = senderID;
  }
  const token = "6628568379|c1e620fa708a1d5696fb991c1bde5662"; // FB Graph Token
  try {
    // ===== FETCH PROFILE PICTURES =====
    const a1 = await axios.get(
      `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=${token}`,
      { responseType: "arraybuffer" }
    );
    fs.writeFileSync(av1, a1.data);
    const a2 = await axios.get(
      `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=${token}`,
      { responseType: "arraybuffer" }
    );
    fs.writeFileSync(av2, a2.data);
    const a3 = await axios.get(
      `https://graph.facebook.com/${three}/picture?width=512&height=512&access_token=${token}`,
      { responseType: "arraybuffer" }
    );
    fs.writeFileSync(av3, a3.data);
    // ===== BACKGROUND =====
    const bgImg = await axios.get(
      "https://i.ibb.co/PvhQnNrJ/bb5f5ab208ee.jpg",
      { responseType: "arraybuffer" }
    );
    fs.writeFileSync(bg, bgImg.data);
    // ===== CANVAS =====
    const W = 1200;
    const H = 700;
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");
    const background = await loadImage(bg);
    ctx.drawImage(background, 0, 0, W, H);
    const img1 = await loadImage(av1);
    const img2 = await loadImage(av2);
    const img3 = await loadImage(av3);
    // ===== DRAW DP =====
    drawSquareDP(ctx, img1, 70, 120, 380);                  // LEFT square
    drawCircleDP(ctx, img2, 600, 170, 220, "#FFD700");    // RIGHT 1 - gold border
    drawCircleDP(ctx, img3, 860, 170, 220, "#00FFFF");    // RIGHT 2 - cyan border
    // ===== SAVE & SEND =====
    fs.writeFileSync(out, canvas.toBuffer("image/png"));
    [av1, av2, av3, bg].forEach(p => fs.unlinkSync(p));
    return api.sendMessage(
      { attachment: fs.createReadStream(out) },
      threadID,
      () => fs.unlinkSync(out),
      messageID
    );
  } catch (err) {
    console.log(err);
    return api.sendMessage("DP generate failed 😢", threadID, messageID);
  }
};
// ===== FUNCTIONS =====
function drawSquareDP(ctx, img, x, y, size) {
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 25;
  ctx.drawImage(img, x, y, size, size);
  ctx.restore();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 12;
  ctx.strokeRect(x, y, size, size);
}
function drawCircleDP(ctx, img, x, y, size, borderColor = "#ffffff") {
  const r = size / 2;
  const cx = x + r;
  const cy = y + r;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 25;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(img, x, y, size, size);
  ctx.restore();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 10;
  ctx.stroke();
}
