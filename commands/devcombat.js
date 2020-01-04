/*
Developer Combat Command
Author: Tom Green
Date Created: 14/11/2019
*/

module.exports = {
	name: "devcombat",
	syntax: `~devcombat`,
	description: 'Triggers combat for testing purposes.',
	usage: [
		"~devcombat - Triggers combat.",
	],
};

module.exports.run = (client, message) => {
	// If the user is not the developer return a message letting the user know they are unable to use the command.
	if (message.author.id !== client.config.devID) 
		return message.reply("Insufficient permissions.");	

	// Try to load the character and monster files in order to engage combat.
	try {
		var character = client.charFuncs.loadCharacter(client, message.author.id);
		var monsters = client.gameFuncs.loadMonsters(client);
	} catch (error) {
		// Errors that occur in this block will always be IO Errors related to being unable to load the character.
	    console.log(error);
		return message.reply("You must create a character to use that command.");
	}
	
	// Initialise the variable rand with a floored random number based upon the length of the dev array contained in the monsters.json file.
	var rand = Math.floor(Math.random() * monsters.dev.length);

	// Initialise the variable monster with the monster object located at the random index.
	var monster = monsters.dev[rand];
	
	// Run the initialise combat function to begin combat using the dev monster.
	client.gameFuncs.engageCombat(client, message, character, monster);
	message.delete();
}