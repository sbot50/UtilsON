const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const Discord = require("discord.js");

module.exports = {
  dontDefer: true,
  async submit({ client, args, interaction }) {
    let title = interaction.fields.getTextInputValue("title");
    let hex = interaction.fields.getTextInputValue("hex");
    if (!hex.startsWith("#")) {
      hex = "#" + hex;
    }
    let embed = interaction.message.embeds[0];
    let poll = interaction.message.embeds[0].image.url;
    poll = decodeURIComponent(
      poll.replace("https://quickchart.io/chart?bkg=white&c=", "")
    );
    poll = JSON.parse(poll);
    poll.data.datasets.push({
      label: title,
      backgroundColor: hex + "80",
      borderColor: hex,
      borderWidth: 3,
      barPercentage: 1,
      categoryPercentage: 0.5,
      data: [],
    });
    embed = EmbedBuilder.from(embed).setImage(
      "https://quickchart.io/chart?bkg=white&c=" +
        encodeURIComponent(JSON.stringify(poll))
    );
    let buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("choice")
        .setLabel("Yes")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("no")
        .setLabel("No")
        .setStyle(ButtonStyle.Danger)
    );
    interaction.editReply({ embeds: [embed], components: [buttons] });
  },
};
