const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "notice",
  version: "4.4.0",
  hasPermssion: 2,
  credits: "JIHAD",
  description: "SEND ADMIN NOTICE TO ALL GROUPS (LINK SAFE)",
  commandCategory: "SYSTEM",
  usages: ".NOTICE [TEXT] OR REPLY",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  let input = args.join(" ");
  let attachments = [];

  const cacheDir = path.join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);

  // ===== HANDLE REPLY =====
  if (event.messageReply) {
    const r = event.messageReply;

    if (!input && r.body) input = r.body; // ❌ NO toUpperCase

    if (r.attachments?.length > 0) {
      for (const atc of r.attachments) {
        let ext;
        if (atc.type === "photo") ext = ".jpg";
        else if (atc.type === "animated_image") ext = ".gif";
        else if (atc.type === "video") ext = ".mp4";
        else continue;

        const filePath = path.join(
          cacheDir,
          `${Date.now()}_${Math.floor(Math.random() * 9999)}${ext}`
        );

        const res = await axios.get(atc.url, { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, Buffer.from(res.data));
        attachments.push(filePath);
      }
    }
  }

  if (!input && attachments.length === 0) {
    return api.sendMessage(
      "USAGE:\n.NOTICE [MESSAGE]\nOR REPLY TO MEDIA/TEXT WITH .NOTICE",
      event.threadID,
      event.messageID
    );
  }

  // ===== ENGLISH TIME =====
  const time = new Date().toLocaleString("EN-US", {
    timeZone: "Asia/Dhaka",
    hour12: true
  });

  const msg =
`ッ𝑭𝒓𝒐𝒎⏤͟͟͞͞𝑱𝒊𝒉𝒂𝒅 ⸕𝑯𝒂𝒔𝒂𝒏 ᥫ᭡
━━━━━━♡♥♡━━━━━━

${input}

━━━━━━♡♥♡━━━━━━
`;

  let threads = [];
  try {
    threads = await api.getThreadList(50, null, ["INBOX"]);
  } catch {
    return api.sendMessage(
      "ERROR: UNABLE TO FETCH GROUP LIST.",
      event.threadID,
      event.messageID
    );
  }

  const groups = threads.filter(t => t.isGroup);
  let sent = 0;

  for (const g of groups) {
    try {
      await api.sendMessage(
        {
          body: msg,
          attachment: attachments.map(f => fs.createReadStream(f))
        },
        g.threadID
      );
      sent++;
      await new Promise(r => setTimeout(r, 600));
    } catch {}
  }

  for (const f of attachments) {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  }

  return api.sendMessage(
    `NOTICE SENT TO ${sent} GROUPS.`,
    event.threadID,
    event.messageID
  );
};
