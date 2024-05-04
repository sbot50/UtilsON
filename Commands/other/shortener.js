const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const got = require("got");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shortener")
    .setDescription("Shortens a link!")
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("Link to shorten!")
        .setRequired(true)
    ),
  integration_types: [0, 1],
  permissions: [],
  async execute({ args, interaction }) {
    let url = args.link;
    let res = await got("https://shrt.surge.sh/link/" + url).text();
    if (res == "ERROR: Not a valid link!") {
      let embed = new EmbedBuilder().setColor(0xa31600).addFields([
        {
          name: "**ERROR**",
          value: "Not a valid URL!",
        },
      ]);
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
    } else if (res.length > 1024) {
      let embed = new EmbedBuilder().setColor(0xa31600).addFields([
        {
          name: "**ERROR**",
          value:
            "The link shortener is currently down, please try again later.",
        },
      ]);
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
    } else {
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
            name: "**Shortened**",
            value: res,
          },
        ]);
      await interaction.editReply({ content: " ", embeds: [embed] });
    }
  },
};
