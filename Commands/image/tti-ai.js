const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const got = require("got");
const FormData = require("form-data");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tti-ai")
    .setDescription("Tries to create an image from a text description!")
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("What to make an image from!")
        .setRequired(true)
    ),
  permissions: ["EmbedLinks"],
  async execute({ args, interaction, button }) {
    if (button == undefined) button = false;
    if (button) {
      let components = interaction.message.components;
      for (component in components[0].components) {
        comp = components[0].components[component];
        comp = ButtonBuilder.from(comp).setDisabled(true);
        components[0].components[component] = comp;
      }
      let oldmsg = interaction.message.embeds[0];
      await interaction.editReply({
        content: " ",
        embeds: [oldmsg],
        components: components,
      });
    }
    let formdata = new FormData();
    formdata.append("text", args.description);
    let out = await got
      .post("https://api.deepai.org/api/text2img", {
        headers: { "api-key": process.env.DEEPAI },
        body: formdata,
      })
      .json();
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .addFields([
        {
          name: "**Input:**",
          value: args.description,
        },
      ])
      .setImage(out.output_url)
      .setFooter({
        text: "Used Site: 'https://deepai.org/machine-learning-model/text2img'",
      });
    button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("refresh")
        .setEmoji("🔄")
        .setStyle(ButtonStyle.Primary)
    );
    await interaction.editReply({
      content: " ",
      embeds: [embed],
      components: [button],
    });
  },
};
