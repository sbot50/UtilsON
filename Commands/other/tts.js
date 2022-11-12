const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const fs = require("fs");
const got = require("got");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tts")
    .setDescription("Text to speech with language & speed support!")
    .addStringOption((option) =>
      option.setName("text").setDescription("Text to say!").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("language_code")
        .setDescription("Language code for the bot to speak in! (default = en)")
        .setRequired(false)
    )
    .addNumberOption((option) =>
      option
        .setName("slowmode")
        .setDescription("Enable slow mode! (max = 1, min = 0.1)")
        .setRequired(false)
    ),
  permissions: [],
  async execute({ args, channel, interaction }) {
    let text = args.text;
    if (text.length < 201) {
      let lang = "en";
      let speed = 1;
      if (args.language_code != undefined) {
        lang = args.language_code;
      }
      if (args.slowmode != undefined) {
        if (parseInt(args.slowmode) != NaN) {
          speed = args.slowmode;
          if (speed > 1) {
            speed = 1;
          } else if (speed < 0.1) {
            speed = 0.1;
          }
        } else {
          let embed = new EmbedBuilder()
            .setColor(0xa31600)
            .addFields([
              {
                name: "**ERROR**",
                value: "Speed needs to be a number!",
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
      }
      let request;
      try {
        request = await got(
          "https://translate.google.com/translate_tts?ie=UTF-8&q=" +
            encodeURIComponent(text) +
            "&tl=" +
            lang +
            "&total=1&idx=0&textlen=4&client=tw-ob&prev=input&ttsspeed=" +
            speed
        );
      } catch (err) {
        request = undefined;
      }
      if (request == undefined || request.status == 404) {
        let embed = new EmbedBuilder()
          .setColor(0xa31600)
          .addFields([
            {
              name: "**ERROR**",
              value: "An error accured when changing text to speech!",
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
      let buffer = request.rawBody;
      let tts = new AttachmentBuilder(buffer, { name: "TTS.mp3" });
      let embed = new EmbedBuilder()
        .setColor(0x1cd0ce)
        .addFields([
          {
            name: "**Input**",
            value: args.text,
          },
        ])
        .addFields([
          {
            name: "**Settings**",
            value: "Language: " + lang + "\nSpeed: " + speed,
          },
        ])
      await interaction.editReply({ content: " ", embeds: [embed] });
      channel.send({ files: [tts] });
    } else {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "Input too long, it needs to be 200 characters or less.",
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
  },
};
