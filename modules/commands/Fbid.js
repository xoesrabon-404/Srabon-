module.exports.config = {
  name: "fbid",
  version: "1.1.3",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Facebook Identity Card (Fan Made)",
  usePrefix: true,
  commandCategory: "fun",
  usages: "[self | mention | reply]",
  cooldowns: 5,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.run = async function ({ api, event, Users }) {
  const { createCanvas, loadImage } = require("canvas");
  const axios = require("axios");
  const fs = require("fs-extra");

  const cache = __dirname + "/cache/";
  if (!fs.existsSync(cache)) fs.mkdirSync(cache, { recursive: true });

  const out = cache + "fb_id_card.png";
  const avatarPath = cache + "avatar.png";

  let uid;
  if (event.messageReply?.senderID) {
    uid = event.messageReply.senderID;
  } else if (Object.keys(event.mentions || {}).length === 1) {
    uid = Object.keys(event.mentions)[0];
  } else {
    uid = event.senderID;
  }

  const name = await Users.getNameUser(uid);
  const profile = `fb.com/${uid}`;

  // ===== GENDER (MALE / FEMALE ONLY) =====
  let gender;
  try {
    const info = await api.getUserInfo(uid);
    if (info[uid]?.gender === 1) gender = "Unknown";
    else if (info[uid]?.gender === 2) gender = "Unknown";
  } catch (e) {}

  // fallback (agar hidden ho)
  if (!gender) {
    gender = Math.random() > 0.5 ? "Unknown" : "Unknown";
  }

  // ===== RANDOM DOB =====
  function randomDOB() {
    const year = Math.floor(Math.random() * (2005 - 1975 + 1)) + 1975;
    const month = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 28) + 1;
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${day} ${months[month]} ${year}`;
  }

  // ===== RANDOM ISSUE DATE =====
  function randomIssueDate() {
    const year = Math.floor(Math.random() * (2024 - 2018 + 1)) + 2018;
    const month = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 28) + 1;
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${day} ${months[month]} ${year}`;
  }

  const locations = [
    "India","Bangladesh","Pakistan","Nepal","Sri Lanka",
    "Myanmar","Thailand","Indonesia","Philippines",
    "Malaysia","Singapore","United States","United Kingdom",
    "Canada","Australia","Germany","France","Brazil"
  ];

  const dob = randomDOB();
  const issueDate = randomIssueDate();
  const location = locations[Math.floor(Math.random() * locations.length)];

  // ===== FACEBOOK DP =====
  const token = "6628568379|c1e620fa708a1d5696fb991c1bde5662";
  const av = await axios.get(
    `https://graph.facebook.com/${uid}/picture?type=large&access_token=${token}`,
    { responseType: "arraybuffer" }
  );
  fs.writeFileSync(avatarPath, av.data);

  // ===== CANVAS =====
  const W = 1000;
  const H = 620;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#f2f2f2";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#4267B2";
  ctx.fillRect(0, 0, W, 110);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 42px Arial";
  ctx.fillText("facebook", 40, 70);

  ctx.font = "28px Arial";
  ctx.fillText("Identity Card", 240, 70);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(30, 140, 940, 430);

  const avatar = await loadImage(avatarPath);
  ctx.drawImage(avatar, 60, 180, 220, 220);
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 4;
  ctx.strokeRect(60, 180, 220, 220);

  ctx.fillStyle = "#000";
  ctx.font = "bold 26px Arial";
  ctx.fillText("Name:", 320, 220);
  ctx.fillText("Gender:", 320, 270);
  ctx.fillText("Date of Birth:", 320, 320);
  ctx.fillText("Profile:", 320, 370);
  ctx.fillText("Location:", 320, 420);

  ctx.font = "26px Arial";
  ctx.fillText(name, 500, 220);
  ctx.fillText(gender, 500, 270);
  ctx.fillText(dob, 500, 320);
  ctx.fillText(profile, 500, 370);
  ctx.fillText(location, 500, 420);

  ctx.font = "24px Arial";
  ctx.fillText("Date of Issue:", 60, 450);
  ctx.fillText(issueDate, 60, 490);

  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = "red";
  ctx.font = "bold 36px Arial";
  ctx.rotate(-0.2);
  ctx.fillText("JIHAD - HASAN", 200, 520);
  ctx.restore();

  fs.writeFileSync(out, canvas.toBuffer("image/png"));
  fs.unlinkSync(avatarPath);

  return api.sendMessage(
    { attachment: fs.createReadStream(out) },
    event.threadID,
    () => fs.unlinkSync(out),
    event.messageID
  );
};
