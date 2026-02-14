module.exports.config = {
  name: "rules",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Jihad",
  description: "Show Group Rules",
  commandCategory: "group",
  usages: ".rules",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const rulesText = `
📜✨ 𝐺𝑟𝑜𝑢𝑝 𝑅𝑢𝑙𝑒 💜🎀

[ ⑅𝄞💌≛⃝𝄟༺𝗟𝗢𝗩𝗘_𝗦𝗧𝗢𝗥𝗬༻≛⃝𝄟꧂𝗔𝗗𝗗𝗔༻ 𝗕𝗢𝗫_ ]

① সবর সাথে ভালো ব্যবহার করবেন 💜
② গ্রুপের নাম ও প্রোফাইল চেঞ্জ করা যাবে না 🚫
③ গ্রুপের কোনো মেম্বার কে ফ্রেন্ড রিকোয়েস্ট বা ইনবক্সে নক দিলে সোজা কিক 🚫
④ 🔞 ১৮+ কনটেন্ট নিষিদ্ধ 🚫
⑤ 📵 ইনবক্সে নক দেওয়া যাবে না 🚫
⑥ 💔 রিলেশন সমস্যা করলে দুজনকেই রিমুভ ⚠️
⑦ ⏳ ৩ দিন এক্টিভ না থাকলে রিমুভ ⚠️
⑧ 🧑‍💼 সমস্যা হলে এডমিনকে জানান ⚠️
⑨ 🎉 নতুন মেম্বার এলে সবাই ওয়েলকাম জানাবেন ✅
⑩ 🛑 Text off বলার পর কোনো টেক্সট দিলে কিক ❗

🙏 সবাই নিয়ম মেনে চলবেন আশা করি 🌸

👑 CEO: JIHAD 🥱💼
Love Forever 🫶💞

⚠️ শেষ কথা:
💔 প্রেম / প্রিরিতি নিয়ে সমস্যা করলে
⛔ বিনা নোটিশে রিমুভ করা হবে 🚫
`;

  return api.sendMessage(rulesText, event.threadID, event.messageID);
};
