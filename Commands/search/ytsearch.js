const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const yts = require("youtube-search-api");
const fetchVideoInfo = require("updated-youtube-info");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wikisearch")
    .setDescription("Searches for a article on wikipedia!")
    .addStringOption((option) =>
      option
        .setName("searchquery")
        .setDescription("Text to search for!")
        .setRequired(true)
    ),
  permissions: ["EmbedLinks"],
  async execute({ args, channel, interaction }) {
    let err;
    let res;
    try {
      res = await yts.GetListByKeyword(args.searchquery, false);
    } catch (error) {
      err = 1;
    }
    if (res == undefined || err == 1) {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "No video found for your searchquery!",
          },
        ])
        .setFooter({
          text: "Used NPMs: 'youtube-search-api, updated-youtube-info'",
        });
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
    } else {
      res = res.items[0];
    }
    err;
    try {
      orgvid = res;
      video = await fetchVideoInfo(res.id);
    } catch (error) {
      err = 1;
    }
    if (err == 1) {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "No video found for your searchquery!",
          },
        ])
        .setFooter({
          text: "Used NPMs: 'youtube-search-api, updated-youtube-info'",
        });
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
      .addFields([
        {
          name: "**Title**",
          value: video.title,
        },
      ])
      .addFields([
        {
          name: "**Description**",
          value: video.description,
        },
      ])
      .addFields([
        {
          name: "**Views**",
          value: video.views.toString(),
          inline: true,
        },
      ])
      .addFields([
        {
          name: "**Time**",
          value: orgvid.length.simpleText,
          inline: true,
        },
      ])
      .addFields([
        {
          name: "**Time**",
          value: video.owner,
        },
      ])
      .setThumbnail(video.thumbnailUrl)
      .setFooter({
        text:
          "published on: " +
          video.datePublished +
          " || Used NPMs: 'youtube-search-api, updated-youtube-info",
      });
    await interaction.editReply({ content: " ", embeds: [embed] });
    channel.send(video.url);
  },
};
