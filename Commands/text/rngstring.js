const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const rngEngine = require("seedrandom");
const chars =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rngstring")
    .setDescription("Generates a random string!")
    .addIntegerOption((option) =>
      option
        .setName("length")
        .setDescription("How long should the string be? (caps at 1000)")
        .setRequired(true)
    ),
  permissions: [],
  async execute({ args, interaction }) {
    let length = Math.max(Math.min(args.length, 1000), 10);
    let s = Date.now();
    let seed = s + "";
    let rng = rngEngine(seed);
    let rand = "";
    for (let i = 0; i < length; i++) {
      rand += chars[Math.floor(rng.quick() * chars.length)];
    }
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .addFields([
        {
          name: "**Length**",
          value: length.toString(),
        },
      ])
      .addFields([
        {
          name: "**String**",
          value: rand,
        },
      ])
      .setFooter({ text: "Used NPM: 'seedrandom'" });
    await interaction.editReply({ content: " ", embeds: [embed] });
  },
};
