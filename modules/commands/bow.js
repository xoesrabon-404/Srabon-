module.exports = {
  config: {
    name: "bowProtect",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Srabon",
    description: "কেউ বউকে মেনশন দিলে বট রিপ্লাই দেবে।",
    commandCategory: "Noprefix",
    usages: "",
    cooldowns: 2
  },

  handleEvent: async function ({ api, event }) {
    const { threadID, messageID, mentions } = event;

    // এখানে আপনার বউয়ের ফেসবুক Account ID (UID) বসান
    const TARGET_ID = "61589441946900"; 

    if (mentions && Object.keys(mentions).length > 0) {
      if (Object.prototype.hasOwnProperty.call(mentions, TARGET_ID)) {
        const replyMessage = "এটা আমার বস শ্রাবনের hart ❤️‍🩹🔪।।\nভেবেচিন্তে মেনশন দিবেন।।।";
        
        return api.sendMessage({ body: replyMessage }, threadID, messageID);
      }
    }
  },

  run: async function ({}) {
    // এটা নো-প্রিফিক্স ইভেন্ট হিসেবে কাজ করবে, আলাদা করে রান করার প্রয়োজন নেই।
  }
};
