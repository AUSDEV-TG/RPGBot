/*
Map command
Author: Tom Green
Date Created: 22/10/2019
*/

module.exports = {
	name: "map",
	syntax: `~map`,
	description: 'Displays the world map.',
	usage: [
		"~map - Display the world map.",
	],
};

module.exports.run = (client, message) => {
	try {
		var character = client.charFuncs.loadCharacter(client, message.author.id);
		var mapSave = client.charFuncs.loadMap(client, message.author.id);
	} catch (error) {
		console.log(error);
		return message.reply("You must create a character to use that command.");
	}

	const buttons = [client.reactions.left, client.reactions.right,
	client.reactions.up, client.reactions.down, client.reactions.interact];

	var map = mapSave.map;
	var temp = map[character.posY][character.posX];
	map[character.posY][character.posX] = '☼';

	var commands = [];

	client.commands.forEach((value, key, map) => {
		commands.push(value);
	});

	var msg = character.name + " at pos(x:" + (character.posX + 1) + ", y:"
		+ (character.posY + 1) + ") On " + temp + "\n" + client.config.block
		+ map[9].join(' ') + "\n" + map[8].join(' ') + "\n"
		+ map[7].join(' ') + "\n" + map[6].join(' ') + "\n"
		+ map[5].join(' ') + "\n" + map[4].join(' ') + "\n"
		+ map[3].join(' ') + "\n" + map[2].join(' ') + "\n"
		+ map[1].join(' ') + "\n"
		+ map[0].join(' ') + client.config.block;

	message.channel.send(msg).then(async (msg) => {
		// Display number buttons
		await msg.react(buttons[0]);
		await msg.react(buttons[1]);
		await msg.react(buttons[2]);
		await msg.react(buttons[3]);
		await msg.react(buttons[4]);

		await msg.react(client.reactions.x);
		msg.delete(60000).catch();

		// Create collector to listen for button click
		const collector = msg.createReactionCollector((reaction, user) => user !== client.user && user === message.author);

		collector.on('collect', async (messageReaction) => {
			// If the x button is pressed, remove the message.
			if (messageReaction.emoji.name === client.reactions.x) {
				msg.delete(); // Delete the message
				collector.stop(); // Get rid of the collector.
				return;
			}

			if (messageReaction.emoji.name === client.reactions.left) {
				client.commands.get('move').run(client, message, ["west", 1]);
				map[character.posY][character.posX] = temp;
				character.posX--;
				if (character.posX < 0) character.posX = 0;
				temp = map[character.posY][character.posX];
				map[character.posY][character.posX] = '☼';
				var newMap = character.name + " at pos(x:" + (character.posX + 1) + ", y:"
					+ (character.posY + 1) + ") On " + temp + "\n" + client.config.block
					+ map[9].join(' ') + "\n" + map[8].join(' ') + "\n"
					+ map[7].join(' ') + "\n" + map[6].join(' ') + "\n"
					+ map[5].join(' ') + "\n" + map[4].join(' ') + "\n"
					+ map[3].join(' ') + "\n" + map[2].join(' ') + "\n"
					+ map[1].join(' ') + "\n"
					+ map[0].join(' ') + client.config.block;
				msg.edit(newMap);
			}

			if (messageReaction.emoji.name === client.reactions.right) {
				client.commands.get('move').run(client, message, ["east", 1]);
				map[character.posY][character.posX] = temp;
				character.posX++;
				if (character.posX > 9) character.posX = 9;
				temp = map[character.posY][character.posX];
				map[character.posY][character.posX] = '☼';
				var newMap = character.name + " at pos(x:" + (character.posX + 1) + ", y:"
					+ (character.posY + 1) + ") On " + temp + "\n" + client.config.block
					+ map[9].join(' ') + "\n" + map[8].join(' ') + "\n"
					+ map[7].join(' ') + "\n" + map[6].join(' ') + "\n"
					+ map[5].join(' ') + "\n" + map[4].join(' ') + "\n"
					+ map[3].join(' ') + "\n" + map[2].join(' ') + "\n"
					+ map[1].join(' ') + "\n"
					+ map[0].join(' ') + client.config.block;
				msg.edit(newMap);
			}

			if (messageReaction.emoji.name === client.reactions.up) {
				client.commands.get('move').run(client, message, ["north", 1]);
				map[character.posY][character.posX] = temp;
				character.posY++;
				if (character.posY > 9) character.posY = 9;
				temp = map[character.posY][character.posX];
				map[character.posY][character.posX] = '☼';
				var newMap = character.name + " at pos(x:" + (character.posX + 1) + ", y:"
					+ (character.posY + 1) + ") On " + temp + "\n" + client.config.block
					+ map[9].join(' ') + "\n" + map[8].join(' ') + "\n"
					+ map[7].join(' ') + "\n" + map[6].join(' ') + "\n"
					+ map[5].join(' ') + "\n" + map[4].join(' ') + "\n"
					+ map[3].join(' ') + "\n" + map[2].join(' ') + "\n"
					+ map[1].join(' ') + "\n"
					+ map[0].join(' ') + client.config.block;
				msg.edit(newMap);
			}

			if (messageReaction.emoji.name === client.reactions.down) {
				client.commands.get('move').run(client, message, ["south", 1]);
				map[character.posY][character.posX] = temp;
				character.posY--;
				if (character.posY < 0) character.posY = 0;
				temp = map[character.posY][character.posX];
				map[character.posY][character.posX] = '☼';
				var newMap = character.name + " at pos(x:" + (character.posX + 1) + ", y:"
					+ (character.posY + 1) + ") On " + temp + "\n" + client.config.block
					+ map[9].join(' ') + "\n" + map[8].join(' ') + "\n"
					+ map[7].join(' ') + "\n" + map[6].join(' ') + "\n"
					+ map[5].join(' ') + "\n" + map[4].join(' ') + "\n"
					+ map[3].join(' ') + "\n" + map[2].join(' ') + "\n"
					+ map[1].join(' ') + "\n"
					+ map[0].join(' ') + client.config.block;
				msg.edit(newMap);
			}

			if (messageReaction.emoji.name === client.reactions.interact) {
				client.commands.get('interact').run(client, message);
			}

			// Get the index of the page by button pressed
			const pageIndex = buttons.indexOf(messageReaction.emoji.name);
			// Return if emoji is irrelevant or the page doesnt exist (number too high)
			if (pageIndex == -1) return;

			const notbot = messageReaction.users.filter(clientuser => clientuser !== client.user).first();
			await messageReaction.remove(notbot);
		});
	}).catch(err => {
		msg.edit("There was an error");
		return;
	});
	message.delete();
}