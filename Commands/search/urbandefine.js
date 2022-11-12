const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const urbanDictionary = require("very-urban");
const dictionary = new urbanDictionary();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("urbandefine")
    .setDescription("Defines a word! (but on the urban dictionary)")
    .addStringOption((option) =>
      option.setName("word").setDescription("Word to define!").setRequired(true)
    ),
  permissions: [],
  async execute({ args, interaction }) {
    let total = 0;
    let res = await dictionary.getAllResults(args.word);
    let toppost;
    let index = 0;
    for (post in res) {
      let check = res[post];
      let votes = check.thumbs_up - check.thumbs_down;
      if (check.author == "sbot50") {
        total = votes;
        index = post;
        toppost = res[post];
        break;
      }
    }
    if (toppost == undefined) {
      for (post in res) {
        let check = res[post];
        let votes = check.thumbs_up - check.thumbs_down;
        if (votes > total) {
          total = votes;
          index = post;
          toppost = res[post];
        }
      }
    }
    if (toppost != undefined) {
      let def = toppost.definition.replace(/[\[\]]/g, "");
      def = def.replace(/\\r/g, "");
      let exam = toppost.example.replace(/[\[\]]/g, "");
      exam = exam.replace(/\\r/g, "");
      let author = toppost.author;
      let embed = new EmbedBuilder().setColor(0x1cd0ce);
      embed.addFields([
        {
          name: "**Word**",
          value: toppost.word,
        },
      ]);
      if (def != null && def != undefined && def.trim() != "") {
        if (def.length < 1024) {
          embed.addFields([
            {
              name: "**Definition**",
              value: def,
            },
          ]);
        } else {
          let def1 = def.slice(0, 1025);
          if (def1.endsWith(" ")) {
            def1 = def1.slice(0, def1.length - 1);
          } else {
            while (!def1.endsWith(" ")) {
              def1 = def1.slice(0, def1.length - 1);
            }
            def1 = def1.slice(0, def1.length - 1);
          }
          let def2 = def.replace(def1, "");
          embed.addFields([
            {
              name: "**Definition P1**",
              value: def1,
            },
          ]);
          if (def2.length < 1024) {
            embed.addFields([
              {
                name: "**Definition P2**",
                value: def2,
              },
            ]);
          } else {
            let def1 = def2.slice(0, 1025);
            if (def1.endsWith(" ")) {
              def1 = def1.slice(0, def1.length - 1);
            } else {
              while (!def1.endsWith(" ")) {
                def1 = def1.slice(0, def1.length - 1);
              }
              def1 = def1.slice(0, def1.length - 1);
            }
            def2 = def2.replace(def1, "");
            embed.addFields([
              {
                name: "**Definition P2**",
                value: def1,
              },
            ]);
            embed.addFields([
              {
                name: "**Definition P3**",
                value: def2,
              },
            ]);
          }
        }
      }
      if (exam != null && exam != undefined && exam.trim() != "") {
        if (exam.length < 1024) {
          embed.addFields([
            {
              name: "**Example**",
              value: exam,
            },
          ]);
        } else {
          let exam1 = exam.slice(0, 1025);
          if (exam1.endsWith(" ")) {
            exam1 = exam1.slice(0, exam1.length - 1);
          } else {
            while (!exam1.endsWith(" ")) {
              exam1 = exam1.slice(0, exam1.length - 1);
            }
            exam1 = exam1.slice(0, exam1.length - 1);
          }
          let exam2 = exam.replace(exam1, "");
          embed.addFields([
            {
              name: "**Example P1**",
              value: exam1,
            },
          ]);
          embed.addFields([
            {
              name: "**Example P2**",
              value: exam2,
            },
          ]);
        }
      }
      embed.addFields([
        {
          name: "**Votes**",
          value: total.toString(),
        },
      ]);
      if (author != null && author != undefined && author.trim() != "") {
        embed.addFields([
          {
            name: "**Author**",
            value: author,
          },
        ]);
      }
      embed.setFooter({ text: "Used NPM: 'very-urban'" });
      await interaction.editReply({ content: " ", embeds: [embed] });
    } else {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value:
              "Tf did you even search that even **The Urban Dictionary** doesnt have the definition. Well ik what you searched, you searched: " +
              args.word +
              ". If The Urban Dictionary doesn't have it it must be really darn stupid, jesus christ.",
          },
        ])
        .setFooter({ text: "Used NPM: 'very-urban'" });
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
