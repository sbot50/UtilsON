const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const wiki = require("wikijs").default;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ytsearch")
    .setDescription("Searches for a video on youtube!")
    .addStringOption((option) =>
      option
        .setName("searchquery")
        .setDescription("Text to search for!")
        .setRequired(true)
    ),
  integration_types: [0, 1],
  permissions: [],
  async execute({ args, interaction }) {
    let error = 0;
    let page = await wiki()
      .page(args.searchquery)
      .catch((error) => {});
    if (page == undefined) {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "No article found for your searchquery!",
          },
        ])
        .setFooter({ text: "Used NPM: 'wikijs'" });
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
    let raw = await page.raw;
    let id = await raw.pageid;
    let title = await raw.title;
    let url = await raw.fullurl;
    let image = await page.mainImage();
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
          value: title,
        },
      ])
      .addFields([
        {
          name: "**Url**",
          value: url,
        },
      ])
      .addFields([
        {
          name: "**Id**",
          value: id.toString(),
        },
      ])
      .setThumbnail(image)
      .setFooter({ text: "Used NPM: 'wikijs'" });
    await interaction.editReply({ content: " ", embeds: [embed] });
  },
};
