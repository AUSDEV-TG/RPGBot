const charFuncs = require("./functions/character-functions.js");
const gameFuncs = require("./functions/game-functions.js");
const reactions = require("./functions/reactions.js");
const Discord = require("discord.js");
const shell = require("shelljs");
const Enmap = require("enmap");
const fs = require("fs");
const _ = require("lodash");

const config = require("./json/config.json");
const monsters = require("./res/monsters.json");
const items = require("./res/items.json");

const client = new Discord.Client();

client.charFuncs = charFuncs;
client.gameFuncs = gameFuncs;
client.reactions = reactions;
client.monsters = monsters;
client.items = items;
client.config = config;
client.shell = shell;
client.fs = fs;
client._ = _;

fs.readdir("./events/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		const event = require(`./events/${file}`);
		let eventName = file.split(".")[0];
		client.on(eventName, event.bind(null, client));
	});
});

client.commands =  new Enmap();

fs.readdir("./commands/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		if (!file.endsWith(".js")) return;
		let props = require(`./commands/${file}`);
		let commandName = file.split(".")[0];
		console.log(`Summoning command ${commandName}`);
		client.commands.set(commandName, props);
	});
});

client.login(config.token);