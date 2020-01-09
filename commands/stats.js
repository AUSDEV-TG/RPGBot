// Stats command
// Author: Tom Green
// Date Created: 22/10/2019

module.exports = {
	name: "stats",
	syntax: `~stats`,
	description: "Displays the character's stats.",
	usage: [
		"~stats - Display the character's stats.",
	],
};

module.exports.run = (client, message) => {
	try {
		var character = client.charFuncs.loadCharacter(client, message.author.id);
	} catch (error) {
		console.log(error);
		return message.reply("You must create a character to use that command.");
	}

	var msg = module.exports.getStats(client, character);

	message.channel.send(msg).then(async (msg) => {
		// React to the message with the refresh button
		await msg.react(client.reactions.refresh);

		await msg.react(client.reactions.x);
		msg.delete(60000).catch();

		// Create collector to listen for button click
		const collector = msg.createReactionCollector((reaction, user) => user !== client.user && user === message.author);

		collector.on('collect', async (messageReaction) => {
			if (messageReaction.emoji.name === client.reactions.x) {
				msg.delete();
				collector.stop();
				return;
			}

			if (messageReaction.emoji.name === client.reactions.refresh) {
				msg.edit(module.exports.getStats(client, character));
			}

			// Get the index of the page by button pressed
			const pageIndex = buttons.indexOf(messageReaction.emoji.name);
			// Return if emoji is irrelevant or the page doesnt exist (number too high)
			if (pageIndex == -1) return;

			const notbot = messageReaction.users.filter(clientuser => clientuser !== client.user).first();
			await messageReaction.remove(notbot);
		});
	}).catch(err => {
		console.log(err)
		msg.edit("There was an error");
		return;
	});

	message.delete();
}

module.exports.getStats = (client, character) => {
	var msg = "";
	msg = client.config.block + "ARM\n" + character.name + "\n\nLevel " + character.level
		+ "\nXP: " + character.xp + "/" + character.xpCap + "\nHealth: " + character.health + "/"
		+ character.maxHealth + "\tMana: " + character.mana + "/" + character.maxMana
		+ "\nDamage: " + character.dam + "\nAge: " + character.age + "\nAt: "
		+ (character.posX + 1) + ", " + (character.posY + 1) + client.config.block;

	return msg;
}