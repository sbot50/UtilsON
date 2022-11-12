// const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// const Discord = require('discord.js');
// const fetch = require('node-fetch');

// module.exports = {
//   data: new SlashCommandBuilder()
// 		.setName('mcstats')
// 	  .setDescription('Gets a minecraft service stats for you!'),
//   async execute({interaction}) {
//     let stats = await fetch("https://status.mojang.com/check")
//     stats = await stats.text()
//     stats = stats.replace("[","").replace("]","").split(",")
//     let out = "";
//     for (let serv in stats) {
//       let service = JSON.parse(stats[serv]);
//       let servicename = Object.keys(service)
//       let status = service[servicename]
//       if (status == "green") {
//         out = out + "\n" + "🟢 - " + servicename
//       } else if (status == "yellow") {
//         out = out + "\n" + "🟡 - " + servicename
//       } else {
//         out = out + "\n" + "🔴 - " + servicename
//       }
//     }
//     let embed = new EmbedBuilder()
//       .setColor(0x1cd0ce)
//       .addFields([
// {
// name: "**Services**",
// value: out
// }
// ])
//       .setFooter({ text: "Used NPM: 'node-fetch'" })
//     await interaction.editReply({ content: " ", embeds: [embed] });
//   }
// };

//https://mc-heads.net/mcstatus
