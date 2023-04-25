// const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
// const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
// const Discord = require("discord.js");
// const temperature = 1.2; //0-1 randomness
// const topp = 0.7; //0-1 other randomness
// const length = 500;
// const got = require("got");

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("generatetext")
//     .setDescription("Generates a story from a text string!")
//     .addStringOption((option) =>
//       option
//         .setName("string")
//         .setDescription("The original string!")
//         .setRequired(true)
//     ),
//   permissions: [],
//   async execute({ args, interaction, button }) {
//     if (button == undefined) button = false;
//     if (button) {
//       let components = interaction.message.components;
//       for (component in components[0].components) {
//         comp = components[0].components[component];
//         comp = ButtonBuilder.from(comp).setDisabled(true);
//         components[0].components[component] = comp;
//       }
//       let oldmsg = interaction.message.embeds[0];
//       await interaction.editReply({
//         content: " ",
//         embeds: [oldmsg],
//         components: components,
//       });
//     }
//     let payload = {
//       context: args.string,
//       response_length: length,
//       temp: temperature,
//       top_p: topp,
//       remove_input: true,
//     };
//     let res = await got.post("https://api.eleuther.ai/completion", {
//       json: payload
//     }).json();
//     let embed = new EmbedBuilder()
//       .setColor(0x1cd0ce)
//       .setDescription("**" + args.string + "**" + res[0].generated_text)
//       .setFooter({ text: "Used API: 'GPT-J API'" });
//     button = new ActionRowBuilder().addComponents(
//       new ButtonBuilder()
//         .setCustomId("refresh")
//         .setEmoji("🔄")
//         .setStyle(ButtonStyle.Primary)
//     );
//     await interaction.editReply({
//       content: " ",
//       embeds: [embed],
//       components: [button],
//     });
//   },
// };
