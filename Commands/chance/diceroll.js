const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const dice = {
  1: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Alea_1.png",
  2: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Alea_2.png",
  3: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Alea_3.png",
  4: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Alea_4.png",
  5: "https://upload.wikimedia.org/wikipedia/commons/5/55/Alea_5.png",
  6: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Alea_6.png",
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("diceroll")
    .setDescription("Returns a number from 1 to 6!"),
  integration_types: [0, 1],
  permissions: [],
  async execute({ client, interaction }) {
    let rng = Math.floor(Math.random() * (6 - 1 + 1) + 1);
    let img = dice[rng];
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .setDescription("**Rolled:**")
      .setImage(img);
    await interaction.editReply({ content: " ", embeds: [embed] });
  },
};
