module.exports.config = {
  name: "grouplink",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Jihad",
  description: "Show group links without prefix",
  commandCategory: "noprefix",
  cooldowns: 3
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!event.body) return;

  const text = event.body.toLowerCase().trim();

  // noprefix trigger
  if (text !== "group link") return;

  const msg = `
     💙 ⏤͟͟͞͞𝐺⃤𝑅𝑂𝑈𝑃 ⏤͟͟͞͞𝐿𝐼𝑁𝐾 💙


❶ 🌸 ━━━⏤͟͟͞͞𝐴⃠𝐷𝐷𝐴༆⏤͟͟͞͞𝐵⃠𝑂𝑋☹︎ ♡━━━
🔗 https://m.me/j/AbYIei7ck92AHWwW/


❷ 🌸 ──⃜⃜͢͢🍒͟͟͞͞๛⃝ 𝐶𝐴𝑃𝑇𝐴𝐼𝑁 𝐵𝑂𝑋•─⃜⃜͢͢🍒͟͟͞͞๛⃝ 
🔗 https://m.me/j/AbYRt0avuOAx9OUx/


❸ 🌸 🐰-( 𝐒𝐭𝐨𝐫𝐲 𝐯𝐢𝐝𝐞𝐨 𝐁𝐨𝐱 ) ( 
🔗 https://m.me/j/AbbwO_j5t2yMH8s1/


❹ 🌸 ༺۝⏤͟͟͞͞𝑪⃠𝑨𝑳𝐿⏤͟͟͞͞𝐵𝑂𝑋۝༻
🔗 https://m.me/j/Abaxj4BxvHCHUEEn/


⏤͟͟͞͞𝐴⃠𝐷𝑀𝐼𝑁 ⏤͟͟͞͞𝐽⃤𝐼𝐻𝐴𝐷 ⏤͟͟͞͞𝐻𝐴𝑆𝐴𝑁


    💞 𝐽𝑜𝑖𝑛 𝑁𝑜𝑤 💞
`;

  return api.sendMessage(msg, event.threadID);
};

// empty run (required by Mirai)
module.exports.run = async () => {};
