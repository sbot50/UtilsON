// const tictactoe = require("tictactoe-minimax-ai");
// let options = {
//   computer: "o",
//   opponent: "x",
// };
// const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

// function makebuttons(disable) {
//   let dlist = {};
//   for (i = 1; i < 10; i++) {
//     if (disable.includes(i)) {
//       dlist[i + ""] = true;
//     } else {
//       dlist[i + ""] = false;
//     }
//   }
//   let rows = [];
//   let row1 = new ActionRowBuilder()
//     .addComponents(
//       new ButtonBuilder()
//         .setCustomId("Number1")
//         .setEmoji("1️⃣")
//         .setStyle(ButtonStyle.Primary)
//         .setDisabled(dlist["1"])
//     )
//     .addComponents(
//       new ButtonBuilder()
//         .setCustomId("Number2")
//         .setEmoji("2️⃣")
//         .setStyle(ButtonStyle.Primary)
//         .setDisabled(dlist["2"])
//     )
//     .addComponents(
//       new ButtonBuilder()
//         .setCustomId("Number3")
//         .setEmoji("3️⃣")
//         .setStyle(ButtonStyle.Primary)
//         .setDisabled(dlist["3"])
//     );
//   let row2 = new ActionRowBuilder()
//     .addComponents(
//       new ButtonBuilder()
//         .setCustomId("Number4")
//         .setEmoji("4️⃣")
//         .setStyle(ButtonStyle.Primary)
//         .setDisabled(dlist["4"])
//     )
//     .addComponents(
//       new ButtonBuilder()
//         .setCustomId("Number5")
//         .setEmoji("5️⃣")
//         .setStyle(ButtonStyle.Primary)
//         .setDisabled(dlist["5"])
//     )
//     .addComponents(
//       new ButtonBuilder()
//         .setCustomId("Number6")
//         .setEmoji("6️⃣")
//         .setStyle(ButtonStyle.Primary)
//         .setDisabled(dlist["6"])
//     );
//   let row3 = new ActionRowBuilder()
//     .addComponents(
//       new ButtonBuilder()
//         .setCustomId("Number7")
//         .setEmoji("7️⃣")
//         .setStyle(ButtonStyle.Primary)
//         .setDisabled(dlist["7"])
//     )
//     .addComponents(
//       new ButtonBuilder()
//         .setCustomId("Number8")
//         .setEmoji("8️⃣")
//         .setStyle(ButtonStyle.Primary)
//         .setDisabled(dlist["8"])
//     )
//     .addComponents(
//       new ButtonBuilder()
//         .setCustomId("Number9")
//         .setEmoji("9️⃣")
//         .setStyle(ButtonStyle.Primary)
//         .setDisabled(dlist["9"])
//     );
//   rows.push(row1, row2, row3);
//   return rows;
// }

// module.exports = {
//   async click({ member, interaction }) {
//     let message = interaction.message;
//     let owner = message.interaction.user.id;
//     if (member.user.id != owner) {
//       await interaction.editReply({});
//       let embed = new EmbedBuilder()
//         .setColor(0xa31600)
//         .addFields([
//           {
//             name: "**ERROR**",
//             value: "You aren't allowed to play!",
//           },
//         ])
//         .setFooter({ text: "Used NPM: 'tictactoe-minimax-ai'" });
//       await interaction.followUp({
//         content: " ",
//         embeds: [embed],
//         ephemeral: true,
//       });
//       return;
//     }
//     let components = makebuttons([1, 2, 3, 4, 5, 6, 7, 8, 9]);
//     let oldmsg = interaction.message.embeds[0];
//     await interaction.editReply({
//       content: " ",
//       embeds: [oldmsg],
//       components: components,
//     });
//     let embed = message.embeds[0];
//     let difficulty = embed.fields[0].value;
//     let field = embed.fields[1].value;
//     fieldedit = field.replace(/\n/g, "​").split("​");
//     let emoji =
//       fieldedit[Number(interaction.customId.replace("Number", "")) - 1];
//     field = field.replace(emoji, "❌");
//     fieldedit = field.replace(/\n/g, "​").split("​");
//     let board = [];
//     let data = [];
//     let num = 1;
//     let row = [];
//     let availible = [];
//     for (text of fieldedit) {
//       if (text == "❌") {
//         board.push("X");
//         row.push("x");
//       } else if (text == "⭕") {
//         board.push("O");
//         row.push("o");
//       } else {
//         board.push(num);
//         row.push("_");
//         availible.push(num);
//       }
//       num += 1;
//       if (num == 4 || num == 7 || num == 10) {
//         data.push(row);
//         row = [];
//       }
//     }
//     let winner = tictactoe.boardEvaluate(data).status;
//     if (winner == "none") {
//       if (difficulty == "Hard") {
//         let next = tictactoe.bestMove(data, options);
//         board[next] = "O";
//         data[Math.floor(next / 3)][next - Math.floor(next / 3) * 3] = "o";
//       } else if (difficulty == "Easy") {
//         let next = availible[Math.floor(Math.random() * availible.length)];
//         board[next - 1] = "O";
//         let rnext = next - 1;
//         data[Math.floor(rnext / 3)][rnext - Math.floor(rnext / 3) * 3] = "o";
//       } else {
//         let rng = Math.round(Math.random());
//         if (rng == 0) {
//           let next = availible[Math.floor(Math.random() * availible.length)];
//           board[next - 1] = "O";
//           let rnext = next - 1;
//           data[Math.floor(rnext / 3)][rnext - Math.floor(rnext / 3) * 3] = "o";
//         } else {
//           let next = tictactoe.bestMove(data, options);
//           board[next] = "O";
//           data[Math.floor(next / 3)][next - Math.floor(next / 3) * 3] = "o";
//         }
//       }
//     }
//     winner = tictactoe.boardEvaluate(data).status;
//     let index = 0;
//     field = "";
//     for (text of board) {
//       if (text == "X") {
//         field = field + "❌";
//       } else if (text == "O") {
//         field = field + "⭕";
//       } else {
//         let nums = "1️⃣​2️⃣​3️⃣​4️⃣​5️⃣​6️⃣​7️⃣​8️⃣​9️⃣";
//         nums = nums.split("​");
//         field = field + nums[index];
//       }
//       if (index == 2 || index == 5) {
//         field = field + "\n";
//       } else if (index < 8) {
//         field = field + "​";
//       }
//       index += 1;
//     }
//     if (winner != "none") {
//       if (winner == "loss") {
//         winner = "AI";
//       } else if (winner != "tie") {
//         winner = "You";
//       } else {
//         winner = "Draw";
//       }
//       field = field + "\n**Winner: " + winner + "**";
//     }
//     embed.fields[1].value = field;
//     index = 0;
//     if (winner == "none") {
//       let dlist = [];
//       let index = 1;
//       for (b of board) {
//         if (b != index) {
//           dlist.push(index);
//         }
//         index += 1;
//       }
//       components = makebuttons(dlist);
//     } else {
//       components = [];
//     }
//     await interaction.editReply({
//       content: " ",
//       embeds: [embed],
//       components: components,
//     });
//   },
// };
