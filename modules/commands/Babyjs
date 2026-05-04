const axios = require("axios");

let simsim = "";

(async () => {
  try {
    const res = await axios.get("https://raw.githubusercontent.com/rxabdullah0007/rX-apis/main/xApis/rXallApi.json");
    if (res.data && res.data.baby) {
      simsim = res.data.baby;
    }
  } catch {}
})();

module.exports.config = {
  name: "baby",
  version: "1.0.7",
  hasPermssion: 0,
  credits: "rX",
  description: "AI auto teach with Teach & List  support + Typing effect", //Better then all simsimi
  commandCategory: "chat",
  usages: "[query]",
  cooldowns: 0,
  prefix: false
};

module.exports.run = async function ({ api, event, args, Users }) {
  const uid = event.senderID;
  const senderName = await Users.getNameUser(uid);
  const query = args.join(" ").toLowerCase();

  try {
    if (!simsim) return api.sendMessage("❌ API not loaded yet.", event.threadID, event.messageID);

    if (args[0] === "autoteach") {
      const mode = args[1];
      if (!["on", "off"].includes(mode)) {
        return api.sendMessage("✅ Use: baby autoteach on/off", event.threadID, event.messageID);
      }
      const status = mode === "on";
      await axios.post(`${simsim}/setting`, { autoTeach: status });
      return api.sendMessage(`✅ Auto teach is now ${status ? "ON 🟢" : "OFF 🔴"}`, event.threadID, event.messageID);
    }

    if (args[0] === "list") {
      const res = await axios.get(`${simsim}/list`);
      return api.sendMessage(
        `╭─╼🌟 𝐁𝐚𝐛𝐲 𝐀𝐈 𝐒𝐭𝐚𝐭𝐮𝐬\n├ 📝 𝐓𝐞𝐚𝐜𝐡𝐞𝐝 𝐐𝐮𝐞𝐬𝐭𝐢𝐨𝐧𝐬: ${res.data.totalQuestions}\n├ 📦 𝐒𝐭𝐨𝐫𝐞𝐝 𝐑𝐞𝐩𝐥𝐢𝐞𝐬: ${res.data.totalReplies}\n╰─╼👤 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫: 𝐫𝐗 𝐀𝐛𝐝𝐮𝐥𝐥𝐚𝐡`,
        event.threadID,
        event.messageID
      );
    }

    if (args[0] === "msg") {
      const trigger = args.slice(1).join(" ").trim();
      if (!trigger) return api.sendMessage("❌ | Use: !baby msg [trigger]", event.threadID, event.messageID);

      const res = await axios.get(`${simsim}/simsimi-list?ask=${encodeURIComponent(trigger)}`);
      if (!res.data.replies || res.data.replies.length === 0) {
        return api.sendMessage("❌ No replies found.", event.threadID, event.messageID);
      }

      const formatted = res.data.replies.map((rep, i) => `➤ ${i + 1}. ${rep}`).join("\n");
      const msg = `📌 𝗧𝗿𝗶𝗴𝗴𝗲𝗿: ${trigger.toUpperCase()}\n📋 𝗧𝗼𝘁𝗮𝗹: ${res.data.total}\n━━━━━━━━━━━━━━\n${formatted}`;
      return api.sendMessage(msg, event.threadID, event.messageID);
    }

    if (args[0] === "teach") {
      const parts = query.replace("teach ", "").split(" - ");
      if (parts.length < 2)
        return api.sendMessage("❌ | Use: teach [Question] - [Reply]", event.threadID, event.messageID);

      const [ask, ans] = parts;
      const res = await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderID=${uid}&senderName=${encodeURIComponent(senderName)}`);
      return api.sendMessage(`✅ ${res.data.message}`, event.threadID, event.messageID);
    }

    if (args[0] === "edit") {
      const parts = query.replace("edit ", "").split(" - ");
      if (parts.length < 3)
        return api.sendMessage("❌ | Use: edit [Question] - [OldReply] - [NewReply]", event.threadID, event.messageID);

      const [ask, oldR, newR] = parts;
      const res = await axios.get(`${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldR)}&new=${encodeURIComponent(newR)}`);
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    if (["remove", "rm"].includes(args[0])) {
      const parts = query.replace(/^(remove|rm)\s*/, "").split(" - ");
      if (parts.length < 2)
        return api.sendMessage("❌ | Use: remove [Question] - [Reply]", event.threadID, event.messageID);

      const [ask, ans] = parts;
      const res = await axios.get(`${simsim}/delete?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`);
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    if (!query) {
      const texts = [""];
      const reply = texts[Math.floor(Math.random() * texts.length)];
      return api.sendMessage(reply, event.threadID);
    }

    const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);
    return api.sendMessage(res.data.response, event.threadID, (err, info) => {
      if (!err) {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: "simsimi"
        });
      }
    }, event.messageID);
  } catch (e) {
    return api.sendMessage(`❌ Error: ${e.message}`, event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function ({ api, event, Users }) {
  const senderName = await Users.getNameUser(event.senderID);
  const text = event.body?.toLowerCase();
  if (!text || !simsim) return;

  try {
    // rX Abdullah 
    try {
      await api.sendTypingIndicatorV2(true, event.threadID);
      await new Promise(r => setTimeout(r, 2000));
      await api.sendTypingIndicatorV2(false, event.threadID);
    } catch (err) {
      console.log("⚠️ Typing indicator not supported:", err.message);
    }

    const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(text)}&senderName=${encodeURIComponent(senderName)}`);
    return api.sendMessage(res.data.response, event.threadID, (err, info) => {
      if (!err) {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: "simsimi"
        });
      }
    }, event.messageID);
  } catch (e) {
    return api.sendMessage(`❌ Error: ${e.message}`, event.threadID, event.messageID);
  }
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  const text = event.body?.toLowerCase().trim();
  if (!text || !simsim) return;

  const senderName = await Users.getNameUser(event.senderID);
  const triggers = ["baby", "bby", "xan", "bot", "mari", "মারিয়া"];

  if (triggers.includes(text)) {
    const replies = [
"⏤͟͟͞͞𝐴𝑠𝑠𝑎𝑙𝑎𝑚𝑢𝑙𝑎𝑖𝑘𝑢𝑚 𝑆𝑖𝑟 𝐾𝑖𝑣𝑎𝑏𝑒 ℎ𝑒𝑙𝑝 𝑘𝑜𝑟𝑡𝑒 𝑝𝑎𝑟𝑖..??",
"বলেন sir__😌",
"𝑠𝑟𝑎𝑏𝑜𝑛 কে দেখছো ..? খুজে পাচ্ছি না 🥺☹️",
"⏤͟͟͞͞𝐴𝑠𝑠𝑎𝑙𝑎𝑚𝑢𝑙𝑎𝑖𝑘𝑢𝑚 𝑆𝑖𝑟 \n\n\n\n𝑱𝒊𝒉𝒂𝒅 𝐶ℎ𝑎𝑡 𝑏𝑜𝑡 𝐻𝑜𝑤 𝑐𝑎𝑛 𝐼 ℎ𝑒𝑙𝑝 𝑌𝑜𝑢 𝑇𝑜𝑑𝑦....??",
"𝑠𝑟𝑎𝑏𝑜𝑛 কে দেখছো ..? খুজে পাচ্ছি না 🥺☹️",
"𝑠𝑟𝑎𝑏𝑜𝑛 কে দেখছো ..? খুজে পাচ্ছি না 🥺☹️",
"𝑠𝑟𝑎𝑏𝑜𝑛 কে দেখছো ..? খুজে পাচ্ছি না 🥺☹️",
"⏤͟͟͞͞𝐴𝑠𝑠𝑎𝑙𝑎𝑚𝑢𝑙𝑎𝑖𝑘𝑢𝑚 𝐷𝑒𝑎𝑟 💕\n\n\n\n 𝐻𝑜𝑤 𝑐𝑎𝑛 𝐼 ℎ𝑒𝑙𝑝 𝑌𝑜𝑢....??",
"আম গাছে আম নাই ঢিল কেন মারো, তোমার সাথে প্রেম নাই বেবি কেন ডাকো 😒",
"𝑠𝑟𝑎𝑏𝑜𝑛 কে দেখছো ..? খুজে পাচ্ছি না 🥺☹️",
"আম গাছে আম নাই ঢিল কেন মারো, তোমার সাথে প্রেম নাই বেবি কেন ডাকো 😒",
"𝑆𝑟𝑎𝑏𝑜𝑛 কে দেখছো ..? খুজে পাচ্ছি না 🥺☹️",
"𝑇𝑟𝑢𝑠𝑡 𝑀𝑒 𝐼 𝑎𝑚 𝐵𝑎𝑏𝑦 🧃",
"baby baby করলে মেরে তোর মাথা ফাটাই দিবো 😒🔪"
];
    const reply = replies[Math.floor(Math.random() * replies.length)];

    try {
      await api.sendTypingIndicatorV2(true, event.threadID);
      await new Promise(r => setTimeout(r, 5000)); // 5 seconds typing
      await api.sendTypingIndicatorV2(false, event.threadID);
    } catch (err) {
      console.log("⚠️ Typing indicator not supported:", err.message);
    }

    return api.sendMessage(reply, event.threadID, (err, info) => {
      if (!err) {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: "simsimi"
        });
      }
    });
  }

  const matchPrefix = /^(baby|bby|xan|bot|mari|মারিয়া)\s+/i;
  if (matchPrefix.test(text)) {
    const query = text.replace(matchPrefix, "").trim();
    if (!query) return;

    // rX Abdullah × Maria rani
    try {
      await api.sendTypingIndicatorV2(true, event.threadID);
      await new Promise(r => setTimeout(r, 5000));
      await api.sendTypingIndicatorV2(false, event.threadID);
    } catch (err) {
      console.log("⚠️ Typing indicator not supported:", err.message);
    }

    try {
      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);
      return api.sendMessage(res.data.response, event.threadID, (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "simsimi"
          });
        }
      }, event.messageID);
    } catch (e) {
      return api.sendMessage(`❌ Error: ${e.message}`, event.threadID, event.messageID);
    }
  }

  // ✅ Auto-teach on reply messages
  if (event.type === "message_reply") {
    try {
      const setting = await axios.get(`${simsim}/setting`);
      if (!setting.data.autoTeach) return;

      const ask = event.messageReply.body?.toLowerCase().trim();
      const ans = event.body?.toLowerCase().trim();
      if (!ask || !ans || ask === ans) return;

      setTimeout(async () => {
        try {
          await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(senderName)}`);
          console.log("✅ Auto-taught:", ask, "→", ans);
        } catch (err) {
          console.error("❌ Auto-teach internal error:", err.message);
        }
      }, 300);
    } catch (e) {
      console.log("❌ Auto-teach setting error:", e.message);
    }
  }
};
