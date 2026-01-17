module.exports.config = {
  name: "joinRulesEvent",
  eventType: ["log:subscribe"],
  version: "1.0.4",
  credits: "Jihad",
  description: "Welcome rules event only for one specific group with mention"
};

module.exports.run = async ({ event, api }) => {
  const TARGET_THREAD_ID = "1408024517619412";

  // ❌ অন্য গ্রুপ হলে কিছুই করবে না
  if (event.threadID !== TARGET_THREAD_ID) return;

  // 🏷️ গ্রুপের নাম
  let groupName = "এই গ্রুপ";
  try {
    const threadInfo = await api.getThreadInfo(event.threadID);
    groupName = threadInfo.threadName || groupName;
  } catch (e) {}

  // 👥 নতুন মেম্বার
  const added = event.logMessageData?.addedParticipants || [];
  if (added.length === 0) return;

  // 🏷️ Mention data
  const mentions = [];
  const memberNames = added.map(u => {
    mentions.push({
      tag: `@${u.fullName}`,
      id: u.userFbId
    });
    return `@${u.fullName}`;
  }).join(", ");

  // 👑 যে এডমিন এড করেছে
  let adminName = "Admin";
  try {
    const adminInfo = await api.getUserInfo(event.author);
    adminName = adminInfo[event.author]?.name || adminName;
  } catch (e) {}

  const message =
`🎉💜✨ 𝑊𝑒𝑙𝑐𝑜𝑚𝑒 𝑇ℎ𝑒 𝐹𝑎𝑚𝑖𝑙𝑦 ✨💜🎉

💌💜 হ্যালো সবাই 💜😊  
আমাদের নতুন মেসেঞ্জার গ্রুপে তোমাদের স্বাগতম! 🥰💫  
এখানেই হবে হাসি-খুশি 😄🎈, গল্পগুজব 💬🌀  
আর একে অপরের সঙ্গে ভাগাভাগি করার অসীম আনন্দ! 🌈💖

🎊 আসো বন্ধু হও 💞✿  
🎊 মজা করো 😜, গল্প শোনাও 🗣️✨  
🎊 একে অপরকে পরিবারের মত মনে রাখো 🤍💜

━━━━━━━━━━━━━━━━━━━

🌸🤲 𝐴𝑠𝑠𝑎𝑙𝑎𝑚𝑢 𝐴𝑙𝑎𝑖𝑘𝑢𝑚 🤲🌸

🏷️ ⏤͟͟͞͞𝐺𝑟𝑜𝑢𝑝 𝑁𝑎𝑚𝑒 ${groupName}

🤍✨ ⏤͟͟͞͞𝑁𝑒𝑤 ⏤͟͟͞͞𝑀𝑒𝑚𝑏𝑒𝑟
➤ ${memberNames} 🎉🥰

📜✨ 𝐺𝑟𝑜𝑢𝑝 𝑅𝑢𝑙𝑒 💜🎀
 ① সবর সাথে ভালো ব্যবহার করবেন 💜
 ② গ্রুপের নাম ও প্রোফাইল চেঞ্জ করা যাবে না 🚫 
 ③ ঝগড়া করা যাবে না 🚫
 ④ 🔞 ১৮+ কনটেন্ট নিষিদ্ধ  🚫 
 ⑤ 📵 ইনবক্সে নক দেওয়া যাবে না 🚫 
 ⑥ 💔 রিলেশন সমস্যা করলে দুজনকেই রিমুভ ⚠️ 
 ❼ ⏳ ৩ দিন এক্টিভ না থাকলে রিমুভ ⚠️ 
 ❽ 🧑‍💼 সমস্যা হলে এডমিনকে জানান ⚠️ 
 ❾ 🎉 নতুন মেম্বার এলে সবাই ওয়েলকাম জানাবেন ✅ 
①⓪ 🛑 অন্য গ্রুপের স্ক্রিনশট নিষিদ্ধ ❗

🙏 সবাই নিয়ম মেনে চলবেন আশা করি 🌸

👑 CEO: ${adminName} 💼✨  
~ভালোবাসা✨অবিরাম 🫶💞

⚠️ শেষ কথা:
💔 প্রেম / প্রিরিতি নিয়ে সমস্যা করলে  
⛔ বিনা নোটিশে রিমুভ করা হবে 🚫

𝑇ℎ𝑎𝑛𝑘 𝐹𝑜𝑟 𝑈𝑠𝑖𝑛𝑔 ⏤͟͟͞͞𝐽𝑖ℎ𝑎𝑑 ⏤͟͟͞͞𝐶ℎ𝑎𝑡 ⏤͟͟͞͞𝐵𝑜𝑡 `;

  return api.sendMessage(
    { body: message, mentions },
    event.threadID
  );
};
