const fs = require("fs-extra");
const request = require("request");
const axios = require("axios");

module.exports.config = {
    name: "ckuser",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Jihad (modified)",
    description: "Check user information",
    commandCategory: "Media",
    usages: "[reply | @tag | uid | profile link]",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    let id;

    // ✅ যদি শুধু কমান্ড ব্যবহার করে
    if (!args[0]) {
        if (event.type == "message_reply") id = event.messageReply.senderID;
        else id = event.senderID;
    } 
    // ✅ যদি mention করে
    else if (Object.keys(event.mentions).length > 0) {
        id = Object.keys(event.mentions)[0];
    } 
    // ✅ যদি লিংক দেওয়া হয়
    else if (args[0].includes("facebook.com") || args[0].includes("fb.com")) {
        const url = args[0].trim();
        try {
            id = await extractUIDFromURL(url, api);
            if (!id) throw new Error("UID not found");
        } catch (err) {
            return api.sendMessage("⚠️ প্রোফাইল লিংক থেকে UID বের করা যায়নি!", event.threadID, event.messageID);
        }
    }
    // ✅ যদি সরাসরি UID দেওয়া হয়
    else {
        id = args[0];
    }

    try {
        let data = await api.getUserInfo(id);
        let user = data[id];

        let url = user.profileUrl || `https://facebook.com/${id}`;
        let isFriend = user.isFriend ? "Yes ✅" : "No ❌";
        let sn = user.vanity || "N/A";
        let name = user.name || "Unknown";
        let sex = user.gender;
        let gender = sex == 2 ? "Male" : sex == 1 ? "Female" : "Unknown";

        let callback = () => api.sendMessage(
            {
                body: `👤 Name: ${name}\n🔗 Profile: ${url}\n🆔 UID: ${id}\n📛 Username: ${sn}\n🚻 Gender: ${gender}\n🤝 Friend with bot: ${isFriend}`,
                attachment: fs.createReadStream(__dirname + "/cache/ckuser.png")
            },
            event.threadID,
            () => fs.unlinkSync(__dirname + "/cache/ckuser.png"),
            event.messageID
        );

        return request(
            encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)
        ).pipe(fs.createWriteStream(__dirname + "/cache/ckuser.png")).on("close", () => callback());

    } catch (e) {
        console.log(e);
        return api.sendMessage("⚠️ User info আনতে সমস্যা হচ্ছে!", event.threadID, event.messageID);
    }
};

// Helper function to extract UID from Facebook URL
async function extractUIDFromURL(url, api) {
    try {
        // Case 1: profile.php?id=123456
        const idMatch = url.match(/id=(\d+)/);
        if (idMatch) return idMatch[1];

        // Case 2: facebook.com/username
        const username = url.split('/').pop().split('?')[0];
        if (!username || username.includes('profile.php')) return null;

        // Use Facebook Graph API to get UID from vanity username
        const response = await axios.get(`https://graph.facebook.com/${username}?access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`);
        return response.data.id;
    } catch (err) {
        console.log("UID extract error:", err.message);
        return null;
    }
}
