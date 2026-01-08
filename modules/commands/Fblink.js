// commands/fb-uid.js
// Usage:
// .fb-uid https://facebook.com/zuck
// .fb-uid (reply to a message that contains the profile link)

module.exports.config = {
  name: "fb-uid",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "JIHAD",
  description: "দেওয়া Facebook link থেকে UID বের করে দেয়",
  usages: "<facebook_link> or reply to a message with the link",
  cooldowns: 5
};

const { getFacebookUid } = require('../utils/fb-uid'); // তোমার ফাইলের রিলেটিভ path ঠিক করো

// ছোট সাহায্যকারী: টেক্সট থেকে প্রথম facebook লিংক এক্সট্র্যাক্ট করে নেয়
function extractLinkFromText(text) {
  if (!text) return null;
  // সাধারণ facebook url ধরার regex
  const regex = /(https?:\/\/)?(www\.)?(m\.)?(facebook|fb)\.com\/[^\s'"<>)]+/i;
  const m = text.match(regex);
  return m ? (m[0].startsWith('http') ? m[0] : 'https://' + m[0]) : null;
}

module.exports.run = async ({ api, event, args }) => {
  try {
    // 1) args থেকে লিংক নাও
    let input = args.join(' ').trim();

    // 2) যদি args না থাকে এবং ব্যবহারকারী কোন মেসেজে reply করে, সেখানে link আছে কিনা চেক করো
    if (!input && event.messageReply && event.messageReply.body) {
      input = event.messageReply.body.trim();
    }

    // 3) টেক্সট থেকে ফেসবুক লিংক বার করো (যদি পুরোটা লিংক না দিয়েও থাকে)
    const link = extractLinkFromText(input) || input;

    if (!link) {
      return api.sendMessage(
        'লিংক দেন না — `.fb-uid https://facebook.com/username` বা কোনো মেসেজ-এ reply করুন যেটাতে লিংক আছে।',
        event.threadID
      );
    }

    // feedback (loading) — ops: কিছু বট frameworks এ typing message পাঠাতে পারেন, কিন্তু সাধারণত সরাসরি reply দিব
    const sending = await api.sendMessage('UID খোঁজা হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন।', event.threadID);

    // মূল ফাংশন কল
    const uid = await getFacebookUid(link);

    // unsend loading message (যদি প্ল্যাটফর্ম সমর্থন করে)
    try {
      if (sending && sending.messageID && api.unsendMessage) {
        api.unsendMessage(sending.messageID);
      }
    } catch (e) {
      // ignore
    }

    if (uid) {
      return api.sendMessage(`🎯 UID পাওয়া গেছে:\n${uid}\n\nLink: ${link}`, event.threadID);
    } else {
      return api.sendMessage(
        'দুঃখিত — UID পাওয়া যায়নি। সম্ভবত লিংক টা প্রোফাইলের ইউজারনেম (username) আছে এবং পেজ ব্লক/প্রাইভেট, অথবা Facebook সার্ভার স্ক্র্যাপিং ব্লক করেছে।',
        event.threadID
      );
    }
  } catch (err) {
    return api.sendMessage('এরর: ' + (err.message || err), event.threadID);
  }
};
