const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const errorhandler = require("./../../Misc/weberrorhandler.js");
const Discord = require("discord.js");
var Owlbot = require("owlbot-js");
var owlclient = Owlbot(process.env.OWLTOKEN);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("define")
    .setDescription("Defines a word!")
    .addStringOption((option) =>
      option.setName("word").setDescription("Word to define!").setRequired(true)
    ),
  permissions: [],
  async execute({ args, interaction }) {
    let text = args.word;
    let err = 0;
    let result = "";
    try {
      result = await owlclient.define(args.word);
    } catch (error) {
      err = error.response.status;
    }
    if (err == 0 && result.definitions[0] != undefined) {
      let img = result.definitions[0].image_url;
      let emote = result.definitions[0].emoji;
      let pronunciation = result.pronunciation;
      let embed = new EmbedBuilder().setColor(0x1cd0ce);
      let forresponce = "";
      if (text != null && text != undefined && text.trim() != "") {
        embed.addFields([
          {
            name: "**Word**",
            value: result.word,
          },
        ]);
      }
      if (emote != null && emote != undefined && emote.trim() != "") {
        embed.addFields([
          {
            name: "**Emoji**",
            value: emote,
          },
        ]);
      }
      if (
        pronunciation != null &&
        pronunciation != undefined &&
        pronunciation.trim() != ""
      ) {
        embed.addFields([
          {
            name: "**Pronunciation**",
            value: pronunciation,
          },
        ]);
      }
      for (definition in result.definitions) {
        let definition1 = result.definitions[definition];
        let num = JSON.parse(definition) + 1;
        let type = definition1.type;
        let def = definition1.definition;
        if (def != null && def != undefined) {
          def = def.replace(/\<(|\/)b\>/g, "**");
          def = def.replace(/\<(|\/)span\>/g, "");
          def = def.replace(/; /g, ";\n");
        }
        let example = definition1.example;
        if (example != null && example != undefined) {
          example = example.replace(/\<(|\/)b\>/g, "**");
          example = example.replace(/\<(|\/)span\>/g, "");
          example = example.replace(/; /g, ";\n");
        }
        if (type != null && type != undefined && type.trim() != "") {
          if (result.definitions.length > 1) {
            embed.addFields([
              {
                name: "**Type" + num + "**",
                value: type,
              },
            ]);
          } else {
            embed.addFields([
              {
                name: "**Type**",
                value: type,
              },
            ]);
          }
        }
        if (def != null && def != undefined && def.trim() != "") {
          embed.addFields([
            {
              name: "**Definition**",
              value: def,
            },
          ]);
        }
        if (example != null && example != undefined && example.trim() != "") {
          embed.addFields([
            {
              name: "**Example**",
              value: example,
            },
          ]);
        }
      }
      if (img != null && img != undefined && img.trim() != "") {
        embed.setThumbnail(img);
      }
      embed.setFooter({ text: "Used NPM: 'owlbot-js'" });
      await interaction.editReply({ content: " ", embeds: [embed] });
    } else {
      if (err == "503") {
        let embed = new EmbedBuilder()
          .setColor(0xa31600)
          .addFields([
            {
              name: "**ERROR**",
              value:
                "I am sorry the dictionary API is currently offline, I can't do anything but wait",
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
      if (text.length < 900) {
        let embed = new EmbedBuilder()
          .setColor(0xa31600)
          .addFields([
            {
              name: "**ERROR**",
              value:
                'I am sorry "' +
                text +
                "\" isn't in the DataBase and/or the Dictionary",
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
      } else {
        let embed = new EmbedBuilder()
          .setColor(0xa31600)
          .addFields([
            {
              name: "**ERROR**",
              value:
                "I am sorry the message you asked me to define is too big and isn't in the DataBase and/or Dictionary",
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
  },
};
