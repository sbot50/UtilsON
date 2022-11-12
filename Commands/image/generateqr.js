const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { registerFont, createCanvas } = require("canvas");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("generateqr")
    .setDescription("Generate a QR-Code!")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("Text to make theQR-Code for!")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("backgroundcolor")
        .setDescription(
          "The QR-Code backgroundcolor in hex! (Default: #ffffff00)"
        )
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("qrcolor")
        .setDescription("The QR-Code color in hex! (Default: #000000)")
        .setRequired(false)
    ),
  permissions: ["EmbedLinks"],
  async execute({ args, interaction }) {
    let bgc = "ffffff00";
    let qrc = "000000";
    console.log(args.backgroundcolor);
    if (args.backgroundcolor != undefined) {
      if (
        (args.backgroundcolor.replace("#", "").length == 6 ||
          args.backgroundcolor.replace("#", "").length == 8) &&
        args.backgroundcolor.replace("#", "").match(/[A-z0-9]+/)
      ) {
        bgc = args.backgroundcolor.replace("#", "");
      }
    }
    if (args.backgroundcolor != undefined) {
      if (
        (args.qrcolor != undefined) &
          (args.qrcolor.replace("#", "").length == 6 ||
            args.qrcolor.replace("#", "").length == 8) &&
        args.qrcolor.replace("#", "").match(/[A-z0-9]+/)
      ) {
        qrc = args.qrcolor.replace("#", "");
      }
    }
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .addFields([
        {
          name: "**Input**",
          value: args.text,
        },
      ])
      .setImage(
        "https://quickchart.io/qr?text=" +
          args.text +
          "&dark=" +
          qrc +
          "&light=" +
          bgc +
          "&ecLevel=Q&format=png&margin=0"
      )
      .setFooter({ text: "Used Site: 'https://quickchart.io/'" });
    await interaction.editReply({ content: " ", embeds: [embed] });
  },
};
