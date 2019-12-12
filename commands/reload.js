// Reload command
// Author: Tom Green
// Date Created: 20/10/2019
module.exports = {
	name: "reload",
	syntax: `~reload commandName`,
	description: 'Reload a command.',
	usage: [
		"~reload map - Reload the map command.",
	],
};

module.exports.run = (client, message, args) => {
	if (message.author.id !== client.config.devID) return message.reply("Insufficient Permissions.");
	if (!args || args.length < 1) return message.reply("Must provide a command to reload.");

	if (args[0] === "-") {
		try {
			delete require.cache[require.resolve(`../functions/character-functions.js`)];
			delete require.cache[require.resolve(`../functions/game-functions.js`)];
			delete require.cache[require.resolve(`../functions/reactions.js`)];
			delete require.cache[require.resolve(`../json/config.json`)];
			const charFuncs = require("../functions/character-functions.js");
			const gameFuncs = require("../functions/game-functions.js");
			const reactions = require("../functions/reactions.js")
			const config = require("../json/config.json");
			const monsters = require("../res/monsters.json");
			const items = require("../res/items.json");
			client.charFuncs = charFuncs;
			client.gameFuncs = gameFuncs;
			client.reactions = reactions;
			client.monsters = monsters;
			client.items = items;
			client.config = config;
			message.reply("Hard reload successful!");
		} catch (error) {
			console.log(error);
		}
	} else {
		for (i = 0; i < args.length; ++i) {
			try {
				const commandName = args[i];
				// Check if the command exists and is valid
				if (!client.commands.has(commandName)) return message.reply("That command doesn't exist");
				// The path is relative the the *current folder*, so just ./filename.js
				delete require.cache[require.resolve(`./${commandName}.js`)];
				// Also need to delete and reload the command from the client.commands Enmao
				client.commands.delete(commandName);
				const props = require(`./${commandName}.js`);
				client.commands.set(commandName, props);
				message.reply(`${commandName} has been reloaded.`);
			} catch (error) {
				console.log(error);
			}
		}
	}
	message.delete();	
}