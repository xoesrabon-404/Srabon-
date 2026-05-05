const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "antiout",
    eventType: ["log:unsubscribe"],
    version: "1.2.0",
    credits: "Sʀᴀʙᴏɴ",
    description: "নিজে লিভ নিলে অটো অ্যাড, অ্যাডমিন রিমুভ করলে ইমোশনাল মেসেজ"
};

module.exports.run = async function({ event, api, Users, Threads }) {
    let { threadID, logMessageData, author } = event;
    const botID = api.getCurrentUserID();

    if (author == botID) return;

    let data = (await Threads.getData(threadID)).data || {};
    if (data.antiout === false) return;

    const leftID = logMessageData.leftParticipantFbId;
    const targetName = (await Users.getData(leftID)).name || "প্রিয়জন";

    // --- যদি অ্যাডমিন রিমুভ করে (কিক মারলে) ---
    if (author != leftID) {
        const kickMsg = `-আমার জান ${targetName} কে কেন রিমুভ করলে।😓\n- আমাকে এখন কে বলবে 😳🥹\nতুমি না খেলে আমি ও খাবো না 🐸🪼\n\nREMOVE ${targetName}😥`;
        return api.sendMessage(kickMsg, threadID);
    }

    // --- যদি নিজে লিভ নেয় (অটো অ্যাড লজিক) ---
    const userName = (await Users.getData(leftID)).name || "আবাল";
    
    api.addUserToGroup(leftID, threadID, async (err) => {
        if (err) {
            // যদি প্রাইভেসি বা অন্য কারণে অ্যাড না হয়
            const failMsg = `⚡️Boss Sʀᴀʙᴏɴ\nবলছে আবাল এড না করতে l\nকারন আমার বস হাগল খাইনা 🦶🏻🦶🏻\nএরজন্য তোকে আর এড্ড দিলাম না 🐸`;
            return api.sendMessage(failMsg, threadID);
        } else {
            // সাকসেসফুলি অ্যাড হলে ইমোজি সহ মেসেজ ও ভিডিও
            const successMsg = `${userName} —কত বড় আবাল 🐸\n⚡️Boss Sʀᴀʙᴏɴ এর পারমিশন না নিয়ে বের হয় 😂\n-Doggy style আবার অ্যাড দিলাম 🦶🏻`;
            
            const videoPath = path.join(__dirname, "cache", `anti_${leftID}.mp4`);
            try {
                const res = await axios.get("https://i.imgur.com/vH6Z7zE.mp4", { responseType: "arraybuffer" });
                fs.writeFileSync(videoPath, Buffer.from(res.data, "utf-8"));
                
                api.sendMessage({
                    body: successMsg,
                    attachment: fs.createReadStream(videoPath)
                }, threadID, () => {
                    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
                });
            } catch (e) {
                api.sendMessage(successMsg, threadID);
            }
        }
    });
};
