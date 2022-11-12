const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("Start a game of rps!"),
  permissions: [],
  async execute({ interaction }) {
    let row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("rock")
        .setEmoji("🪨")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("paper")
        .setEmoji("📰")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("scissors")
        .setEmoji("✂️")
        .setStyle(ButtonStyle.Primary)
    );
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .addFields([
        {
          name: "Bots Score",
          value: "0/3",
        },
      ])
      .addFields([
        {
          name: "Your Score",
          value: "0/3",
        },
      ])
      .addFields([
        {
          name: "Phase",
          value: "Waiting for you...",
        },
      ]);
    await interaction.editReply({
      content: " ",
      embeds: [embed],
      components: [row],
    });
  },
};
