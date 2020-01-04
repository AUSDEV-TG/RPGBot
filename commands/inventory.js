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
		console.log(error);
		return message.reply("You must create a character to use that command.");
	}

	var reactions = client.reactions;
	const buttons = [
		reactions.up, reactions.down,
		reactions.use, reactions.equip,];

	var selected = 0;
	var selectedType = "consumable";

	var invent = module.exports.getInvent(client, character, selected, selectedType);

	message.channel.send(invent).then(async (msg) => {
		// Display buttons
			
		await msg.react(buttons[0]);
		await msg.react(buttons[1]);
		await msg.react(buttons[2]);
		await msg.react(buttons[3]);
		
		// Display X button after the others
					
		await msg.react(reactions.x);
		msg.delete(90000).catch();
			
		// Create collector to listen for button clicks
		const collector = msg.createReactionCollector((reaction, user) => user !== client.user && user === message.author);

		collector.on('collect', async (messageReaction) => {
			// If the x button is pressed, remove the message.
			if (messageReaction.emoji.name === reactions.x) {
		   		msg.delete(); // Delete the message
		    	collector.stop(); // Get rid of the collector.
		    	return;
			}

			if (messageReaction.emoji.name === reactions.up) {
				selected--;
				if (selected < 0 && selectedType === "consumable") selected = 0;
				if (selected < 0 && selectedType === "equippable") {
					selected = character.inventory.consumable.length - 1;
					selectedType = "consumable";
				}
				msg.edit(module.exports.getInvent(client, character, selected, selectedType));
			}

			if (messageReaction.emoji.name === reactions.down) {
				selected++;
				var totalItems = character.inventory.consumable.length + character.inventory.equippable.length - 2;
				if (selected > character.inventory.consumable.length - 1 && selectedType === "consumable")  {
					selected = 0;
					selectedType = "equippable";
				} else if (selected > totalItems) selected = totalItems;
				msg.edit(module.exports.getInvent(client, character, selected, selectedType));
			}
	
			if (messageReaction.emoji.name === reactions.use) {
				var found = false;
				for (var i = 0; i < character.inventory.consumable.length; i++) {
					var temp = character.inventory.consumable[i].name;
					var tempHeal = character.inventory.consumable[i].heal;
					var selectedName = character.inventory.consumable[selected].name;
								
					if (temp.toUpperCase() === selectedName.toUpperCase()) {
						found = true;
						character.inventory.consumable[i].count--;
						if (character.inventory.consumable[i].count <= 0) {
							character.inventory.consumable.splice(i, 1);
						}
										
						client.charFuncs.heal(client, message.author.id, character, tempHeal);
						message.reply("Used " + temp + ".");
						msg.edit(module.exports.getInvent(client, character, selected, selectedType));
					}
				}
				if (found == false) message.reply("You don't have " + selectedName);
			} 

				if (messageReaction.emoji.name === reactions.equip) {
					var selectedName = character.inventory.equippable[selected].name;
					// Create code to implement equipment systen
					var found = false;
					character.inventory.equippable.forEach(element => {
						if (element.name.toUpperCase() === selectedName.toUpperCase()) {
							element.equipped = !element.equipped;
							character.dam = element.equipped ? character.dam + element.dam 
								: character.dam - element.dam;
							found = true;
							client.charFuncs.saveCharacter(client, message.author.id, character);
							message.reply((element.equipped ? "Equipped " : "Unequipped ") + selectedName + ".");
							msg.edit(module.exports.getInvent(client, character, selected, selectedType));
					}
				});
				if (found == false) message.reply("You don't own a " + selectedName);
			}
						
			// Get the index of the page by button pressed
			const pageIndex = buttons.indexOf(messageReaction.emoji.name);
			// Return if emoji is irrelevant or the page doesnt exist (number too high)
			if (pageIndex === -1) return;
				
			const notbot = messageReaction.users.filter(clientuser => clientuser !== client.user).first();
			await messageReaction.remove(notbot);
		});
	}).catch(err => console.log(err));
	message.delete();
}

module.exports.getInvent = (client, character, selected, selectedType) => {	
	var consumable = character.inventory.consumable;
	var equippable = character.inventory.equippable;
	var tradable = character.inventory.tradable;
	
	var consumableTemps = "";
	var equippableTemps = "";
	var tradableTemps = "";

	for (var i = 0; i < consumable.length; i++) {
		if (selectedType === "consumable" && consumable[i].name === character.inventory.consumable[selected].name) {
			consumableTemps += ">\t" + consumable[i].count + "\t" + consumable[i].name
				+ "\t+" + consumable[i].heal + "HP\tValue: " + consumable[i].val + "\n";
		} else {
			consumableTemps += " \t" + consumable[i].count + "\t" + consumable[i].name
				+ "\t+" + consumable[i].heal + "HP\tValue: " + consumable[i].val + "\n";
		}
	}		
	
	for (var i = 0; i < equippable.length; i++) {
		if (selectedType === "equippable" && equippable[i].name === character.inventory.equippable[selected].name) {
			equippableTemps += ">\t" + equippable[i].count  + "\t" + equippable[i].name
				+ "\tDam: " + equippable[i].dam
				+ "\tEquipped: " + equippable[i].equipped + "\tValue: " + equippable[i].val +"\n";
		} else {
			equippableTemps += " \t" + equippable[i].count  + "\t" + equippable[i].name
				+ "\tDam: " + equippable[i].dam
				+ "\tEquipped: " + equippable[i].equipped + "\tValue: " + equippable[i].val +"\n";
		}
	}
	
	for (var i = 0; i < tradable.length; i++) {
		if (selectedType === "tradable" && tradable[i].name === character.inventory.tradable[selected].name) {
			tradableTemps += ">\t" + tradable[i].count + "\t" + tradable[i].name
				+ "\tValue: " + tradable[i].val;
		} else {
			tradableTemps += " \t" + tradable[i].count + "\t" + tradable[i].name
				+ "\tValue: " + tradable[i].val;
		}
	}
	
	var invent = client.config.block + "Consumables:\n" +
		(consumableTemps !== "" ?
			(consumableTemps)  : "None.\n") + "\nEquippables:\n" +
		(equippableTemps !== "" ?
			(equippableTemps) : "None.\n") + "\nTradables:\n" + 
		(tradableTemps !== "" ?
			(tradableTemps) : "None.\n") + "\n\nCommands:\n" + client.reactions.use  + "-Use Consumable\t" + client.reactions.equip + "-Equip Equippable"
			+ client.config.block  + "\n";

	return invent;
};