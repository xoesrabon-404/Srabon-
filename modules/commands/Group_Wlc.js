module.exports.config = {
  name: "welcome",
  aliases: ["wlc"],
  version: "3.1.0",
  hasPermssion: 0,
  credits: "Jihad",
  description: "Welcome message with two commands (welcome / wlc)",
  commandCategory: "group",
  usages: ".welcome @mention | .wlc @mention",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {

  // ❌ mention না থাকলে
  if (!event.mentions || Object.keys(event.mentions).length === 0) {
    return api.sendMessage(
      "⚠️ ব্যবহার:\n.welcome @মেনশন\n.wlc @মেনশন",
      event.threadID,
      event.messageID
    );
  }

  // 🏷️ Group name
  let groupName = "এই গ্রুপ";
  try {
    const info = await api.getThreadInfo(event.threadID);
    groupName = info.threadName || groupName;
  } catch {}

  // 👥 Mentions
  const mentions = [];
  let memberNames = "";

  for (const id in event.mentions) {
    const name = event.mentions[id];
    mentions.push({ tag: `@${name}`, id });
    memberNames += `@${name} `;
  }

  const message =
`🎉💜✨ 𝑊𝑒𝑙𝑐𝑜𝑚𝑒 𝑇ℎ𝑒 𝐹𝑎𝑚𝑖𝑙𝑦 ✨💜🎉


💌💜 হ্যালো সবাই 💜😊 
 
আমাদের নতুন মেসেঞ্জার গ্রুপে তোমাদের স্বাগতম ! 🥰💫  
এখানেই হবে হাসি-খুশি 😄🎈, গল্পগুজব 💬🌀  
আর একে অপরের সঙ্গে ভাগাভাগি করার অসীম আনন্দ! 🌈💖

━━━━━━━━━━━━━━━━━━━

🌸🤲 ⏤͟͟͞͞𝐴𝑠𝑠𝑎𝑙𝑎𝑚𝑢 ⏤͟͟͞͞𝐴𝑙𝑎𝑖𝑘𝑢𝑚 🤲🌸

🏷️ ⏤͟͟͞͞𝐺𝑟𝑜𝑢𝑝 𝑁𝑎𝑚𝑒 ღ 
➤ ${groupName} ᥫ᭡

🤍✨ ⏤͟͟͞͞𝑁𝑒𝑤 ⏤͟͟͞͞𝐌𝐞𝐦𝐛𝐞𝐫
➤ᥫ᭡ ${memberNames} ᥫ᭡🎉🥰

📜✨ 𝐺𝑟𝑜𝑢𝑝 𝑅𝑢𝑙𝑒 💜🎀

❶ ⏤͟͟͞͞🚫 সবর সাথে ভালো ব্যবহার করবেন 💜  
❷ ⏤͟͟͞͞⭕ গ্রুপের নাম ও প্রোফাইল চেঞ্জ করা যাবে না 🚫  
❸ ⏤⭕͟͟͞͞এডমিন ছাড়া @everyone নিবেন না  🚫  
❹ ⏤͟͟͞͞🔞 ১৮+ কনটেন্ট নিষিদ্ধ 🚫  
❺ ⏤͟͟͞͞📵 ইনবক্সে নক দেওয়া যাবে না 🚫  
❻ ⏤͟͟͞͞💔 রিলেশন সমস্যা করলে দুজনকেই রিমুভ ⚠️  
❼ ⏤͟͟͞͞⏳ ৩ দিন এক্টিভ না থাকলে রিমুভ ⚠️  
❽ ⏤͟͟͞͞🧑‍💼 সমস্যা হলে এডমিনকে জানান ⚠️  
❾ ⏤͟͟͞͞🎉 নতুন মেম্বার এলে সবাই ওয়েলকাম জানাবেন ✅  
❶⓿ ⏤͟͟͞͞🛑 𝑇𝑒𝑥𝑡 𝑜𝑓𝑓 বলার পর কোনো টেক্সট দিলে সোজা কিক ❗

🙏 ⏤͟͟͞͞সবাই নিয়ম মেনে চলবেন আশা করিᜊ 🌸
 
 ⏤͟͟͞͞𝐿𝑜𝑣𝑒 𝐹𝑜𝑟𝑒𝑣𝑒𝑟 🫶💞

⚠️ শেষ কথা:
💔 প্রেম / প্রিরিতি নিয়ে সমস্যা করলে 🙂
⛔ বিনা নোটিশে রিমুভ করা হবে 🚫


⏤͟͟͞͞𝑻𝒉𝒂𝒏𝒌 ⏤͟͟͞͞𝑭𝒐𝒓 ⏤͟͟͞͞𝑼𝒔𝒊𝒏𝒈 ⏤͟͟͞͞𝑆𝑅𝐴𝐵𝑂𝑁 ⏤͟͟͞͞𝐶𝐻𝐴𝑇 ⏤͟͟͞͞𝐵𝑂𝑇`;

  return api.sendMessage(
    {
      body: message,
      mentions
    },
    event.threadID,
    event.messageID
  );
};
