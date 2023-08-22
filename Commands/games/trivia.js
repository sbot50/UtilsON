const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const Trivia = require("trivia-api");
const trivia = new Trivia({ encoding: "url3986" });

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
  return array;
}

function decodeEntities() {
  // this prevents any overhead from creating the object each time
  let element = document.createElement('div');

  function decodeHTMLEntities (str) {
    if(str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }

    return str;
  }

  return decodeHTMLEntities;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("trivia")
    .setDescription("Asks you a trivia question.")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("What type of question do you want it to be?")
        .setRequired(true)
        .addChoices(
          { name: "True/False", value: "boolean" },
          { name: "Multiple Choice", value: "multiple" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("difficulty")
        .setDescription("What do you want the difficulty to be?")
        .setRequired(true)
        .addChoices(
          { name: "Easy", value: "easy" },
          { name: "Normal", value: "normal" },
          { name: "Hard", value: "hard" }
        )
    ),
  permissions: [],
  async execute({ client, args, interaction }) {
    let options = {
      type: args.type,
      amount: 1,
      difficulty: args.difficulty,
    };
    let question = await trivia.getQuestions(options);
    question = question.results[0];
    let q = decodeEntities(question.question);
    let embed;
    if (args.type == "boolean") {
      embed = new EmbedBuilder()
        .setColor(0x1cd0ce)
        .addFields([
          {
            name: "**Question**",
            value: q,
          },
        ])
        .addFields([
          {
            name: "**Answer**",
            value:
              "||" + decodeEntities(question.correct_answer) + " "*(Math.floor(Math.random() * 11) + 20) + "||",
          },
        ]);
    } else {
      embed = new EmbedBuilder().setColor(0x1cd0ce).addFields([
        {
          name: "**Question**",
          value: q,
        },
      ]);
      let answers = question.incorrect_answers;
      answers.push(question.correct_answer);
      answers = await shuffle(answers);
      for (let index in answers) {
        answers[index] = decodeEntities(answers[index]);
      }
      let choices = "";
      for (let a in answers) {
        choices = choices + "\n> " + answers[a];
      }
      embed
        .addFields([
          {
            name: "**Choices**",
            value: choices,
          },
        ])
        .addFields([
          {
            name: "**Answer**",
            value: "||" + decodeEntities(question.correct_answer) + " "*(Math.floor(Math.random() * 11) + 20) + "||",
          },
        ]);
    }
    embed.setFooter({ text: "Used NPM: 'trivia-api'" });
    await interaction.editReply({ content: " ", embeds: [embed] });
  },
};
