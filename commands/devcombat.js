// DevCombat command
// Author: Tom Green
// Date Created: 14/11/2019
module.exports = {
	name: "devcombat",
	syntax: `~devcombat`,
	description: 'Triggers combat for testing purposes.',
	usage: [
		"~devcombat - Triggers combat.",
	],
};

module.exports.run = (client, message) => {
	if (message.author.id !== client.config.devID) 
		return message.reply("Insufficient permissions.");	

	try {
		var character = client.charFuncs.loadCharacter(client, message.author.id);
		var monsters = client.gameFuncs.loadMonsters(client);
	} catch (error) {
	    console.log(error);
		return message.reply("You must create a character to use that command.");
	}

	var rand = Math.floor(Math.random() * monsters.dev.length);

	var monster = monsters.dev[rand];
	
	client.gameFuncs.engageCombat(client, message, character, monster);
	message.delete();
}