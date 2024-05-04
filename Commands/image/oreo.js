const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const fs = require("fs");
const { Builder, By, Key, until } = require("selenium-webdriver");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("oreo")
    .setDescription("Make an oreo :) (only use letters in the word oreo)")
    .addStringOption((option) =>
      option.setName("text").setDescription("test").setRequired(true)
    ),
  integration_types: [0, 1],
  permissions: [],
  async execute({ args, interaction }) {
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .addFields([
        {
          name: "**Input**",
          value: args.text,
        },
      ])
      .setImage(
        "https://untitled-ldytaposfu6c.runkit.sh/" +
          args.text.replace(/[^oreo]+/g, "")
      )
      .setFooter({
        text: "Made by BlazeMCworld",
        url: "https://cdn.discordapp.com/avatars/520308897735639041/9649c6bbec229d695865e965666d6237.png",
      });
    await interaction.editReply({ content: " ", embeds: [embed] });
  },
};
