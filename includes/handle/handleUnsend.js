module.exports = function ({ api, models, Users, Threads, Currencies }) {
    return function ({ event }) {
        const { handleReaction, commands } = global.client;
        const { messageID, threadID, reaction, userID } = event; 

        // 🔒 শুধু ADMINBOT ব্যবহার করতে পারবে
        if (!global.config.ADMINBOT.includes(userID)) {
            return; // non-admin হলে কিছুই হবে না
        }

        // ®️ নির্দিষ্ট reaction দিলে মেসেজ unsend
        const unsendReactions = ['😾', '😡', '🥵'];
        if (unsendReactions.includes(reaction)) {
            return api.unsendMessage(messageID);
        }

        // অন্য reaction system
        if (handleReaction.length !== 0) {
            const indexOfHandle = handleReaction.findIndex(e => e.messageID == messageID);
            if (indexOfHandle < 0) return;

            const indexOfMessage = handleReaction[indexOfHandle];
            const handleNeedExec = commands.get(indexOfMessage.name);

            if (!handleNeedExec) 
                return api.sendMessage(global.getText('handleReaction', 'missingValue'), threadID, messageID);

            try {
                // language system
                var getText2;
                if (handleNeedExec.languages && typeof handleNeedExec.languages == 'object') {
                    getText2 = (...value) => {
                        const react = handleNeedExec.languages || {};
                        if (!react.hasOwnProperty(global.config.language))
                            return api.sendMessage(global.getText('handleCommand', 'notFoundLanguage', handleNeedExec.config.name), threadID, messageID);
                        var lang = handleNeedExec.languages[global.config.language][value[0]] || '';
                        for (var i = value.length; i > 0; i--) {
                            const expReg = RegExp('%' + i, 'g');
                            lang = lang.replace(expReg, value[i]);
                        }
                        return lang;
                    };
                } else getText2 = () => {};

                const Obj = {
                    api,
                    event,
                    models,
                    Users,
                    Threads,
                    Currencies,
                    handleReaction: indexOfMessage,
                    getText: getText2
                };

                handleNeedExec.handleReaction(Obj);
                return;

            } catch (error) {
                return api.sendMessage(global.getText('handleReaction', 'executeError', error), threadID, messageID);
            }
        }
    };
};
