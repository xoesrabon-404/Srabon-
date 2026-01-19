module.exports.config = {
  name: "grouplink",
  version: "2.4",
  hasPermssion: 0,
  credits: "Jihad",
  description: "Auto show group links without prefix",
  cooldowns: 3
};

module.exports.handleEvent = async ({ event, api }) => {
  if (!event.body) return;

  const text = event.body.toLowerCase().trim();
  if (text !== "group link") return;

  const message = `
💙  ⏤͟͟͞͞𝐺𝑅𝑂𝑈𝑃𝑆 ⏤͟͟͞͞𝐿𝐼𝑁𝐾  ♥️    

❶ 🌸 Group Name
🔗 https://m.me/j/AbYIei7ck92AHWwW/

❷ 🌸 Group Name
🔗 https://m.me/j/AbYRt0avuOAx9OUx/

❸ 🌸 Group Name
🔗 https://m.me/j/AbbwO_j5t2yMH8s1/

❹ 🌸 Group Name
🔗 https://m.me/j/Abaxj4BxvHCHUEEn/

⏤͟͟͞͞𝐴𝐷𝑀𝐼𝑁 ⏤͟͟͞͞𝐽𝐼𝐻𝐴𝐷 💮🎀
💞 Join Now 💞
  `;

  return api.sendMessage(message, event.threadID);
};

module.exports.run = () => {};
