const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const errorhandler = require("./../../Misc/weberrorhandler.js");
const Discord = require("discord.js");
var giphy = require('giphy-api')(process.env.GIPHY);
var channel;
var clint;
var membr;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gif")
    .setDescription("Searches for a gif!")
    .addStringOption((option) =>
      option
        .setName("searchquery")
        .setDescription("Text to search for!")
        .setRequired(true)
    ),
  permissions: ["EmbedLinks"],
  async execute({ client, args, guild, channel, member, interaction }) {
    membr = member;
    clint = client;
    chanl = channel;
    let gifUrl;
    try {
      gifUrl = await giphy.search(args.searchquery);
      gifUrl = gifUrl.data[0].images.original.url;
    } catch (err) {
      errorhandler.execute(err.response.status, __filename);
      gifUrl = "ERROR";
    }
    if (gifUrl == "ERROR") {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "No gif found for your searchquery!",
          },
        ])
        .setFooter({ text: "Used NPM: 'gif-search'" });
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
      .addFields([
        {
          name: "**SearchQuery**",
          value: args.searchquery,
        },
      ])
      .setImage(gifUrl)
      .setFooter({ text: "Used NPM: 'gif-search'" });
    await interaction.editReply({ content: " ", embeds: [embed] });
  },
};

process.on("uncaughtException", (err) => {
  let embed = new EmbedBuilder();
  embed.addFields([
    {
      name: "**ERROR**",
      value: "No gif found for your searchquery!",
    },
  ]);
  embed.setColor(0x83de14);
  if (membr != undefined) {
    let name = membr.user.username;
    let pic = membr.user.avatarURL();
    embed.setAuthor({
      name: name, 
      iconURL: pic
    });
    chanl.send(embed).then((message) => {
      setTimeout(function () {
        try {
          message.delete();
        } catch {}
      }, 5000);
    });
  }
});
