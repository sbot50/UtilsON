console.log("Node.js " + process.version);
const { Client, IntentsBitField, PermissionsBitField } = require("discord.js");
const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.GuildPresences,
	],
});
const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const { REST, Routes } = require("discord.js");
const fs = require("fs");
const got = require("got");
const rest = new REST().setToken(token);
const commands = [];
const commandFiles = fs.readdirSync("./Commands");
const Discord = require("discord.js");
const Database = require("./Misc/database");
const urlpackage = require("url");
const UUID = Date.now() + "";
const {
	WebhookClient,
	EmbedBuilder,
	AttachmentBuilder,
} = require("discord.js");
got("https://oibg-1-t2290424.deta.app/setid/?space=UtilsON&uuid=" + UUID, {
	headers: { auth: process.env.OIBG },
});
let db = new Database();
db.log(true);
db.load();
const errLog = new WebhookClient({ url: process.env.ERROR_LOGGER });

var stringConstructor = "test".constructor;
var arrayConstructor = [].constructor;
var objectConstructor = {}.constructor;

async function checkperms(interaction, needed, deferred) {
	let guild = await client.guilds.cache.get(interaction.guildId);
	let channel = await guild.channels.cache.get(interaction.channelId);
	let perms = await guild.members.me.permissionsIn(channel).toArray();
	let missing = needed.filter((perm) => !perms.includes(perm));
	if (!perms.includes("Administrator")) {
		if (missing.length > 0) {
			let notmissing = needed.filter((perm) => !missing.includes(perm));
			notmissing = notmissing.map((perm) => "- '" + perm + "'");
			missing = missing.map((perm) => "- '" + perm + "'");
			let embed = new EmbedBuilder().setColor(0xa31600).addFields([
				{
					name: "**ERROR**",
					value: "I don't have all needed Permissions!",
				},
			]);
			if (notmissing.length != 0) {
				embed.addFields([
					{
						name: "**Gotten Permissions**",
						value: notmissing.join("\n"),
					},
				]);
			} else {
				embed.addFields([
					{
						name: "**Gotten Permissions**",
						value: "None",
					},
				]);
			}
			embed.addFields([
				{
					name: "**Missing Permissions**",
					value: missing.join("\n"),
				},
			]);
			if (deferred) {
				await interaction.editReply({
					content: " ",
					embeds: [embed],
					ephemeral: true,
				});
			} else {
				await interaction.reply({
					content: " ",
					embeds: [embed],
					ephemeral: true,
				});
			}
			return false;
		}
	}
	return true;
}

client.login(token).catch((err) => {
	console.log(err);
});

client.on("ready", () => {
	console.log("Logged in as " + client.user.tag + "!");
	client.user.setActivity("with utilities!", { type: 0 });
	let devcmds = [];
	for (let folder of commandFiles) {
		for (let file of fs.readdirSync("./Commands/" + folder)) {
			let command = require(`./Commands/${folder}/${file}`);
			if (command.data != undefined && command.devcmd != true) {
				commands.push(command.data.toJSON());
			} else if (command.data != undefined && command.devcmd == true) {
				devcmds.push(command.data.toJSON())
			}
		}
	}
	(async () => {
		await db.load();
		let num = 0;
		try {
			console.log(
				`Started refreshing ${commands.length} global application (/) commands.`
			);

			let cmds = await rest.put(Routes.applicationCommands(clientId), {
				body: commands,
			});

			console.log(
				`Successfully reloaded ${cmds.length} global application (/) commands.`
			);

			console.log(
				`Started refreshing ${devcmds.length} guild application (/) commands.`
			);

			cmds = await rest.put(Routes.applicationGuildCommands(clientId, "1094596918308511876"), {
				body: devcmds,
			});

			console.log(
				`Successfully reloaded ${cmds.length} guild application (/) commands.`
			);
		} catch (error) {
			console.log(error);
		}
	})();
	setInterval(async () => {
		let count = 0;
		await client.guilds.cache.forEach(async (guild) => {
			let v = await db.get(guild.id);
			if (!v) {
				await db.set(guild.id, {});
				v = {};
			}
			if (v && v.staticmcstats) {
				let newlist = [];
				for (m of v.staticmcstats) {
					let msg = await guild.channels.fetch(m.channelId);
					try {
						msg = await msg.messages.fetch(m.id);
					} catch (err) {
						msg = undefined;
					}
					if (msg) {
						let msgerr = 0;
						try {
							let args = { ip: msg.embeds[0].fields[0].value };
							for (let i = 1; i < msg.embeds[0].fields.length; i++) {
								if (msg.embeds[0].fields[i].name == "Port") {
									let port = msg.embeds[0].fields[i].value;
									args.ip = args.ip + ":" + port;
									args.version = "Bedrock";
									break;
								}
							}
							let staticmsg = true;
							let getstats = require("./Commands/info/serverstats.js");
							let l = await getstats.execute({ args, staticmsg });
							if (l[1] == undefined) {
								msg.edit({ embeds: [l] });
							} else {
								msg.edit({ embeds: [l[0]] });
							}
						} catch {
							msgerr = 1;
						}
						if (msgerr == 0) {
							newlist.push(m);
						}
					}
				}
				v.staticmcstats = newlist;
				await db.set(guild.id, v);
			}
		});
		let lastuuid = await got(
			"https://oibg-1-t2290424.deta.app/getid/?space=UtilsON",
			{
				headers: { auth: process.env.OIBG },
			}
		);
		if (lastuuid != UUID && /[0-9]+/.test(lastuuid)) {
			process.exit(0);
		}
		await db.save();
	}, 60000);
});

client.on("guildMemberAdd", async (member) => {
	let values = await db.get(member.guild.id);
	if (values != undefined) {
		if (values.welcomemsg != undefined && values.welcomechannel != undefined) {
			let guild = await client.guilds.cache.get(member.guild.id);
			let channel = await client.channels.cache.get(values.welcomechannel);
			let perms = channel.permissionsFor(guild.me);
			let size = await guild.memberCount;
			if (perms.has("SendMessages")) {
				let welcomemsg = values.welcomemsg
					.replace("{usertag}", member.user.tag)
					.replace("{ping}", "<@!" + member.user.id + ">")
					.replace("{servername}", guild.name)
					.replace("{members}", size);
				let embed = new EmbedBuilder()
					.setColor(0x1cd0ce)
					.setDescription(welcomemsg);
				await channel.send({ content: " ", embeds: [embed] });
			}
		}
	}
});

client.on("interactionCreate", async (interaction) => {
	let guild = await client.guilds.cache.get(interaction.guildId);
	let channel = await guild.channels.cache.get(interaction.channelId);
	let needed = ["ViewChannel", "SendMessages", "SendMessagesInThreads"];
	let hasperms = await checkperms(interaction, needed);
	if (!hasperms) {
		return;
	}
	let member = await guild.members.fetch(interaction.member.user.id);
	let cmd;
	if (interaction.type == 2) {
		await interaction.deferReply();
		let argslist = await interaction.options._hoistedOptions;
		let args = {};
		for (let arg of argslist) {
			args[arg.name] = arg.value;
		}
		for (let folder of fs.readdirSync("./Commands/")) {
			for (let file of fs.readdirSync("./Commands/" + folder)) {
				if (file == interaction.commandName + ".js") {
					let path = "./Commands/" + folder + "/" + interaction.commandName + ".js";
					cmd = require(path);
					break;
				}
			}
			if (cmd != undefined) break;
		}
		let needed = cmd.permissions;
		let hasperms = await checkperms(interaction, needed, (deferred = 1));
		if (!hasperms) {
			return;
		}
		try {
			await cmd.execute({
				client,
				args,
				guild,
				channel,
				member,
				interaction,
				db,
			});
		} catch (error) {
			console.error(error);
			await interaction.editReply({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
		}
	} else if (interaction.isButton()) {
		let cmd;
		if (interaction.message.interaction != null) {
			cmd = interaction.message.interaction.commandName;
		} else {
			cmd = "other";
		}
		let button = interaction.customId.replace(/\d+/g, "");
		button = require(`./Buttons/${cmd}/${button}.js`);
		if (!button.dontDefer) {
			await interaction.deferUpdate();
		}
		try {
			await button.click({ client, guild, channel, member, interaction, db });
		} catch (error) {
			console.error(error);
			if (!button.dontDefer) {
				await interaction.editReply({
					content: "There was an error while clicking this button!",
					ephemeral: true,
				});
			} else {
				await interaction.deferUpdate();
				await interaction.editReply({
					content: "There was an error while clicking this button!",
					ephemeral: true,
				});
			}
		}
	} else if (interaction.isSelectMenu()) {
		await interaction.deferUpdate();
		let cmd;
		if (interaction.message.interaction != null) {
			cmd = interaction.message.interaction.commandName;
		} else {
			cmd = "other";
		}
		let menu = interaction.customId.replace(/\d+/g, "");
		menu = require(`./Menus/${cmd}/${menu}.js`);
		try {
			await menu.choose({ client, guild, channel, member, interaction, db });
		} catch (error) {
			console.error(error);
			await interaction.editReply({
				content: "There was an error while using this menu!",
				ephemeral: true,
			});
		}
	} else if (interaction.type == 5) {
		await interaction.deferUpdate();
		let cmd;
		if (interaction.message.interaction != null) {
			cmd = interaction.message.interaction.commandName;
		} else {
			cmd = "other";
		}
		let modal = interaction.customId.replace(/\d+/g, "");
		modal = require(`./Modals/${cmd}/${modal}.js`);
		try {
			await modal.submit({ client, guild, channel, member, interaction, db });
		} catch (error) {
			console.error(error);
			await interaction.editReply({
				content: "There was an error while using this modal!",
				ephemeral: true,
			});
		}
	}
});

client.on("messageReactionAdd", async (reaction, user) => {
	let emoji;
	if (reaction._emoji.id != null) {
		emoji = "<:" + reaction._emoji.name + ":" + reaction._emoji.id + ">";
	} else {
		emoji = reaction._emoji.name;
	}
	if (reaction.message.interaction != undefined) {
		let cmd = reaction.message.interaction.commandName;
		if (fs.existsSync(`./Emojis/${cmd}.js`)) {
			let r = require(`./Emojis/${cmd}.js`);
			let message = reaction.message;
			r.react({ emoji, message, user, reaction });
		}
	}
});

const http = require("http");
const cp = require("child_process");

http
	.createServer((request, response) => {
		let url = request.url;
		if (url.startsWith("/page")) {
			let { query } = urlpackage.parse(request.url.substring(6), true);
			let id = query.id;
			if (id) {
				if (fs.existsSync("/tmp/" + id + ".png")) {
					response.statusCode = 200;
					let img = fs.readFileSync("/tmp/" + id + ".png");
					response.writeHead(200, {
						"Content-Type": "image/png",
						"Content-Length": img.length,
					});
					response.end(img);
				}
			}
		} else if (url.startsWith("/wc")) {
			let { query } = urlpackage.parse(request.url.substring(4), true);
			let id = query.id;

			let data = [];
			request.on("data", (d) => {
				data.push(d);
			});
			request.on("end", async () => {
				data = Buffer.concat(data);
				let list = await db.get("wavecollapse");
				if (list[id] != undefined) {
					let oldmsg = list[id];
					let guild, channel;
					try {
						guild = oldmsg.guild.id;
						channel = oldmsg.channel.id;
					} catch {
						guild = oldmsg.guildId;
						channel = oldmsg.channelId;
					}
					let msg = await client.guilds.cache
						.get(guild)
						.channels.cache.get(channel)
						.messages.fetch(oldmsg.id);
					try {
						let embed = msg.embeds[0];
						fs.writeFileSync(`/tmp/${id}.png`, data);
						let rng = Math.random();
						embed.data.image = {
							url: `https://utilson.onrender.com/page/?id=${id}&rngstring=${rng}`,
						};
						console.log(query.done);
						if (query.done == "true") {
							embed.data.fields[0].value = "Finished " + query.took + "ms";
							delete list[id];
							await db.set("wavecollapse", list);
						} else if (query.error != undefined) {
							embed.data.fields[0].value =
								"**Error:** " + query.error.replace(/_/g, " ");
							delete list[id];
							await db.set("wavecollapse", list);
						} else {
							embed.data.fields[0].value = "Generating...";
						}
						if (query.done == "true") {
							data = new AttachmentBuilder(data, { name: "OUT.png" });
							embed.data.image = {
								url: "attachment://OUT.png",
							};
							msg.edit({ embeds: [embed], files: [data] });
						} else {
							msg.edit({ embeds: [embed] });
						}
					} catch {}
					response.statusCode = 200;
					response.end("valid id!");
				} else {
					response.statusCode = 404;
					response.end("validn't id!");
				}
			});
		} else {
			response.statusCode = 200;
			response.end("oi");
		}
	})
	.listen(7860, () => console.log("http server up and running"));

process.on("uncaughtException", (err, origin) => {
	console.log(err);
	errLog.send({ content: "**UtilsON:**\n" + err.stack + "\n\nUUID:" + UUID });
});
process.on("unhandledRejection", (reason, promise) => {
	console.log(reason);
	errLog.send({
		content: "**UtilsON:**\n" + reason.stack + "\n\nUUID:" + UUID,
	});
});
("Loading...");
