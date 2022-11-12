const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timer")
    .setDescription("Start a timer for a set amount of seconds!")
    .addIntegerOption((option) =>
      option
        .setName("seconds")
        .setDescription("How long the timer is for!")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("endmessage")
        .setDescription("Message to display after the timer is finished!")
        .setRequired(false)
    ),
  permissions: [],
  async execute({ args, channel, interaction }) {
    let num = args.seconds;
    let text = args.endmessage;
    if (text == undefined) {
      text = "Timer Over!";
    }
    let embed = new EmbedBuilder();
    embed.setColor(0x83de14);
    if (num > 60 || num < 5) {
      let embed = new EmbedBuilder().setColor(0xa31600).addFields([
        {
          name: "**ERROR**",
          value: "Time needs to be atleast 5 seconds and max 60 seconds!",
        },
      ]);
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
    let embed3 = new EmbedBuilder();
    embed3.setColor(0x83de14);
    embed3.addFields([
      {
        name: "**Status**",
        value: text,
      },
    ]);
    let embed2 = new EmbedBuilder();
    embed2.setColor(0x83de14);
    embed2.addFields([
      {
        name: "**Status**",
        value: "Time starts now...",
      },
    ]);
    embed.addFields([
      {
        name: "**Status**",
        value: "Ok i'll edit this message in " + num + " seconds.",
      },
    ]);
    interaction.editReply({ content: " ", embeds: [embed] });
    (async () => {
      await sleep(1000);
      interaction.editReply({ content: " ", embeds: [embed2] });
      await sleep(num * 1000);
      interaction.editReply({ content: " ", embeds: [embed3] });
    })();
  },
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
