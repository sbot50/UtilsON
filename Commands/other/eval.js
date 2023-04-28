const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const tio = require("tryitonline");
const levenshtein = require("fast-levenshtein").get;
(async () => {
	let langs = await tio.languages();
	const languages = langs.map((lang) => lang.id);
})();

module.exports = {
	data: new SlashCommandBuilder()
		.setName("eval")
		.setDescription("Eval command for Bot Devs!")
		.addStringOption((option) =>
			option
				.setName("code")
				.setDescription("Code to eval. use \\n for newline.")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("language")
				.setDescription("Coding language to use. (default is javascript-node)")
				.setAutocomplete(true)
		),
	permissions: [],
	async execute({ client, args, guild, channel, member, interaction }) {
		args.code = args.code.replace(/\\n/g, "\n");
		if (!args.language || !languages.includes(args.language)) {
			args.language = "javascript-node";
		}
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
		if (args.code.length > 1014) args.code = args.code.substr(1011) + "...";
		if (res.output.length > 1014) res.output = res.output.substr(1011) + "...";
		if (res.warnings.length > 1014) res.warnings = res.warnings.substr(1011) + "...";
		if (res.debug.length > 1014) res.debug = res.debug.substr(1011) + "...";
		let embed = new EmbedBuilder().setColor(0x1cd0ce).addFields([
			{
				name: "**Input**",
				value: "```\n" + args.code + "\n```",
			},
		]);
		if (res.output.length > 0) {
			embed.addFields([
				{
					name: "**Eval**",
					value: "```\n" + res.output + "\n```",
				},
			]);
		}
		if (res.warnings.length > 0) {
			embed.addFields([
				{
					name: "**Warnings**",
					value: "```\n" + res.warnings + "\n```",
				},
			]);
		}
		if (res.debug.length > 0) {
			embed.addFields([
				{
					name: "**Debug**",
					value: "```\n" + res.debug + "\n```",
				},
			]);
		}
		embed.setFooter({ text: "Used NPM: 'tryitonline'" });
		await interaction.editReply({ content: " ", embeds: [embed] });
	},
	async autocomplete({ interaction }) {
		let focusedValue = interaction.options.getFocused();
    console.log(languages)
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
