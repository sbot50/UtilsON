const Discord = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const search = require("../../Commands/search/search.js");

module.exports = {
  async click({ member, interaction }) {
    let message = interaction.message;
    let embed = message.embeds[0];
    let owner = message.interaction.user.id;
    if (member.user.id != owner) {
      let oldmsg = interaction.message.embeds[0];
      await interaction.editReply({ content: " ", embeds: [oldmsg] });
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "You aren't allowed to change this image!",
          },
        ])
        .setFooter({ text: "Used NPMs: 'g-i-s'" });
      await interaction.followUp({
        content: " ",
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }
    let pagenum = embed.footer.text.split(" || ")[0];
    pagenum = Number(pagenum.replace("Page: ", ""));
    pagenum += 1;
    let skips = pagenum - 1;
    let searchquery = embed.fields[0].value;
    let args = { searchquery: searchquery };
    let button = true;
    let res = await search.execute({ args, skips, interaction, button });
  },
};
