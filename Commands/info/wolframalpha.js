const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const Discord = require("discord.js");
const got = require("got");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wolframalpha")
    .setDescription("Fancy math calculator and statistics api!")
    .addStringOption((option) =>
      option.setName("input").setDescription("Input.").setRequired(true)
    ),
  permissions: ["AttachFiles"],
  async execute({ client, args, interaction }) {
    let text = "";
    let image = "";
    let error;
    let result = await got(
      "https://api.wolframalpha.com/v1/simple?appid=" +
        process.env.WOLFRAMALPHA +
        "&i=" +
        encodeURIComponent(args.input) +
        "&background=black&foreground=white&layout=labelbar&units=metric&fontsize=50&timeout=15&width=1000"
    ).catch((err) => {
      error = 1;
    });
    if (error == 1) {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "gj you broke it.",
          },
        ])
        .setFooter({ text: "Used API: 'Wolfram|Alpha'" });
      await interaction
        .editReply({ content: " ", embeds: [embed] })
        .then((message) => {
          setTimeout(function () {
            try {
              message.delete();
            } catch {}
          }, 5000);
        });
    } else {
      let embed = new EmbedBuilder()
        .setColor(0x1cd0ce)
        .setImage("attachment://output.png")
        .setFooter({ text: "Used API: 'Wolfram|Alpha'" });
      result = new AttachmentBuilder(result.rawBody, { name: "output.png" });
      await interaction.editReply({
        content: " ",
        embeds: [embed],
        files: [result],
      });
    }
  },
};
