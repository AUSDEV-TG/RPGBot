module.exports = {
	name: "devxp",
	description: "Add xp to your character.",
	syntax: `~devxp amount`,
	usage: [
		'~destroy amount - Adds the desired amount of xp to your character.',
	],
};

module.exports.run = (client, message, args) => {
	if (message.author.id !== client.config.devID) 
	return message.reply("Insufficient permissions.");	
	var val = parseInt(args);
	client.charFuncs.addXP(client, message, val);	
	message.delete();
}