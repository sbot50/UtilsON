const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("Start a game of rps!"),
  permissions: [],
  devcmd: true,
  async execute({ interaction, channel }) {
    for (let i = 0; i < 105; i++) {
        channel.sendMessage((i+1)+"")
        await new Promise(r => setTimeout(r, 1000));
    }
    await interaction.editReply({
      content: "done",
      ephemeral: true
    });
  },
};
