const {
	SlashCommandBuilder,
	EmbedBuilder,
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require("discord.js");
const Discord = require("discord.js");
const tio = require("tryitonline");
const levenshtein = require("fast-levenshtein").get;
let languages;
(async () => {
	let langs = await tio.languages();
	languages = langs.map((lang) => lang.id);
})();

module.exports = {
	dontDefer: true,
	async execute({ client, args, interaction }) {
        //args.code = interaction.fields.getTextInputValue("code")
        console.log(interaction.fields);
		console.log(interaction.components);
        return;
		let languagename = args.language.split("-")[0];
		let res = await tio.evaluate(
			{
				language: args.language,
				code: args.code,
			},
			30000
		);
		if (res.status != "passed") {
			let embed = new EmbedBuilder()
				.setColor(0xa31600)
				.addFields([{ name: "**ERROR**", value: "Timed Out!" }])
				.setFooter({ text: "Used NPM: 'tryitonline'" });
			await interaction.editReply({ content: " ", embeds: [embed] });
		}
		if (args.code.length > 1014 - languagename.length)
			args.code = args.code.substr(0, 1011 - languagename.length) + "...";
		if (res.output.length > 1014) res.output = res.output.substr(0, 1011) + "...";
		if (res.warnings.length > 1014)
			res.warnings = res.warnings.substr(0, 1011) + "...";
		if (res.debug.length > 1014) res.debug = res.debug.substr(0, 1011) + "...";
		let embed = new EmbedBuilder().setColor(0x1cd0ce).addFields([
			{
				name: "**Input**",
				value: "```" + languagename + "\n" + args.code.replace(/`/g, "´") + "\n```",
			},
		]);
		if (res.output.length > 0) {
			embed.addFields([
				{
					name: "**Eval**",
					value: "```\n" + res.output.replace(/`/g, "´") + "\n```",
				},
			]);
		}
		if (res.warnings.length > 0) {
			embed.addFields([
				{
					name: "**Warnings**",
					value: "```\n" + res.warnings.replace(/`/g, "´") + "\n```",
				},
			]);
		}
		if (res.debug.length > 0) {
			embed.addFields([
				{
					name: "**Debug**",
					value: "```\n" + res.debug.replace(/`/g, "´") + "\n```",
				},
			]);
		}
		embed.setFooter({ text: "Used NPM: 'tryitonline'" });
		await interaction.editReply({ content: " ", embeds: [embed] });
	},
	async autocomplete({ interaction }) {
		let focusedValue = interaction.options.getFocused();
		let filtered = languages.filter((lang) => lang.startsWith(focusedValue));
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
