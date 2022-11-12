const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hextomc")
    .setDescription(
      "Changes a hex color code to a mc color code! (spigot only)"
    )
    .addStringOption((option) =>
      option
        .setName("hex")
        .setDescription("What hex needs to be transformed?")
        .setRequired(true)
    ),
  permissions: [],
  async execute({ args, interaction }) {
    let out = args.hex;
    if (!out.match(/(|#)[A-z0-9]+/g)) {
      let embed = new EmbedBuilder().setColor(0xa31600).addFields([
        {
          name: "**ERROR**",
          value: "Not a valid hex code! (not all numbers +/- #)",
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
    if (out.startsWith("#")) {
      out = out.replace("#", "");
    }
    if (out.length != 6) {
      if (out.length > 6 && out.length <= 8) {
        let embed = new EmbedBuilder().setColor(0xa31600).addFields([
          {
            name: "**ERROR**",
            value: "Not a valid mc colorcode! (not the correct length)",
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
      } else {
        let embed = new EmbedBuilder().setColor(0xa31600).addFields([
          {
            name: "**ERROR**",
            value: "Not a valid hex code! (not the correct length)",
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
    }
    out = out.split("");
    let newout = "&x";
    for (l in out) {
      newout = newout + "&" + out[l];
    }
    let embed = new EmbedBuilder()
      .setColor(0x1cd0ce)
      .addFields([
        {
          name: "**Input**",
          value: args.hex,
        },
      ])
      .addFields([
        {
          name: "**Transformed**",
          value: newout,
        },
      ]);
    await interaction.editReply({ content: " ", embeds: [embed] });
  },
};
