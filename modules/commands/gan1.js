const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

let lastPlayed = -1;

module.exports.config = {
  name: "gan",
  version: "1.0.5",
  hasPermission: 0,
  credits: "Srabon",
  description: "Play random song using Axios Buffer",
  commandCategory: "music",
  usages: "gan",
  cooldowns: 5
};

const songLinks = [
  "https://drive.google.com/uc?export=download&id=1X_J00k_go_u3MKqKwvZOcypQ-dL6DMAm",
  "https://drive.google.com/uc?export=download&id=1nLq8wKxcxK6nb-8SmJ1nPxNHx9Fzabr8",
  "https://drive.google.com/uc?export=download&id=1w972wKW72haSYHhcIZ_CIpRRv0UAf5TS",
  "https://drive.google.com/uc?export=download&id=1KLAtG03-O7GObVSo7YhkUd84tSTXQOL7",
  "https://drive.google.com/uc?export=download&id=1a3qcxjTi6W6wL4vItVY-SZ7aRpJISpLC",
  "https://drive.google.com/uc?export=download&id=1R2thfTrK3Xk842axn1mPrJ8AdPh8xpLf",
  "https://drive.google.com/uc?export=download&id=1nde8BkUjfD7F5fAM6WvAj6usHGjra4Ln",
  "https://drive.google.com/uc?export=download&id=1JVrIeRhhLUg-qOkRzvZCtI-CGrdfrHvq",
  "https://drive.google.com/uc?export=download&id=1uObNiYcCBbpTNZejRYavBKZGlclD2k3v",
  "https://drive.google.com/uc?export=download&id=1FN1kr3jma9i8opILdeMpH67lHjeJ3NIT",
  "https://drive.google.com/uc?export=download&id=1V2wYr_sGIBckvVrwGmpQXoZ_bj1jR6DY",
  "https://drive.google.com/uc?export=download&id=1FsQbt14Jw7gpvaabkBSgJDCefMLU8Pxq",
  "https://drive.google.com/uc?export=download&id=1ylJsOdaJ53GDITZ6_X-ET5PdnFAW93g1",
  "https://drive.google.com/uc?export=download&id=1Gj7ls2QwDmM-3nN7AXUxPPcGV8hdm59w"
];

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  // র‍্যান্ডম গান সিলেকশন লজিক
  let index;
  do {
    index = Math.floor(Math.random() * songLinks.length);
  } while (index === lastPlayed && songLinks.length > 1);
  lastPlayed = index;

  const url = songLinks[index];
  const cacheDir = path.join(__dirname, "cache");
  const filePath = path.join(cacheDir, `gan_${Date.now()}.mp3`);

  try {
    // ১. বালুঘড়ি রিয়্যাকশন
    api.setMessageReaction("⌛", messageID, () => {}, true);

    // ২. ফোল্ডার না থাকলে তৈরি করা
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    // ৩. আপনার দেওয়া "আধুনিক নিয়ম" (Axios Buffer)
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    fs.writeFileSync(filePath, Buffer.from(res.data, 'binary'));

    // ৪. গান পাঠানো
    return api.sendMessage({
      body: "🎶 𝑆𝑅𝐴𝐵𝑂𝑁 𝐶𝐻𝐴𝑇 𝐵𝑂𝑇\n» গানটি আপনার জন্য লোড করা হয়েছে।",
      attachment: fs.createReadStream(filePath)
    }, threadID, () => {
      // ৫. পাঠানোর পর সাথে সাথে ডিলিট (যাতে মেমোরি ফুল না হয়)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }, messageID);

  } catch (err) {
    console.error("Download Error:", err.message);
    return api.sendMessage("❌ গানটি ডাউনলোড করতে ব্যর্থ হয়েছে। ড্রাইভ লিঙ্কটি চেক করুন।", threadID, messageID);
  }
};
