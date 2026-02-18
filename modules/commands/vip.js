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
            return api.sendMessage("⏤͟͟͞͞𝑉𝑖𝑝 𝑀𝑜𝑑𝑒 𝐸𝑛𝑎𝑏𝑙𝑒 \n\n𝑂𝑛𝑙𝑦 𝑣𝑖𝑝 𝑢𝑠𝑒𝑟 𝑐𝑎𝑛 \n\n𝑈𝑠𝑒 𝐶𝑜𝑚𝑚𝑎𝑛𝑑 𝑛𝑜𝑤", event.threadID);

        case "off":
            saveVIPMode(false);
            return api.sendMessage("⏤͟͟͞͞𝑉𝑖𝑝 𝑑𝑖𝑠𝑎𝑏𝑙𝑒 \n\n𝐴𝑙𝑙 𝑢𝑠𝑒𝑟𝑠 𝑐𝑎𝑛\n\n𝑈𝑠𝑒 𝐶𝑜𝑚𝑚𝑒𝑛𝑑 𝑛𝑜𝑤", event.threadID);

        case "add":
            if (!targetID) return api.sendMessage("⏤͟͟͞͞❌ Please provide a userID or reply to add.", event.threadID);
            if (vipList.includes(targetID)) return api.sendMessage("⏤͟͟͞͞❌ User is already VIP.", event.threadID);
            vipList.push(targetID);
            saveVIP(vipList);
            {
                const name = await getUserName(targetID);
                return api.sendMessage(`⏤͟͟͞͞𝑉𝑖𝑝 𝑎𝑑𝑚𝑖𝑛 𝑎𝑑𝑑\n\n⏤͟͟͞͞𝐴𝐷𝑀𝐼𝑁ᰔᩚ - ${name}\n\n⏤͟͟͞͞𝑈𝑖𝑑 - ${targetID}`, event.threadID);
            }

        case "remove":
            if (!targetID) return api.sendMessage("❌ ⏤͟͟͞͞Provide a userID or reply to remove.", event.threadID);
            if (!vipList.includes(targetID)) return api.sendMessage("❌ ⏤͟͟͞͞User is not in VIP list.", event.threadID);
            vipList = vipList.filter(id => id !== targetID);
            saveVIP(vipList);
            {
                const name = await getUserName(targetID);
                return api.sendMessage(`⏤͟͟͞͞𝑉𝑖𝑝 𝑎𝑑𝑚𝑖𝑛 ⏤͟͟͟͟͞͞͞͞𝑅𝑒𝑚𝑜𝑣𝑒𝑑 ⃝⃝ \n\n⏤͟͟͞͞𝐴𝐷𝑀𝐼𝑁ᰔᩚ - ${name}\n\n⏤͟͟͞͞𝑈𝑖𝑑 - ${targetID}`, event.threadID);
            }

        case "list":
            if (vipList.length === 0) return api.sendMessage("📋 ⏤͟͟͞͞𝑉𝐼𝑃 𝐿𝐼𝑆𝑇 𝐼𝑆 𝐸𝑀𝑃𝐿𝐸𝑇", event.threadID);
            {
                const names = await Promise.all(vipList.map(uid => getUserName(uid)));
                const formattedList = vipList.map((uid, i) => `\n${i + 1}. ${names[i]} - ${uid}`).join("");
                return api.sendMessage( `⏤͟͟͞͞𝑉𝐼⃠𝑃 𝑈𝐸𝑅𝑆:${formattedList}`, event.threadID);
            }

        default:
            return api.sendMessage("Unknown subcommand. Usage: vip [on|off|add|remove|list] <userID or reply>", event.threadID);
    }
};
