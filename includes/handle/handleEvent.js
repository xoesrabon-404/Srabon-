module.exports = function ({ api, models, Users, Threads, Currencies }) {
    const logger = require("../../utils/log.js");
    const moment = require("moment-timezone");

    return function ({ event }) {
        const timeStart = Date.now();
        const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss L");

        const { userBanned, threadBanned } = global.data;
        const { events } = global.client;
        const { allowInbox, DeveloperMode } = global.config;

        let { senderID, threadID } = event;
        senderID = String(senderID);
        threadID = String(threadID);

        // ❌ Ban check
        if (
            userBanned.has(senderID) ||
            threadBanned.has(threadID) ||
            (allowInbox === false && senderID === threadID)
        ) return;

        // ⚠️ IMPORTANT: এখানে body / mentions modify করা যাবে না

        for (const [key, value] of events.entries()) {
            if (value.config.eventType.includes(event.logMessageType)) {
                const eventRun = events.get(key);
                try {
                    eventRun.run({
                        api,
                        event,
                        models,
                        Users,
                        Threads,
                        Currencies
                    });

                    if (DeveloperMode === true) {
                        logger(
                            global.getText(
                                "handleEvent",
                                "executeEvent",
                                time,
                                eventRun.config.name,
                                threadID,
                                Date.now() - timeStart
                            ),
                            "[ EVENT ]"
                        );
                    }
                } catch (err) {
                    logger(
                        global.getText(
                            "handleEvent",
                            "eventError",
                            eventRun.config.name,
                            JSON.stringify(err)
                        ),
                        "error"
                    );
                }
            }
        }
    };
};
