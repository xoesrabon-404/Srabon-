const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "vip",
    version: "1.0.1",
    hasPermssion: 3, // ADMINBOT only
    credits: "rX",
    description: "Manage VIP mode & VIP users",
    commandCategory: "Admin",
    usages: "[on|off|add|remove|list] <userID or reply>",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const vipFilePath = path.join(__dirname, "../../modules/commands/rx/vip.json");
    const vipModePath = path.join(__dirname, "../../modules/commands/rx/vipMode.json");

    // ===== Helpers =====
    const loadVIP = () => {
        if (!fs.existsSync(vipFilePath)) return [];
        return JSON.parse(fs.readFileSync(vipFilePath, "utf-8"));
    }

    const saveVIP = (list) => fs.writeFileSync(vipFilePath, JSON.stringify(list, null, 2), "utf-8");

    const loadVIPMode = () => {
        if (!fs.existsSync(vipModePath)) return false;
        const data = JSON.parse(fs.readFileSync(vipModePath, "utf-8"));
        return data.vipMode || false;
    }

    const saveVIPMode = (mode) => fs.writeFileSync(vipModePath, JSON.stringify({ vipMode: mode }, null, 2), "utf-8");

    const getUserName = async (uid) => {
        try {
            const user = await api.getUserInfo(uid);
            return user[uid].name || uid;
        } catch {
            return uid;
        }
    }
    // ===== End helpers =====

    const subCommand = args[0]?.toLowerCase();

    // Check for reply message if add/remove
    let targetID = args[1];
    if (!targetID && event.messageReply) targetID = event.messageReply.senderID;

    if (!subCommand) return api.sendMessage("Usage: vip [on|off|add|remove|list] <userID or reply>", event.threadID);

    let vipList = loadVIP();
    let vipMode = loadVIPMode();

    switch(subCommand) {
        case "on":
            saveVIPMode(true);
            return api.sendMessage("⏤͟͟͞͞𝑉𝐼𝑃⃟ 𝑀𝑂۝𝐷𝐸◡̈⃝︎ ⏤͟͟͞͞𝐸𝑁𝐴⃝𝐵𝐿𝐸𝐷♈︎ \n🎀 ⏤͟͟͞͞𝑂𝑁⃝𝐿𝑌◯ 𝑉𝐼⃝𝑃 𝑈𝑆⃝𝐸𝑅𝑆⃟ 𝐶□𝐴𝑁 𝑈⃝𝑆𝐸 ⏤͟͟͞͞𝐶𝑂𝑀𝑀⃝𝐴𝑁𝐷⃠𝑆 ⏤͟͟͞͞𝑁𝑂⃠𝑊", event.threadID);

        case "off":
            saveVIPMode(false);
            return api.sendMessage("⏤͟͟͞͞𝑉𝐼⃝𝑃 ⃟𝑀𝑂⃞𝐷𝐸 ☆⏤͟͟͞͞𝐷𝐼𝑆⃝𝐴𝐵𝐿𝐸⃟𝐷\n🎀 ⏤͟͟͞͞𝐴𝐿𝐿⃝ 𝑈𝑆⃝𝐸𝑅𝑆⃟ 𝐶□𝐴𝑁 𝑈⃝𝑆𝐸 ⏤͟͟͞͞𝐶𝑂𝑀𝑀⃝𝐴𝑁𝐷⃠𝑆 ⏤͟͟͞͞𝑁𝑂⃠𝑊", event.threadID);

        case "add":
            if (!targetID) return api.sendMessage("❌ Please provide a userID or reply to add.", event.threadID);
            if (vipList.includes(targetID)) return api.sendMessage("❌ User is already VIP.", event.threadID);
            vipList.push(targetID);
            saveVIP(vipList);
            {
                const name = await getUserName(targetID);
                return api.sendMessage(`「⏤͟͟͞͞𝑉𝐼𝑃 𝐴𝐷⃟𝑀𝐼𝑁⃝」 ⏤͟͟͞͞𝐴𝐷◯𝑀𝐼𝑁⃝  \n\n⏤͟͟͞͞𝐴𝐷𝑀𝐼⃝𝑁ᰔᩚ - ${name}\n⏤͟͟͞͞𝑈𝐼𝐷⃝ - ${targetID}`, event.threadID);
            }

        case "remove":
            if (!targetID) return api.sendMessage("❌ Provide a userID or reply to remove.", event.threadID);
            if (!vipList.includes(targetID)) return api.sendMessage("❌ User is not in VIP list.", event.threadID);
            vipList = vipList.filter(id => id !== targetID);
            saveVIP(vipList);
            {
                const name = await getUserName(targetID);
                return api.sendMessage(`「⏤͟͟͞͞𝑉𝐼𝑃 𝐴𝐷⃟𝑀𝐼𝑁⃝」 ☆𝑅𝐸𝑀⃟𝑂𝑉𝐸𝐷 ⃝⃝ \n\n⏤͟͟͞͞𝐴𝐷𝑀𝐼⃝𝑁ᰔᩚ - ${name}\n⏤͟͟͞͞𝑈𝐼𝐷⃝ - ${targetID}`, event.threadID);
            }

        case "list":
            if (vipList.length === 0) return api.sendMessage("📋 VIP list is empty.", event.threadID);
            {
                const names = await Promise.all(vipList.map(uid => getUserName(uid)));
                const formattedList = vipList.map((uid, i) => `\n${i + 1}. ${names[i]} - ${uid}`).join("");
                return api.sendMessage(`📋 𝐕𝐈𝐏 𝐔𝐬𝐞𝐫𝐬:${formattedList}`, event.threadID);
            }

        default:
            return api.sendMessage("Unknown subcommand. Usage: vip [on|off|add|remove|list] <userID or reply>", event.threadID);
    }
};
