const Chart = require("chart.js");
const Canvas = require("canvas");
const { registerFont } = require("canvas");
let ctx = Canvas.createCanvas(400, 400).getContext("2d");
registerFont("./Fonts/arial.ttf", { family: "Arial" });
const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create a poll!")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("The title of the poll.")
        .setRequired(true)
    ),
  permissions: [],
  async execute({ client, args, member, guild, interaction }) {
    let channel = await guild.channels.fetch(interaction.channelId);
    if (
      !member.permissions.has([PermissionsBitField.Flags.ManageMessages])
    ) {
      let embed = new EmbedBuilder().setColor(0xa31600).addFields([
        {
          name: "**ERROR**",
          value:
            "You aren't permitted to use this command. (need ManageMessages)",
        },
      ]);
      await interaction
        .editReply({ content: " ", embeds: [embed], ephemeral: true })
        .then((message) => {
          setTimeout(function () {
            try {
              message.delete();
            } catch {}
          }, 5000);
        });
      return;
    }
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .setDescription("What type of poll do you want to create?")
      .setImage(
        "https://quickchart.io/chart?bkg=white&c=" +
          encodeURIComponent(
            JSON.stringify({
              type: "bar",
              data: {
                labels: [],
                datasets: [],
              },
              options: {
                title: {
                  display: true,
                  text: args.title,
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        stepSize: 1,
                        beginAtZero: true,
                      },
                    },
                  ],
                },
              },
            })
          )
      );
    let buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("yn")
          .setLabel("yes/no")
          .setStyle(ButtonStyle.Success)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("other")
          .setLabel("multi-choice")
          .setStyle(ButtonStyle.Success)
      );
    await interaction.editReply({
      content: " ",
      embeds: [embed],
      components: [buttons],
    });
  },
};

// // let chart = new Chart(ctx, {
// //     type: 'bar',

// //     data: {
// //         labels: [""],
// //         datasets: [
// //         ]
// //     },
// //     options: {

// //       title: {
// //         display: true,
// //         text: 'Basic chart title'
// //       }

// //     }
// // });
// // var image = chart.toBase64Image();
// // console.log(image);

// // {
// //             label: 'True',
// //             backgroundColor: 'rgb(255, 99, 132)',
// //             borderColor: 'rgb(255, 99, 132)',
// //             data: [5]
// //           },
// //           {
// //             label: 'False',
// //             backgroundColor: 'rgb(255, 99, 132)',
// //             borderColor: 'rgb(255, 99, 132)',
// //             data: [10]
// //           },
