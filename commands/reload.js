/*
Reload command
Author: Tom Green
Date Created: 20/10/2019
*/

module.exports = {
	name: "reload",
	syntax: `~reload commandName`,
	description: 'Reload a command.',
	usage: [
		"~reload map - Reload the map command.",
	],
};

module.exports.run = (client, message, args) => {
	// If the user is not the developer return a message letting the user know they are unable to use the command.
	if (message.author.id !== client.config.devID)
		return message.reply("Insufficient Permissions.");
	// If the user didn't provide an argument.
	if (!args || args.length < 1)
		return message.reply("Must provide a command to reload.");
	/* 
	If the argument is '-' reload all requirements by 
	deleting them from the require cache and then 
	requiring them again.
	Used to reload constant definitions that may be 
	changed in development.
	*/
	if (args[0] == "-") {
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
			message.react(client.reactions.error);
		}
	} else {
		// Loop through the arguments and reload each command mentioned
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
				message.react(client.reactions.error);
			}
		}
	}
	message.delete();
}