const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const dogeify = require("dogeify-js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dogeify")
    .setDescription("Dogeifies text!")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("What text needs dogeifying?")
        .setRequired(true)
    ),
  permissions: [],
  async execute({ args, interaction }) {
    if (args.text.length > 512) {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "Maximum text length of 512 characters!",
          },
        ])
        .setFooter({ text: "Used NPM: 'dogeify-js'" });
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
    let out = await dogeify(args.text);
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .addFields([
        {
          name: "**Input**",
          value: args.text,
        },
      ])
      .addFields([
        {
          name: "**Dogeified**",
          value: out,
        },
      ])
      .setFooter({ text: "Used NPM: 'dogeify-js'" });
    await interaction.editReply({ content: " ", embeds: [embed] });
  },
};
