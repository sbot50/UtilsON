const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const got = require("got");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("websitereader")
    .setDescription("Read a website for you!")
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("Link to the site!")
        .setRequired(true)
    ),
  permissions: ["EmbedLinks"],
  async execute({ args, interaction }) {
    let link = args.link;
    let err = 0;
    await got(link).catch(() => (err = 1));
    if (err == 1) {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "Not a valid URL!",
          },
        ])
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
    let rng = [
      "just do it yourself!",
      "click here --> " + link,
      "use your eyes",
      "do you really need a bot to do that for you?",
      "lmgtfy",
    ];
    rng = rng[Math.floor(Math.random() * rng.length)];
    if (rng == "lmgtfy") {
      link = await encodeURIComponent(link);
      link = "https://lmgtfy.app/?q=" + link + "&iie=1&s=g&l=en";
      await interaction.editReply({ content: link });
    } else {
      let embed = new EmbedBuilder()
        .setColor(0x1cd0ce)
        .setDescription(rng)
      await interaction.editReply({ content: " ", embeds: [embed] });
    }
  },
};
