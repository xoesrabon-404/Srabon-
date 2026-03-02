const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "resend",
  version: "2.8.0",
  hasPermssion: 2,
  credits: "Jihad",
  description: "Unsend Resend with Roman Bangla uppercase box + mention",
  commandCategory: "general",
  cooldowns: 0,
  hide: true
};

// ===== PATHS =====
const CACHE_DIR = path.join(__dirname, "cache");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);

const DATA_PATH = path.join(__dirname, "resendData.json");
if (!fs.existsSync(DATA_PATH)) fs.writeJsonSync(DATA_PATH, {});

// ===== MEMORY =====
global.resendData ||= new Map();

// ===== EXEMPT UID =====
const exemptUIDs = [
  "100089997213872",
  "100086331559699"
];

// ===== HANDLE EVENT =====
module.exports.handleEvent = async ({ event, api, Users }) => {
  const { threadID, senderID, type, messageID } = event;

  if (exemptUIDs.includes(String(senderID))) return;

  const data = fs.readJsonSync(DATA_PATH);
  if (data[threadID] === false) return; // OFF

  const botID = api.getCurrentUserID();
  if (senderID == botID) return;

  if (type !== "message_unsend") {
    global.resendData.set(messageID, {
      body: event.body || "",
      attachments: event.attachments || [],
      senderID,
      threadID
    });
    return;
  }

  const oldMsg = global.resendData.get(event.messageReply?.messageID || messageID);
  if (!oldMsg) return;

  const name = await Users.getNameUser(oldMsg.senderID);

  // ===== VOICE =====
  const voices = oldMsg.attachments.filter(a => a.type === "audio" || a.type === "voice");

  if (voices.length) {
    let files = [];
    let i = 0;

    for (const v of voices) {
      i++;
      const file = path.join(CACHE_DIR, `voice_${i}.mp3`);
      const res = await axios.get(v.url, { responseType: "arraybuffer" });
      fs.writeFileSync(file, Buffer.from(res.data));
      files.push(fs.createReadStream(file));
    }

    return api.sendMessage(
      { body: `🎤 ${name}`, attachment: files },
      threadID,
      () => {
        for (let x = 1; x <= i; x++) {
          const p = path.join(CACHE_DIR, `voice_${x}.mp3`);
          if (fs.existsSync(p)) fs.unlinkSync(p);
        }
      }
    );
  }

  // ===== TEXT / MEDIA =====
  let attachments = [];
  let count = 0;

  for (const f of oldMsg.attachments) {
    count++;
    let ext = "bin";
    if (f.type === "photo") ext = "jpg";
    else if (f.type === "video") ext = "mp4";
    else if (f.type === "animated_image") ext = "gif";

    const file = path.join(CACHE_DIR, `file_${count}.${ext}`);
    const res = await axios.get(f.url, { responseType: "arraybuffer" });
    fs.writeFileSync(file, Buffer.from(res.data));
    attachments.push(fs.createReadStream(file));
  }

  // ===== ROMAN BANGLA BOX =====
  const box = `━━━━♡ •𝐾𝑒 𝑘𝑜𝑡ℎ𝑎𝑦 𝑎𝑐ℎ𝑜 𝑠𝑜𝑏𝑎𝑖 𝑑𝑒𝑘ℎ𝑜 ${name} 𝑒𝑖 𝑚𝑒𝑠𝑠𝑎𝑔𝑒 𝑡𝑎 𝑢𝑛𝑠𝑒𝑛𝑑 𝑘𝑜𝑟𝑐ℎ𝑒 😁😶 ♡━━━━\n\n\n⏤͟͟͞͞𝑢𝑛𝑠𝑒𝑛𝑑 𝑚𝑒𝑠𝑠𝑔𝑒 : ${oldMsg.body || "NO TEXT"}`;

  api.sendMessage(
    {
      body: box,
      mentions: [{ tag: name, id: oldMsg.senderID }],
      attachment: attachments
    },
    threadID,
    () => {
      for (let x = 1; x <= count; x++) {
        ["jpg", "mp4", "gif", "bin"].forEach(ext => {
          const p = path.join(CACHE_DIR, `file_${x}.${ext}`);
          if (fs.existsSync(p)) fs.unlinkSync(p);
        });
      }
    }
  );
};

// ===== COMMAND =====
module.exports.run = async ({ api, event, args }) => {
  const { threadID } = event;
  const data = fs.readJsonSync(DATA_PATH);

  if (!args[0]) return api.sendMessage("Use:\n.resend on\n.resend off", threadID);

  if (args[0].toLowerCase() === "off") {
    data[threadID] = false;
    fs.writeJsonSync(DATA_PATH, data);
    return api.sendMessage("⏤͟͟͞͞𝑂𝑘 𝑆𝑖𝑟 𝑅𝑒𝑠𝑒𝑛𝑑 ℎ𝑎𝑠 𝑏𝑖𝑛 𝑂⃝𝑓𝑓", threadID);
  }

  if (args[0].toLowerCase() === "on") {
    delete data[threadID]; // Default ON
    fs.writeJsonSync(DATA_PATH, data);
    return api.sendMessage("⏤͟͟͞͞𝑂𝑘 𝑆𝑖𝑟 𝑅𝑒𝑠𝑒𝑛𝑑 ⃝", threadID);
  }
};
