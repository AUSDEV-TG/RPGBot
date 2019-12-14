/*
 * Destroy command
 * Author: Tom Green
 * Date Created: 20/10/2019
 */

// Destroy command metadata
module.exports = {
	name: "destroy",
	description: "Restart RPGBot.",
	syntax: `~destroy`,
	usage: [
		'~destroy - Restarts RPGBot.',
	],
};

// Destroy command definition.
module.exports.run = (client, message) => {
	/*
	 * If the author of the command is the developer, 
	 * destroy the instance of the bot. Otherwise, 
	 * notify the user that they are unable to use 
	 * the command.
	 */
	if (message.author.id !== client.config.devID) 
		return message.reply("Insufficient Permissions.");
	else {
		message.reply("Terminating...");
		message.delete();
		client.destroy();
	}
	message.delete();
}