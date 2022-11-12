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
