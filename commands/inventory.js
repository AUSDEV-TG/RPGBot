// Inventory command
// Author: Tom Green
// Date Created: 24/10/2019

module.exports = {
	name: "inventory",
	syntax: `~inventory`,
	description: "Opens the character's inventory.",
	usage: [
		"~inventory - Opens the character's inventory..",
	],
};

module.exports.run = (client, message) => {
	try {
		var character = client.charFuncs.loadCharacter(client, message.author.id);
	} catch (error) {
		message.react(client.reactions.error);
		return message.reply("You must create a character to use that command.");
	}

	const buttons = [
		client.reactions.up, client.reactions.down,
		client.reactions.use, client.reactions.equip,
		client.reactions.doubleUp, client.reactions.doubleDown];

	// Define the default position of the cursor
	var selected = 0;
	var selectedType = "consumable";

	var invent = module.exports.getInvent(client, character, selected, selectedType);

	message.channel.send(invent).then(async (msg) => {
		// Display buttons

		await msg.react(buttons[0]);
		await msg.react(buttons[4]);
		await msg.react(buttons[1]);
		await msg.react(buttons[5]);
		await msg.react(buttons[2]);
		await msg.react(buttons[3]);

		// Display X button after the others

		await msg.react(client.reactions.x);
		msg.delete(90000).catch();

		// Create collector to listen for button clicks
		const collector = msg.createReactionCollector((reaction, user) => user !== client.user && user === message.author);

		collector.on('collect', async (messageReaction) => {
			// If the x button is pressed, remove the message.
			if (messageReaction.emoji.name === client.reactions.x) {
				msg.delete(); // Delete the message
				collector.stop(); // Get rid of the collector.
				return;
			}

			// Clicking the up reaction moves the cursor up
			if (messageReaction.emoji.name === client.reactions.up) {
				selected--;
				if (selected < 0 && selectedType == "consumable") selected = 0;
				else if (selected < 0 && selectedType == "equippable") {
					selected = character.inventory.consumable.length - 1;
					selectedType = "consumable";
				}
				else if (selected < 0 && selectedType == "tradable") {
					selected = character.inventory.equippable.length - 1;
					selectedType = "equippable";
				}

				if (character.inventory.consumable.length == 0 && selectedType == "consumable") {
					selected = 0;
					selectedType = "equippable";
				}
				
				if (character.inventory.equippable.length == 0 && selectedType == "equippable") {
					selected = 0;
					selectedType = "tradable";
				}
				
				if (character.inventory.tradable.length == 0 && selectedType == "tradable") {
					selected = 0;
					selectedType = "consumable"
				}

				msg.edit(module.exports.getInvent(client, character, selected, selectedType));
			}

			if (messageReaction.emoji.name === client.reactions.doubleUp) {
				if (selectedType == "consumable")
					selected = 0;
				else if (selectedType == "equippable") {
					selected = 0;
					selectedType = "consumable";
				} else if (selectedType == "tradable") {
					selected = 0;
					selectedType = "equippable";
				}

				if (character.inventory.consumable.length == 0 && selectedType == "consumable") {
					selected = 0;
					selectedType = "equippable";
				}
				
				if (character.inventory.equippable.length == 0 && selectedType == "equippable") {
					selected = 0;
					selectedType = "tradable";
				}
				
				if (character.inventory.tradable.length == 0 && selectedType == "tradable") {
					selected = 0;
					selectedType = "consumable"
				}

				msg.edit(module.exports.getInvent(client, character, selected, selectedType));
			}

			// Clicking the down reaction moves the cursor down
			if (messageReaction.emoji.name === client.reactions.down) {
				selected++;
				if (selected > character.inventory.consumable.length - 1 && selectedType == "consumable") {
					selected = 0;
					selectedType = "equippable";
				}
				else if (selected > character.inventory.equippable.length - 1 && selectedType == "equippable") {
					selected = 0;
					selectedType = "tradable";
				}
				else if (selected > character.inventory.tradable.length - 1 && selectedType == "tradable")
					selected = character.inventory.tradable.length - 1;

				if (character.inventory.consumable.length == 0 && selectedType == "consumable") {
					selected = 0;
					selectedType = "equippable";
				}
					
				if (character.inventory.equippable.length == 0 && selectedType == "equippable") {
					selected = 0;
					selectedType = "tradable";
				}
					
				if (character.inventory.tradable.length == 0 && selectedType == "tradable") {
					selected = 0;
					selectedType = "consumable"
				}

				msg.edit(module.exports.getInvent(client, character, selected, selectedType));
			}

			if (messageReaction.emoji.name === client.reactions.doubleDown) {
				if (selectedType == "consumable") {
					selected = 0;
					selectedType = "equippable";
				} else if (selectedType == "equippable") {
					selected = 0;
					selectedType = "tradable";
				} else if (selectedType == "tradable")
					selected = character.inventory.tradable.length - 1;

				if (character.inventory.consumable.length == 0 && selectedType == "consumable") {
					selected = 0;
					selectedType = "equippable";
				}
					
				if (character.inventory.equippable.length == 0 && selectedType == "equippable") {
					selected = 0;
					selectedType = "tradable";
				}
					
				if (character.inventory.tradable.length == 0 && selectedType == "tradable") {
					selected = 0;
					selectedType = "consumable"
				}
					
				msg.edit(module.exports.getInvent(client, character, selected, selectedType));
			}

			// Clicking the cyclone reaction will use the selected consumable
			if (messageReaction.emoji.name === client.reactions.use) {
				if (selectedType == "consumable") {
					var found = false;
					for (var i = 0; i < character.inventory.consumable.length; i++) {
						var tempName = character.inventory.consumable[i].name;
						var tempHeal = character.inventory.consumable[i].heal;
						var selectedName = character.inventory.consumable[selected].name;
						if (tempName.toUpperCase() == selectedName.toUpperCase()) {
							found = true;
							character.inventory.consumable[i].count--;
							if (character.inventory.consumable[i].count <= 0) {
								character.inventory.consumable.splice(i, 1);
								selected--;
							}
							client.charFuncs.heal(client, message.author.id, character, tempHeal);
							
							if (character.inventory.consumable.length == 0 && selectedType == "consumable") {
								selected = 0;
								selectedType = "equippable";
							}
							
							if (character.inventory.equippable.length == 0 && selectedType == "equippable") {
								selected = 0;
								selectedType = "tradable";
							}
							
							if (character.inventory.tradable.length == 0 && selectedType == "tradable") {
								selected = 0;
								selectedType = "consumable"
							}

							msg.edit(module.exports.getInvent(client, character, selected, selectedType));
						}
					}
					if (found == false) message.reply("You don't have " + selectedName);
				} else {
					message.reply("You cannot use this item.");
				}
			}

			// Clicking the arrow heading down reaction will equip an equippable
			if (messageReaction.emoji.name === client.reactions.equip) {
				if (selectedType == "equippable") {
					var selectedName = character.inventory.equippable[selected].name;
					var found = false;
					character.inventory.equippable.forEach(element => {
						if (element.name.toUpperCase() == selectedName.toUpperCase()) {
							element.equipped = !element.equipped;
							character.dam = element.equipped ? character.dam + element.dam
								: character.dam - element.dam;
							found = true;
							client.charFuncs.saveCharacter(client, message.author.id, character);
							msg.edit(module.exports.getInvent(client, character, selected, selectedType));
						}
					});
					if (found == false) message.reply("You don't own a " + selectedName);
				} else {
					message.reply("You cannot equip this item.");
				}
			}

			// Get the index of the page by button pressed
			const pageIndex = buttons.indexOf(messageReaction.emoji.name);
			// Return if emoji is irrelevant or the page doesn't exist (number too high)
			if (pageIndex == -1) return;

			const notBot = messageReaction.users.filter(clientUser => clientUser !== client.user).first();
			await messageReaction.remove(notBot);
		});
	}).catch(err => {
		console.log(err);
		message.react(client.reactions.error);
	});
	message.delete();
}

// Function to compile character inventory data into a formatted string
module.exports.getInvent = (client, character, selected, selectedType) => {
	var consumable = character.inventory.consumable;
	var equippable = character.inventory.equippable;
	var tradable = character.inventory.tradable;

	var consumableTemps = "";
	var equippableTemps = "";
	var tradableTemps = "";

	if (selected < 0) selected = 0;

	for (var i = 0; i < consumable.length; i++) {
		if (selectedType === "consumable" && consumable[i].name == character.inventory.consumable[selected].name) {
			consumableTemps += ">\t" + module.exports.padNumber(consumable[i].count) + "\t" + consumable[i].name.padEnd(20, " ")
				+ "Value: " + module.exports.padNumber(consumable[i].val) + "\t+" + consumable[i].heal + "HP" + "\n";
		} else {
			consumableTemps += " \t" + module.exports.padNumber(consumable[i].count) + "\t" + consumable[i].name.padEnd(20, " ")
				+ "Value: " + module.exports.padNumber(consumable[i].val) + "\t+" + consumable[i].heal + "HP" + "\n";
		}
	}

	for (var i = 0; i < equippable.length; i++) {
		if (selectedType === "equippable" && equippable[i].name == character.inventory.equippable[selected].name) {
			equippableTemps += ">\t" + module.exports.padNumber(equippable[i].count) + "\t" + equippable[i].name.padEnd(20, " ")
				+ "Value: " + module.exports.padNumber(equippable[i].val)
				+ "\tDam: " + equippable[i].dam
				+ "\tEquipped: " + equippable[i].equipped + "\n";
		} else {
			equippableTemps += " \t" + module.exports.padNumber(equippable[i].count) + "\t" + equippable[i].name.padEnd(20, " ")
				+ "Value: " + module.exports.padNumber(equippable[i].val)
				+ "\tDam: " + equippable[i].dam
				+ "\tEquipped: " + equippable[i].equipped + "\n";
		}
	}

	for (var i = 0; i < tradable.length; i++) {
		if (selectedType === "tradable" && tradable[i].name == character.inventory.tradable[selected].name) {
			tradableTemps += ">\t" + module.exports.padNumber(tradable[i].count) + "\t" + tradable[i].name.padEnd(20, " ")
				+ "Value: " + module.exports.padNumber(tradable[i].val) + "\n";
		} else {
			tradableTemps += " \t" + module.exports.padNumber(tradable[i].count) + "\t" + tradable[i].name.padEnd(20, " ")
				+ "Value: " + module.exports.padNumber(tradable[i].val) + "\n";
		}
	}

	var invent = client.config.block + "Consumables:\n" +
		(consumableTemps !== "" ?
			(consumableTemps) : "None.\n") + "\nEquippables:\n" +
		(equippableTemps !== "" ?
			(equippableTemps) : "None.\n") + "\nTradables:\n" +
		(tradableTemps !== "" ?
			(tradableTemps) : "None.\n") + "\n\nCommands:\n" + client.reactions.use + "-Use Consumable\t" + client.reactions.equip + "-Equip Equippable"
		+ client.config.block + "\n";

	return invent;
};

// Function to pad a number with a prefix of 0 if it is below 10
module.exports.padNumber = (number) => {
	return number > 9 ? "" + number : "0" + number;
};