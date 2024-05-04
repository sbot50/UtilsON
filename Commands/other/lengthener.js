const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const urlLengthener = require("url-lengthener");
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
    .setName("lengthener")
    .setDescription("Lengthens a link!")
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("Link to lengthen!")
        .setRequired(true)
    ),
  integration_types: [0, 1],
  permissions: [],
  async execute({ args, interaction }) {
    let url = args.link;
    let err = 0;
    let res = await timeout(3000, got(url)).catch(() => (err = 1));
    if (
      err != 1 &&
      !res.url.includes(
        "aaa.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.com"
      )
    ) {
      let lengthened_url = await urlLengthener.lengthen(url);
      let embed = new EmbedBuilder()
        .setColor(0x1cd0ce)
        .addFields([
          {
            name: "**Input**",
            value: args.link,
          },
        ])
        .addFields([
          {
            name: "**Lengthened**",
            value: lengthened_url,
          },
        ])
        .setFooter({ text: "Used NPM: 'url-lengthener'" });
      await interaction.editReply({ content: " ", embeds: [embed] });
    } else {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "Not a valid URL!",
          },
        ])
        .setFooter({ text: "Used NPM: 'url-lengthener'" });
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
  },
};
