module.exports.config = {
	name: "unsend",
	version: "1.2.0",
	hasPermssion: 2,
	credits: "rX",
	description: "react 😡 to unsent",
	commandCategory: "system",
	usages: "unsend",
	cooldowns: 0
};

module.exports.languages = {
	"vi": {
		"returnCant": "Không thể gỡ tin nhắn của người khác.",
		"missingReply": "Hãy reply tin nhắn cần gỡ."
	},
	"en": {
		"returnCant": "",
		"missingReply": "Mere Jis Msg ko Unsend Karna Hai Usme Reply Karke Likkho."
	}
}

// 1️⃣ Command-based unsend
module.exports.run = function({ api, event, getText }) {
	if (event.type != "message_reply") return api.sendMessage(getText("missingReply"), event.threadID, event.messageID);
	if (event.messageReply.senderID != api.getCurrentUserID()) return api.sendMessage(getText("returnCant"), event.threadID, event.messageID);
	return api.unsendMessage(event.messageReply.messageID);
}

// 2️⃣ Emoji-only trigger unsend
module.exports.handleEvent = async function({ api, event }) {
	const botID = api.getCurrentUserID();
	if (event.senderID != botID) return;

	// Allowed emojis
	const allowedEmojis = ["🔪", "🐣", "🤬", "😡"];

	// Body exists and exactly one of allowed emojis
	if (event.body && allowedEmojis.includes(event.body.trim())) {
		try {
			await api.unsendMessage(event.messageID);
		} catch(e) {
			console.log("Cannot unsend message:", e);
		}
	}
}
