// Mapgen command
// Author: Tom Green
// Date Created: 11/11/2019

module.exports = {
	name: "mapgen",
	syntax: `~mapgen`,
	description: 'Regenerates the map for testing purposes.',
	usage: [
		"~mapgen - Regenerate the map.",
	],
};

module.exports.run = (client, message) => {
	if (message.author.id !== client.config.devID) {
		message.reply("Insufficient permissions.");
		return;
	}
	var map = client.charFuncs.generateMap(client, message.author.id);
	client.charFuncs.saveMap(client, message.author.id, map);
	message.reply("Map successfully regenerated");
	message.delete();
}