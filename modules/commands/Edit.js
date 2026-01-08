const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// JSON with Renz API URLs
const noobcore = "https://raw.githubusercontent.com/noobcore404/NC-STORE/main/NCApiUrl.json";

// Fetch Renz API base URL
async function getRenzApi() {
  const res = await axios.get(noobcore, { timeout: 10000 });
  if (!res.data?.renz) throw new Error("Renz API not found in JSON");
  return res.data.renz;
}

module.exports = {
  config: {
    name: "edit",
    aliases: ["editimage", "imgedit"],
    version: "1.0.1",
    credits: "Jihad",
    premium: true,
    countDown: 5,
    hasPermssion: 0,
    shortDescription: "Generate or edit images using Bangla or English prompt",
    longDescription:
      "Generate a new image or edit an existing one using Bangla or English text. Reply to an image to edit it.",
    commandCategory: "image",
    usages:
      ".edit <prompt>\n\nExamples:\n.edit একটা সুন্দর মেয়ে দাও\n.edit a beautiful anime girl\n.edit make this anime (reply to image)"
  },

  run: async function ({ api, event, args }) {
    const { threadID, messageReply } = event;

    const repliedImage = messageReply?.attachments?.[0];
    const prompt = args.join(" ").trim();

    if (!prompt) {
      return api.sendMessage(
        "❌ Please provide a prompt.\n\nExample:\n.edit a beautiful anime girl",
        threadID
      );
    }

    // 🌟 Stylish processing box (English)
    const processingMsg = await api.sendMessage(
`╭─────────────────╮
│ ⏳ PROCESSING │
├─────────────────┤
│ 🎨 Editing image....
│ ✨ Please wait......
╰─────────────────╯`,
      threadID
    );

    const imgPath = path.join(__dirname, "cache", `${Date.now()}_edit.png`);

    try {
      const BASE_URL = await getRenzApi();

      let apiURL = `${BASE_URL}/api/gptimage?prompt=${encodeURIComponent(prompt)}`;

      if (repliedImage && repliedImage.type === "photo") {
        apiURL += `&ref=${encodeURIComponent(repliedImage.url)}`;

        if (repliedImage.width && repliedImage.height) {
          apiURL += `&width=${repliedImage.width}&height=${repliedImage.height}`;
        }
      } else {
        apiURL += `&width=512&height=512`;
      }

      const res = await axios.get(apiURL, {
        responseType: "arraybuffer",
        timeout: 180000
      });

      await fs.ensureDir(path.dirname(imgPath));
      await fs.writeFile(imgPath, Buffer.from(res.data));

      await api.unsendMessage(processingMsg.messageID);

      // 🌟 Result message
      await api.sendMessage(
        {
          body: repliedImage
            ? `╭────────────────╮
│ 🖌 EDIT DONE │
├────────────────┤
│ ✅ Image edited successfully
│ 📝 Prompt: ${prompt}
╰────────────────╯`
            : `╭────────────────╮
│ 🖼 GENERATED │
├────────────────┤
│ ✅ Image generated successfully
│ 📝 Prompt: ${prompt}
╰────────────────╯`,
          attachment: fs.createReadStream(imgPath)
        },
        threadID
      );
    } catch (error) {
      console.error("EDIT ERROR:", error?.response?.data || error.message);
      await api.unsendMessage(processingMsg.messageID);
      api.sendMessage(
`╭────────────────╮
│ ❌ ERROR │
├────────────────┤
│ Something went wrong
│ Please try again later
╰────────────────╯`,
        threadID
      );
    } finally {
      if (fs.existsSync(imgPath)) await fs.remove(imgPath);
    }
  }
};
