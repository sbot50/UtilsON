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
// <a href="https://imgbb.com/"><img src="https://i.ibb.co/Jkn2mwH/download.png" alt="download" border="0"></a>
// <a href="https://imgbb.com/"><img src="https://i.ibb.co/R2Pp6rp/download2.png" alt="download2" border="0"></a>
module.exports = {
  data: new SlashCommandBuilder()
    .setName("diceroll")
    .setDescription("Returns a number from 1 to 6!"),
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
