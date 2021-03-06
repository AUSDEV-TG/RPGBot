/*
Destroy command
Author: Tom Green
Date Created: 20/10/2019
*/

module.exports = {
	name: "destroy",
	description: "Restart RPGBot.",
	syntax: `~destroy`,
	usage: [
		'~destroy - Restarts RPGBot.',
	],
};

module.exports.run = (client, message) => {
	/*
	If the author of the command is the developer, 
	destroy the instance of the bot. Otherwise, 
	notify the user that they are unable to use 
	the command.
	*/
	if (message.author.id !== client.config.devID)
		return message.react(client.reactions.restricted);
	else {
		message.reply("Terminating...");
		message.delete();
		client.destroy();
	}
	message.delete();
}