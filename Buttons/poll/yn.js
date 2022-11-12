const Chart = require("chart.js");
const Canvas = require("canvas");
const { registerFont } = require("canvas");
let ctx = Canvas.createCanvas(400, 400).getContext("2d");
registerFont("./Fonts/arial.ttf", { family: "Arial" });
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { ActionRowBuilder, SelectMenuBuilder } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
  async click({ client, args, member, interaction }) {
    let message = interaction.message;
    let owner = message.interaction.user.id;
    if (member.user.id != owner) {
      let oldmsg = interaction.message.embeds[0];
      await interaction.editReply({ content: " ", embeds: [oldmsg] });
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "You aren't allowed to change this!",
          },
        ])
      await interaction.followUp({
        content: " ",
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }
    let poll = interaction.message.embeds[0].image.url;
    poll = decodeURIComponent(
      poll.replace("https://quickchart.io/chart?bkg=white&c=", "")
    );
    poll = JSON.parse(poll);
    poll.data.datasets = [
      {
        label: "Yes",
        backgroundColor: "#78b15980",
        borderColor: "#78b159",
        borderWidth: 3,
        barPercentage: 1,
        categoryPercentage: 0.5,
        data: [],
      },
      {
        label: "No",
        backgroundColor: "#dd2e4480",
        borderColor: "#dd2e44",
        borderWidth: 3,
        barPercentage: 1,
        categoryPercentage: 0.5,
        data: [],
      },
    ];
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .setURL("https://google.com/?json=" + encodeURIComponent(JSON.stringify({Yes:[],No:[]})))
      .setDescription("What channel do you want to send the poll to?")
      .setImage(
        "https://quickchart.io/chart?bkg=white&c=" +
          encodeURIComponent(JSON.stringify(poll))
      );
    let options = [];
    await message.guild.channels.cache.forEach((channel) => {
      if (channel.type == 0) {
        let option = {};
        option.label = channel.name;
        if (channel.parentId == null) {
          option.description = "​";
        } else {
          let p = message.guild.channels.cache.get(channel.parentId);
          option.description = "Category: " + p.name;
        }
        option.value = channel.id;
        options.push(option);
      }
    });
    let menus = [];
    var i,
      j,
      temporary,
      chunk = 25;
    for (i = 0, j = options.length; i < j; i += chunk) {
      temporary = options.slice(i, i + chunk);
      let menu = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId("channelmenu" + i)
          .setPlaceholder("Please select a channel!")
          .addOptions(temporary)
      );
      menus.push(menu);
    }
    await interaction.editReply({
      content: " ",
      embeds: [embed],
      components: menus,
    });
  },
};
