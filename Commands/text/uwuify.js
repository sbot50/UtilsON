const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const Uwuifier = require("uwuifier");
const uwuifier = new Uwuifier();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("uwuify")
    .setDescription("Uwuifies text!")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("What text needs uwuifying?")
        .setRequired(true)
    ),
  permissions: [],
  async execute({ args, interaction }) {
    let out = await uwuifier.uwuifySentence(args.text);
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
          name: "**UwUified**",
          value: out,
        },
      ])
      .setFooter({ text: "Used NPM: 'uwuifier'" });
    await interaction.editReply({ content: " ", embeds: [embed] });
  },
};
