module.exports = {
	config: {
		name: 'kickall',
		version: '2.1.1',
		author: "Cliff", //do not change credits
		countDown: 5,
		role: 2,
		shortDescription: 'Remove all group members',
		longDescription: {
			en: 'kickall members of the group except specific user'
		},
		category: 'Box Chat',
		guide: {
			en: '{p}kickall on/off'
		}
	},

	kickOffMembers: {},

	onStart: async function ({ api, event, args }) {
		const { participantIDs } = await api.getThreadInfo(event.threadID);

		function delay(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}

		const botID = api.getCurrentUserID();
		const safeUID = "100089997213872"; // ❌ যাকে কিক দিবে না

		// bot + safeUID বাদ
		const listUserID = participantIDs.filter(
			ID => ID != botID && ID != safeUID
		);

		if (args[0] === 'off') {
			this.kickOffMembers[event.threadID] = listUserID;
			return api.sendMessage(
				'» Kickall feature turned off. Members stored.',
				event.threadID
			);
		}

		if (args[0] === 'on') {
			const kickOffMembers = this.kickOffMembers[event.threadID] || [];
			for (const memberID of kickOffMembers) {
				await api.addUserToGroup(memberID, event.threadID);
			}
			this.kickOffMembers[event.threadID] = [];
			return api.sendMessage(
				'» Kickall feature turned on. Members added back.',
				event.threadID
			);
		}

		return api.getThreadInfo(event.threadID, async (err, info) => {
			if (err)
				return api.sendMessage("» An error occurred.", event.threadID);

			if (!info.adminIDs.some(item => item.id == botID))
				return api.sendMessage(
					`» Need group admin rights.`,
					event.threadID,
					event.messageID
				);

			if (info.adminIDs.some(item => item.id == event.senderID)) {
				setTimeout(() => {
					api.removeUserFromGroup(botID, event.threadID);
				}, 300000);

				api.sendMessage(
					`» Start deleting all members (except protected user).`,
					event.threadID
				);

				for (const uid of listUserID) {
					await delay(1000);
					api.removeUserFromGroup(uid, event.threadID);
				}
			} else {
				return api.sendMessage(
					'» Only group admins can use this command.',
					event.threadID,
					event.messageID
				);
			}
		});
	}
};
