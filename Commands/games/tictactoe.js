// const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
// const Discord = require("discord.js");
// const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("tictactoe")
//     .setDescription("Start a game of tictactoe!")
//     .addStringOption((option) =>
//       option
//         .setName("difficulty")
//         .setDescription("What do you want the difficulty to be?")
//         .setRequired(true)
//         .addChoices(
//           { name: "Easy", value: "Easy" },
//           { name: "Normal", value: "Normal" },
//           { name: "Hard", value: "Hard" }
//         )
//     ),
//   permissions: [],
//   async execute({ interaction, args }) {
//     let rows = [];
//     let row1 = new ActionRowBuilder()
//       .addComponents(
//         new ButtonBuilder()
//           .setCustomId("Number1")
//           .setEmoji("1️⃣")
//           .setStyle(ButtonStyle.Primary),
//         new ButtonBuilder()
//           .setCustomId("Number2")
//           .setEmoji("2️⃣")
//           .setStyle(ButtonStyle.Primary),
//         new ButtonBuilder()
//           .setCustomId("Number3")
//           .setEmoji("3️⃣")
//           .setStyle(ButtonStyle.Primary)
//       )
//     let row2 = new ActionRowBuilder()
//       .addComponents(
//         new ButtonBuilder()
//           .setCustomId("Number4")
//           .setEmoji("4️⃣")
//           .setStyle(ButtonStyle.Primary),
//         new ButtonBuilder()
//           .setCustomId("Number5")
//           .setEmoji("5️⃣")
//           .setStyle(ButtonStyle.Primary),
//         new ButtonBuilder()
//           .setCustomId("Number6")
//           .setEmoji("6️⃣")
//           .setStyle(ButtonStyle.Primary)
//       )
//     let row3 = new ActionRowBuilder()
//       .addComponents(
//         new ButtonBuilder()
//           .setCustomId("Number7")
//           .setEmoji("7️⃣")
//           .setStyle(ButtonStyle.Primary),
//         new ButtonBuilder()
//           .setCustomId("Number8")
//           .setEmoji("8️⃣")
//           .setStyle(ButtonStyle.Primary),
//         new ButtonBuilder()
//           .setCustomId("Number9")
//           .setEmoji("9️⃣")
//           .setStyle(ButtonStyle.Primary)
//       )
//     rows.push(row1, row2, row3);
//     let embed = new EmbedBuilder()
//       .setColor(0x1cd0ce)
//       .addFields([
//         {
//           name: "**Difficulty**",
//           value: args.difficulty,
//         },
//       ])
//       .addFields([
//         {
//           name: "**State**",
//           value: "1️⃣​2️⃣​3️⃣\n4️⃣​5️⃣​6️⃣\n7️⃣​8️⃣​9️⃣",
//         },
//       ])
//       .setFooter({ text: "Used NPM: 'tictactoe-minimax-ai'" });
//     await interaction.editReply({
//       content: " ",
//       embeds: [embed],
//       components: rows,
//     });
//   },
// };
