const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const dice = {
  1: "https://i.ibb.co/z75Mm1W/heads.png",
  2: "https://i.ibb.co/p0DQRqH/tails.png",
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Returns heads or tails!"),
  integration_types: [0,1],
  permissions: [],
  async execute({ client, interaction }) {
    let rng = Math.floor(Math.random() * (2 - 1 + 1) + 1);
    let img = dice[rng];
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .setDescription("**Flipped:**")
      .setImage(img);
    await interaction.editReply({ content: " ", embeds: [embed] });
  },
};
