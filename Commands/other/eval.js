const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const tio = require("tryitonline");
const levenshtein = require("fast-levenshtein").get;
let languages;
(async () => {
  let langs = await tio.languages();
  languages = langs.reduce((acc, item) => {
    acc[item.name] = item.id;
    return acc;
  }, {});
})();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Eval code for any language!")
    .addStringOption((option) =>
      option
        .setName("language")
        .setDescription(
          "Coding language to use. default = JavaScript (Node.js)"
        )
        .setAutocomplete(true)
    ),
  integration_types: [0, 1],
  permissions: [],
  dontDefer: true,
  async execute({ client, args, guild, channel, member, interaction }) {
    if (!args.language || !Object.keys(languages).includes(args.language)) {
      fullname = "JavaScript (Node.js)";
      args.language = "javascript-node";
    } else {
      fullname = args.language;
      args.language = languages[args.language];
    }
    let modal = new ModalBuilder().setCustomId("eval").setTitle(fullname);

    let code = new TextInputBuilder()
      .setCustomId(args.language)
      .setLabel("Code to eval.")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);
    code = new ActionRowBuilder().addComponents(code);

    modal.addComponents(code);
    interaction.showModal(modal);
  },
  async autocomplete({ interaction }) {
    let focusedValue = interaction.options.getFocused().toLowerCase();
    let filtered = Object.keys(languages).filter(
      (lang) =>
        lang.toLowerCase().startsWith(focusedValue) ||
        lang.toLowerCase().includes(focusedValue)
    );
    filtered = filtered
      .map((lang) => ({ name: lang, dist: levenshtein(lang, focusedValue) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 25)
      .map((lang) => lang.name);
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
};
