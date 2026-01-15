const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { alldown } = require("rx-dawonload");

module.exports.config = {
    name: "autodl",
    version: "2.2.1",
    credits: "Jihad",
    hasPermission: 0,
    description: "Public Auto Download (No Reaction Needed)",
    usePrefix: false,
    commandCategory: "utility",
    cooldowns: 2
};

module.exports.run = async function () {};

// -------------------------
// 🔥 Detect Link & Auto Download
// -------------------------
module.exports.handleEvent = async function ({ api, event }) {

    if (!event.body || !event.body.startsWith("http")) return;

    // Determine platform
    let site = "Unknown";
    if (event.body.includes("youtube")) site = "YouTube";
    else if (event.body.includes("tiktok")) site = "TikTok";
    else if (event.body.includes("instagram")) site = "Instagram";
    else if (event.body.includes("facebook")) site = "Facebook";

    // Send detect message
    const detectBox =
``;

    // প্রথম মেসেজ পাঠানো এবং ⬇️ রিয়েক্ট
    api.sendMessage(detectBox, event.threadID, async (err, info) => {
        if (!err) {
            await api.setMessageReaction("⬇️", info.messageID, event.senderID);
        }
    });

    try {
        // Get download info
        const data = await alldown(event.body);
        if (!data?.url) {
            return api.sendMessage("", event.threadID);
        }

        const title = data.title || "video";
        const buffer = (await axios.get(data.url, { responseType: "arraybuffer" })).data;
        const safeTitle = title.replace(/[^\w\s]/gi, "_");
        const filePath = path.join(__dirname, "cache", `${safeTitle}.mp4`);
        fs.writeFileSync(filePath, buffer);

        // Send downloaded file
        const doneBox =
`╔════════════════════╗
║ ⏤͟͟͞͞𝐷⃠𝑂𝑊𝑁𝐿𝑂𝐴𝐷 ⏤͟͟͞͞𝐶𝑂𝑀𝑃𝐿𝐸𝑇𝐸 
╠════════════════════╣
║ ⏤͟͟͞͞𝐽⃠𝐼𝐻𝐴𝐷⃤ ⏤͟͟͞͞𝐻⃠𝐴𝑆𝐴𝑁⃤
║
║ 📍 ⏤͟͟͞͞𝑃⃠𝐿𝐴𝑇𝐹𝑂𝑀 : ${site
║                 
║ 🎬 ⏤͟͟͞͞𝑇𝐼𝑇𝐿𝐸 : ${title}
╚════════════════════╝`;

        api.sendMessage(
            {
                body: doneBox,
                attachment: fs.createReadStream(filePath)
            },
            event.threadID,
            async (err, info) => {
                fs.unlinkSync(filePath);
                if (!err) {
                    await api.setMessageReaction("✅", info.messageID, event.senderID);
                }
            }
        );

    } catch (e) {
        console.log("AutoDL error:", e);
        api.sendMessage("❌ Download failed!", event.threadID);
    }
};
