const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const Discord = require("discord.js");
const got = require("got");

function timeout(ms, promise) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error("timeout"));
    }, ms);
    promise.then(resolve, reject);
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("websitescreenshotter")
    .setDescription("Screenshot a website for you!")
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("Link to the site!")
        .setRequired(true)
    ),
  permissions: [],
  async execute({ client, args, interaction }) {
    let link = args.link;
    let err = 0;
    try {
      await timeout(3000, got(link));
    } catch {
      err = 1
    }
    if (err == 1) {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "Not a valid URL!",
          },
        ])
      await interaction
        .editReply({ content: " ", embeds: [embed], ephemeral: true })
        .then((message) => {
          setTimeout(function () {
            try {
              message.delete();
            } catch {}
          }, 5000);
        });
      return;
    }
    let buffer = await got
      .post("https://chrome.browserless.io/screenshot", {
        headers: { "User-Agent": "TotallyMozilla" },
        json: {
          url: args.link,
          options: {
            fullPage: true,
            type: "png",
          },
        },
      })
      .buffer();
    let screenshot = new AttachmentBuilder(buffer, { name: "SCREENSHOT.png" });
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .addFields([
        {
          name: "Link",
          value: args.link,
        },
      ])
      .setImage("attachment://SCREENSHOT.png");
    await interaction.editReply({
      content: " ",
      embeds: [embed],
      files: [screenshot],
    });
  },
};
