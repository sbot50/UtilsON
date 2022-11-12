const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const got = require("got");
const { parse } = require("node-html-parser");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

function rng(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wyr")
    .setDescription("Would you rather?"),
  permissions: [],
  async execute({ client, interaction }) {
    let rand = rng(1, 500000);
    let out = await got("http://either.io/" + rand).text();
    out = await parse(out);
    if (out.childNodes[1].childNodes[3].childNodes[17] != undefined) {
      while (1 == 1) {
        let rand = rng(1, 500000);
        out = await got("http://either.io/" + rand).text();
        out = await parse(out);
        if (out.childNodes[1].childNodes[3].childNodes[17] == undefined) {
          break;
        }
      }
    }
    let question =
      out.childNodes[1].childNodes[22].childNodes[1].childNodes[1].childNodes[0]
        .rawText;
    let options =
      out.childNodes[1].childNodes[22].childNodes[1].childNodes[3].childNodes[3]
        .childNodes[3];
    let option1 =
      options.childNodes[1].childNodes[1].childNodes[1].childNodes[0]
        .childNodes[3].childNodes[7].childNodes[0].rawText;
    let option2 =
      options.childNodes[3].childNodes[1].childNodes[1].childNodes[0]
        .childNodes[3].childNodes[7].childNodes[0].rawText;
    let embed = new EmbedBuilder()
      .setTitle("**Would you rather...**")
      .setColor(0xaa0071)
      .setDescription(option1 + "\n**Or**\n" + option2)
      .setFooter({ text: "Used Site: 'https://either.io/'" });
    if (question != "Would you rather...") {
      question = question.replace(", would you rather...", "");
      embed = new EmbedBuilder().setTitle("**" + question + "**").addFields([
        {
          name: "**Would you rather...**",
          value: option1 + "\n**Or**\n" + option2,
        },
      ]);
    }
    let row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("option1")
          .setLabel(option1)
          .setStyle(ButtonStyle.Danger)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("option2")
          .setLabel(option2)
          .setStyle(ButtonStyle.Primary)
      );
    await interaction.editReply({
      content: " ",
      embeds: [embed],
      components: [row],
    });
  },
};
