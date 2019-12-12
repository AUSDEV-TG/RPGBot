// Destroy command
// Author: Tom Green
// Date Created: 20/10/2019
module.exports = {
	name: "destroy",
	description: "Restart RPGBot.",
	syntax: `~destroy`,
	usage: [
		'~destroy - Restarts RPGBot.',
	],
};

module.exports.run = (client, message) => {
	// If the author of the command is the dev
	if (message.author.id !== client.config.devID) return message.reply("Insufficient Permissions.");
	else {
		message.reply("Terminating...");
		client.destroy();
	}
	message.delete();
}