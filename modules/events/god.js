module.exports.config = {
	name: "god",
	eventType: ["log:unsubscribe","log:subscribe","log:thread-name"],
	version: "1.1.0",
	credits: "rX",
	description: "Stylish bot activity notifications",
	envConfig: {
		enable: true
	}
};

module.exports.run = async function ({ api, event, Threads }) {
	const logger = require("../../utils/log");
	if (!global.configModule[this.config.name].enable) return;

	let task = "";
	const time = new Date().toLocaleString("en-US", {
		timeZone: "Asia/Dhaka",
		hour12: true
	});

	switch (event.logMessageType) {

		case "log:thread-name": {
			const oldName = (await Threads.getData(event.threadID)).name || "Unknown";
			const newName = event.logMessageData.name || "Unknown";
			task = `📝 Group name changed\n• From: ${oldName}\n• To: ${newName}`;
			await Threads.setData(event.threadID, { name: newName });
			break;
		}

		case "log:subscribe": {
			if (event.logMessageData.addedParticipants
				.some(i => i.userFbId == api.getCurrentUserID())) {
				task = "➕ Bot was added to a new group";
			}
			break;
		}

		case "log:unsubscribe": {
			if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) {
				task = "➖ Bot was removed from a group";
			}
			break;
		}
	}

	if (!task) return;

	const frameMessage =
`╔══════════════════════╗
   🤖 JÌHÁD BOT ACTIVITY
╚══════════════════════╝

📌 Thread ID:
${event.threadID}

⚡ Action:
${task}

👤 Action By:
${event.author || "System"}

🕒 Time:
${time}

══════════════════════
`;

	const GOD_ID = "1358288085838964";

	return api.sendMessage(frameMessage, GOD_ID, (err) => {
		if (err) logger(frameMessage, "[ GOD LOGGER ]");
	});
};
