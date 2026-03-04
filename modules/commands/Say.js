module.exports.config = {
  name: "say",
  version: "2.4.2",
  hasPermssion: 0,
  credits: "ARIF BABU",
  description: "Convert text to speech using Google",
  commandCategory: "media",
  usages: "[text | reply]",
  cooldowns: 5,
  usePrefix: false, // No prefix required
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

/* 🔹 NO PREFIX EVENT HANDLER */
module.exports.handleEvent = async ({ api, event }) => {
  if (!event.body) return;

  // Check if message starts with "say" (case-insensitive)
  const body = event.body.trim();
  if (!body.toLowerCase().startsWith("say")) return;

  // Extract args after "say"
  const args = body.split(/\s+/).slice(1);

  // Trigger the main run function
  module.exports.run({ api, event, args });
};

/* 🎙️ MAIN RUN LOGIC */
module.exports.run = async function ({ api, event, args }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];

  try {
    // 📝 Get content from reply or args
    let content = event.type === "message_reply"
      ? event.messageReply.body
      : args.join(" ");

    if (!content) {
      return api.sendMessage(
        "❌ Text likho ya kisi message ko reply karo.",
        event.threadID,
        event.messageID
      );
    }

    // 🌍 Supported languages
    const langList = ["en", "hi", "ru", "ja", "ko", "tl", "pr"];
    let lang = "en";

    if (args[0] && langList.includes(args[0])) {
      lang = args[0];
      content = args.slice(1).join(" ");
    }

    if (!content) {
      return api.sendMessage(
        "❌ Language ke baad text missing hai.",
        event.threadID,
        event.messageID
      );
    }

    // 📂 File path
    const filePath = path.join(
      __dirname,
      "cache",
      `say_${event.senderID}.mp3`
    );

    // 🔊 Google TTS URL
    const ttsURL =
      `https://translate.google.com/translate_tts?ie=UTF-8` +
      `&q=${encodeURIComponent(content)}` +
      `&tl=${lang}&client=tw-ob`;

    // 🔽 Download TTS
    await global.utils.downloadFile(ttsURL, filePath);

    // 📤 Send audio
    api.sendMessage(
      { attachment: fs.createReadStream(filePath) },
      event.threadID,
      () => fs.unlinkSync(filePath),
      event.messageID
    );

  } catch (err) {
    console.error(err);
    api.sendMessage(
      "❌ TTS generate nahi ho paaya.",
      event.threadID,
      event.messageID
    );
  }
};
       
