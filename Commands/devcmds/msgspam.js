const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("msgspam")
    .setDescription("sends 105 messages"),
  permissions: [],
  devcmd: true,
  async execute({ interaction, channel }) {
    for (let i = 0; i < 105; i++) {
        channel.send((i+1)+"")
        await new Promise(r => setTimeout(r, 1000));
    }
    await interaction.editReply({
      content: "done",
      ephemeral: true
    });
  },
};
