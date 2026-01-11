module.exports.config = {
  name: "joinRulesEvent",
  eventType: ["log:subscribe"],
  version: "1.0.0",
  credits: "Jihad",
  description: "Welcome rules event only for one specific group"
};

module.exports.run = async ({ event, api }) => {
  const TARGET_THREAD_ID = "1177871651160383";

  // অন্য গ্রুপ হলে কিছুই করবে না
  if (event.threadID !== TARGET_THREAD_ID) return;

  // গ্রুপের নাম
  let groupName = "এই গ্রুপ";
  try {
    const threadInfo = await api.getThreadInfo(event.threadID);
    groupName = threadInfo.threadName || groupName;
  } catch (e) {}

  // নতুন মেম্বারদের নাম
  const added = event.logMessageData?.addedParticipants || [];
  if (added.length === 0) return;

  const memberNames = added.map(u => u.fullName).join(", ");

  const message =
`��Assalamu Alaikum��

🌸 গ্রুপের নাম: ${groupName}

🤍 নতুন মেম্বার:
➤ ${memberNames}

আমাদের friend adda group a সবাই কে স্বাগতম~~😊✨

»গ্রুপের কিছু নিয়ম কানুন আছে যেটা মানা আমাদের অতি জরুরী?? 

(1) এই নিয়ম মানা সবার জন্য বাধ্যতামূলক  
(2) গ্রুপের name & profile কেউ চেঞ্জ করতে পারবে না  
(3) সবাই মিলেমিশে থাকবো, ঝগড়া করবো না  
(4) ১৮+ ছবি বা ভিডিও দেওয়া যাবে না  
(5) কাউকে ইনবক্সে বিরক্ত করা যাবে না  
(6) রিলেশন জনিত সমস্যা করলে ২ জনকেই রিমুভ  
(7) ৩ দিনের বেশি এক্টিভ না থাকলে রিমুভ  
(8) সমস্যা হলে এডমিনকে জানাবেন  
(9) নতুন মেম্বার এলে সবাই ওয়েলকাম জানাবেন  
(10) ঝামেলা হলে নিজ দায়িত্বে এডমিনকে জানাবেন  
(11) জন্মদিনে সবাই উইশ করবেন  
(12) ইনবক্সে বিরক্ত করলে Admin কে জানাবেন  
(13) অন্য গ্রুপের স্ক্রিনশট / ভিডিও দেওয়া যাবে না  
(14) ২ বারের বেশি লিভ নিলে পুনরায় এড হবে না  
(15) বাজে কথা বললে রিমুভ  
(16) ভিডিও সময় উপস্থিত থাকতে হবে  
(17) গ্রুপে গেমের কথা বলা যাবে না  
(18) Text off❌ হলে কেউ মেসেজ দিবেন না  
(19) ৩ বারের বেশি লিভ নিলে এড করা যাবে না  

সবাই নিয়ম মেনে চলবেন আশা করি 🌸

👑 CEO: Mir Ronok  
~ভালোবাসা✨অবিরাম 🫶  
~ধন্যবাদ~

শেষ কথা: প্রেম প্রিরিতি নিয়ে সমস্যা করলে বিনা নোটিশে রিমুভ করা হবে।`;

  return api.sendMessage(message, event.threadID);
};
