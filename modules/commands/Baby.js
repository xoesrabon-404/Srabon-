const axios = require("axios");
const simsim = "https://api.cyber-ninjas.top";

module.exports = {
  config: {
    name: "marai",
    version: "2.0.0",
    author: "rX",
    countDown: 0,
    role: 0,
    shortDescription: "MarAI Chatbot",
    longDescription: "MarAI Smart Chatbot with auto-learning feature",
    category: "ai",
    guide: {
      en: "{pn} [message]\n{pn} teach [Question] - [Answer]\n{pn} list"
    }
  },

  // ─────────────── MAIN COMMAND ───────────────
  onStart: async function ({ api, event, args, message, usersData }) {
    const senderID = event.senderID;
    const senderName = await usersData.getName(senderID);
    const query = args.join(" ").trim();
    const threadID = event.threadID;
    const messageID = event.messageID;

    try {
      if (!query) {
        const ran = ["Yes? I'm MarAI! 🤖", "MarAI here! What's up? 😊"];
        const r = ran[Math.floor(Math.random() * ran.length)];
        return message.reply(r, (err, info) => {
          if (!err) {
            // Mari bot uses different reply system
            // Remove or modify this line if not working
            if (global.mariReply) {
              global.mariReply.set(info.messageID, {
                commandName: "marai",
                author: senderID
              });
            }
          }
        });
      }

      // ─── Teach command ───
      if (args[0] === "teach") {
        const parts = query.replace("teach ", "").split(" - ");
        if (parts.length < 2)
          return message.reply("Use: marai teach [Question] - [Reply]");
        const [ask, ans] = parts;
        const res = await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(senderName)}`);
        return message.reply(res.data.message || "Learned successfully!");
      }

      // ─── List command ───
      if (args[0] === "list") {
        const res = await axios.get(`${simsim}/list`);
        if (res.data.code === 200)
          return message.reply(`📊 MarAI Knowledge:\n• Questions: ${res.data.totalQuestions}\n• Replies: ${res.data.totalReplies}\n• Author: ${res.data.author}`);
        else
          return message.reply(`Error: ${res.data.message || "Failed to fetch list"}`);
      }

      // ─── Normal chat ───
      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);
      const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];
      
      if (!responses || responses.length === 0) {
        console.log(`🤖 Auto-teaching new phrase: "${query}"`);
        await axios.get(`${simsim}/teach?ask=${encodeURIComponent(query)}&ans=${encodeURIComponent("Interesting! I'll remember that. 🤔")}&senderName=${encodeURIComponent(senderName)}`);
        return message.reply("Interesting! I'll remember that. 🤔");
      }

      for (const reply of responses) {
        await message.reply(reply);
      }

    } catch (err) {
      console.error("❌ MarAI error:", err);
      message.reply(`Error: ${err.message}`);
    }
  },

  // ─────────────── AUTO CHAT TRIGGER ───────────────
  onChat: async function ({ api, event, message, usersData }) {
    const raw = event.body ? event.body.trim() : "";
    if (!raw) return;

    const senderName = await usersData.getName(event.senderID);
    const senderID = event.senderID;
    const threadID = event.threadID;

    try {
      const simpleTriggers = ["marai", "mari", "maria", "মারাই", "ai"];
      const lowerRaw = raw.toLowerCase();
      
      if (simpleTriggers.some(trigger => lowerRaw === trigger)) {
        const replies = [
          "Yes? I'm MarAI! How can I assist you? 🤖",
          "MarAI here! What do you need? 😊",
          "Hello! MarAI at your service. 👋",
          "MarAI listening... 🔊",
          "Hey there! MarAI ready to help! ⚡"
        ];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        return message.reply(reply);
      }

      // যদি "marai [text]" বা "mari [text]" হয়
      const prefixes = ["marai ", "mari ", "maria ", "মারাই "];
      const prefix = prefixes.find(p => raw.toLowerCase().startsWith(p));
      
      if (prefix) {
        const query = raw.slice(prefix.length).trim();
        if (!query) return;
        
        const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);
        const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

        if (!responses || responses.length === 0) {
          console.log(`🧠 Auto-learned: "${query}"`);
          await axios.get(`${simsim}/teach?ask=${encodeURIComponent(query)}&ans=${encodeURIComponent("That's interesting! Tell me more. 🌟")}&senderName=${encodeURIComponent(senderName)}`);
          return message.reply("That's interesting! Tell me more. 🌟");
        }

        for (const reply of responses) {
          await message.reply(reply);
        }
      }
    } catch (err) {
      console.error("❌ MarAI onChat error:", err);
    }
  }
};
