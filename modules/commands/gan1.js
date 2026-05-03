const fs = require("fs");
const axios = require("axios");

let lastPlayed = -1;

module.exports.config = {
  name: "gan",
  version: "1.0.0",
  hasPermission: 0,
  credits: "🔰𝐑𝐀𝐇𝐀𝐓 𝐈𝐒𝐋𝐀𝐌🔰",
  description: "Play random song",
  commandCategory: "music",
  usages: "gan",
  cooldowns: 5
};

const songLinks = [
  "https://drive.google.com/uc?export=download&id=1X_J00k_go_u3MKqKwvZOcypQ-dL6DMAm",
  "https://drive.google.com/uc?export=download&id=1nLq8wKxcxK6nb-8SmJ1nPxNHx9Fzabr8",
  "https://drive.google.com/uc?export=download&id=1w972wKW72haSYHhcIZ_CIpRRv0UAf5TS",
  "https://drive.google.com/uc?export=download&id=1KLAtG03-O7GObVSo7YhkUd84tSTXQOL7",
  "https://drive.google.com/uc?export=download&id=1a3qcxjTi6W6wL4vItVY-SZ7aRpJISpLC",
  "https://drive.google.com/uc?export=download&id=1R2thfTrK3Xk842axn1mPrJ8AdPh8xpLf",
  "https://drive.google.com/uc?export=download&id=1nde8BkUjfD7F5fAM6WvAj6usHGjra4Ln",
  "https://drive.google.com/uc?export=download&id=1JVrIeRhhLUg-qOkRzvZCtI-CGrdfrHvq",
  "https://drive.google.com/uc?export=download&id=1uObNiYcCBbpTNZejRYavBKZGlclD2k3v",
  "https://drive.google.com/uc?export=download&id=1FN1kr3jma9i8opILdeMpH67lHjeJ3NIT",
  "https://drive.google.com/uc?export=download&id=1V2wYr_sGIBckvVrwGmpQXoZ_bj1jR6DY",
  "https://drive.google.com/uc?export=download&id=1FsQbt14Jw7gpvaabkBSgJDCefMLU8Pxq",
  "https://drive.google.com/uc?export=download&id=1ylJsOdaJ53GDITZ6_X-ET5PdnFAW93g1",
  "https://drive.google.com/uc?export=download&id=1Gj7ls2QwDmM-3nN7AXUxPPcGV8hdm59w"
];

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  api.setMessageReaction("⌛", messageID, () => {}, true);

  let index;
  do {
    index = Math.floor(Math.random() * songLinks.length);
  } while (index === lastPlayed && songLinks.length > 1);

  lastPlayed = index;
  const filePath = __dirname + `/cache/song_${index}.mp3`;

  try {
    const response = await axios({
      method: "GET",
      url: songLinks[index],
      responseType: "stream"
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage({
        body: "🎶 Here's your song:",
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, messageID);
    });

  } catch (err) {
    console.log(err);
    api.sendMessage("❌ Song load fail!", threadID, messageID);
  }
};
