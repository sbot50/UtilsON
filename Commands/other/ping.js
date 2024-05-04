const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Returns the bots ping!"),
  integration_types: [0, 1],
  permissions: [],
  async execute({ client, interaction }) {
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .setDescription("🏓 pong\n" + client.ws.ping + " ms");
    await interaction.editReply({ content: " ", embeds: [embed] });
  },
};
