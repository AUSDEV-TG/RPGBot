/*
New command
Author: Tom Green
Date Created: 20/10/2019
*/

module.exports = {
	name: "new",
	syntax: `~new name age`,
	description: 'Create a new character.',
	usage: [
		"~new Mage 30  - Create a 30 year-old character named Mage.",
		"~new Mage - Create a 25 year-old character named Mage.",
	],
};

module.exports.run = (client, message, args) => {
	if (args == '') return message.reply("Must have parameters for character... Usage: **~new** charactername characterage");
	if (client.shell.exec('./bash/create-usr.sh ' + message.author.id).code !== 0) {
		console.log("Error creating user.");
		message.reply("Something went wrong... Please try again later.");
	} else {
		var apple = client.items.consumable[0];
		var dagger = client.items.equippable[1];
		var money = client.items.tradable[0];
		money.count = 10;
		
		// Writing json file of character data
		var character = {
			name:		args[0],
			level:		1,
			xp:			0,
			xpCap:		10,
			health:		100,
			maxHealth: 	100,
			mana:		100,
			maxMana: 	100,
			age: 		(typeof args[1] === 'undefined' ? 25 : args[1]),
			posX:		4,
			posY:		4,
			inventory: { 
				consumable:	[apple],
				equippable:	[dagger],
				tradable: [money]
			},
			dam: 1,
			dead: false
		};

		var map = client.charFuncs.generateMap(client);

		var profile;

		try {
			profile = client.charFuncs.loadProfile(client, message.author.id);
		} catch (error) {
			console.log(error);
		}
		
		if (!profile) {
			profile = {
				name:	message.author.username,
				achievements: []
			};
		}

		message.reply(character.name + " (Age: " + character.age + ")  has been created!");
		client.charFuncs.saveCharacter(client, message.author.id, character);
		client.charFuncs.saveMap(client, message.author.id, map);
		client.charFuncs.saveProfile(client, message.author.id, profile);
	}
	message.delete();
}