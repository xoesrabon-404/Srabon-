module.exports.config = {
    name: "gali",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Srabon", 
    description: "কাউকে মেনশন দিয়ে ভয়েস গালি এবং ফানি মেসেজ দিবে",
    commandCategory: "গালি_বোট",
    usages: "@mentions",
    cooldowns: 5
};

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.run = async ({ api, event, args }) => {
    const { threadID, messageID, mentions } = event;

    if (Object.keys(mentions).length == 0) return api.sendMessage("😢 শোন কাইল্লা🤢 কাকে মেনশন দিবি সেটা তো বললি না! একজনকে মেনশন কর।", threadID, messageID);

    try {
        const mentionID = Object.keys(mentions)[0];
        const mentionName = mentions[mentionID].replace("@", "");
        
        // এখানে ভয়েস নোটের লিঙ্কগুলো দিন (আগের লিঙ্কগুলোই রাখা হয়েছে)
        const voiceLinks = [
            "https://files.catbox.moe/8u6l5.mp3" 
        ];

        const link = voiceLinks[Math.floor(Math.random() * voiceLinks.length)];
        const cachePath = path.join(__dirname, "cache", `gali_${threadID}.mp3`);

        const response = await axios.get(link, { responseType: "arraybuffer" });
        fs.writeFileSync(cachePath, Buffer.from(response.data, "utf-8"));

        return api.sendMessage({
            body: `${mentionName} শোন কাইল্লা🤢 শোন গালি টা মন দিয়ে শুনবি তোর লিগা হুদাই কষ্ট করে শ্রাবণ (Srabon) বোট গালি টা বানাইছে কাইল্লা🤢🙏`,
            attachment: fs.createReadStream(cachePath)
        }, threadID, () => fs.unlinkSync(cachePath), messageID);

    } catch (e) {
        console.log(e);
        return api.sendMessage("😢 গালি দিতে গিয়ে বট নিজেই লজ্জা পেয়ে গেছে! আবার চেষ্টা করো।", threadID, messageID);
    }
};
