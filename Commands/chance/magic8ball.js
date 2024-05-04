const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const responses = [
  "As I see it, yes.",
  "Ask again later.",
  "Better not tell you now.",
  "Cannot predict now.",
  "Concentrate and ask again.",
  "Don’t count on it.",
  "It is certain.",
  "It is decidedly so.",
  "Most likely.",
  "My reply is no.",
  "My sources say no.",
  "Outlook not so good.",
  "Outlook good.",
  "Reply hazy, try again.",
  "Signs point to yes.",
  "Very doubtful.",
  "Without a doubt.",
  "Yes.",
  "Yes – definitely.",
  "You may rely on it.",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("magic8ball")
    .setDescription("Answers your deepest questions.")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("What do you want to ask?")
        .setRequired(true)
    ),
  integration_types: [0, 1],
  permissions: [],
  async execute({ client, args, interaction }) {
    let response = responses[Math.floor(Math.random() * responses.length)];
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .addFields([
        {
          name: "**Query**",
          value: args.question,
        },
      ])
      .addFields([
        {
          name: "**Answer**",
          value: response,
        },
      ]);
    await interaction.editReply({ content: " ", embeds: [embed] });
  },
};
