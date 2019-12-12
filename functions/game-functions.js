// Game functions
// Author: Tom Green
// Date Created: 12/11/2019

module.exports = {
	loadItems: function (client) {
		var path = "/home/pi/Bots/RPGBot/res/items.json";
		let rawdata = client.fs.readFileSync(path);
		let items = JSON.parse(rawdata);
		return items;
	},

	loadMonsters: function (client) {
		var path = "/home/pi/Bots/RPGBot/res/monsters.json";
		let rawdata = client.fs.readFileSync(path);
		let monsters = JSON.parse(rawdata);
		return monsters;	
	},

	engageCombat: function (client, message, character, monster) {
		var reactions = client.reactions;
		const buttons = [reactions.attack, reactions.run,];
		var run = false;
		var msg = client.config.block + "A " + monster.name
			+ "!" + "\tHP: " + monster.hp + "\tDam:" + monster.dam  
			+ "\nWhat will " + character.name + " do?\n" + client.reactions.attack +"-attack\t" + client.reactions.run 
			+ "-run\t" + client.config.block;

		const filter = m => m.content.startsWith(client.config.prefix) && m.author.id === message.author.id;

		message.channel.send(msg).then(async (msg) => {
			// Display number buttons
			await msg.react(buttons[0]);
			await msg.react(buttons[1]);
	
			msg.delete(20000).then(msg => {
				throw new Error('Time-Out');
			}).catch(err => {
				console.log(err);
				if (monster.hp > 0 && run === false) {
					if (monster.fatal === true) {
						message.reply(client.config.block + character.name 
							+ " couldn't defend against the " + monster.name 
							+ " and was killed...\nTook " + character.health + " HP damage." + client.config.block);
						client.charFuncs.takeDamage(client, message, message.author.id, character.health);
					} else {
						if (monster.dam != 0) {
							var dam = monster.dam * 2.5;
							message.reply(client.config.block + character.name 
								+ "'s Reaction time failed them...\n" + monster.name 
								+ " became enraged, thrashed " + character.name 
								+ " and fled. Took " + dam.toFixed(2) + " HP damage." + client.config.block);
							client.charFuncs.takeDamage(client, message, message.author.id, dam.toFixed(2));
						}
					}
				}		
			});
		
			// Create collector to listen for button click
			const collector = msg.createReactionCollector((reaction, user) => user !== client.user && user === message.author);
	
			collector.on('collect', async (messageReaction) => {
				if (messageReaction.emoji.name === reactions.attack) {
					monster.hp -= character.dam;
					if (monster.hp <= 0) {
						msg.edit(client.config.block + character.name
							+ " killed the " + monster.name + ". +" 
						 	+ monster.xp + "XP." + client.config.block);
						client.charFuncs.addXP(client, message, character, monster.xp);
						msg.delete(2000).catch();
						collector.stop();
					} else {
						if (monster.dam !== 0) {
							monster.dam *= 0.8;
							msg.edit(client.config.block + character.name 
								+ " injured the " + monster.name 
								+ " but it attacked back. Took " + monster.dam.toFixed(2) + " HP damage.\nIt now has " 
								+ monster.hp + "HP left" 
								+ client.reactions.attack +"-attack\t" 
								+ client.reactions.run + "-run\t" 
								+ client.config.block);
							client.charFuncs.takeDamage(client, message, message.author.id, monster.dam.toFixed(2));
						} else {
							msg.edit(client.config.block + character.name 
								+ " injured the " + monster.name + ".\n"
								+ client.reactions.attack +"-attack\t" 
								+ client.reactions.run + "-run\t" 
								+ client.config.block);
						}								
					}
				}

				if (messageReaction.emoji.name === reactions.run) {
					run = true;
					if (monster.dam !== 0) {
						msg.edit(client.config.block + "The " 
							+ monster.name  + " hit you but you managed to escape. Took " 
							+ monster.dam.toFixed(2) + " HP damage." + client.config.block);
						client.charFuncs.takeDamage(client, message, message.author.id, monster.dam.toFixed(2));
					} else {
						msg.edit(client.config.block + character.name  
							+ " has escaped." + client.config.block);
					}
					msg.delete(2000).catch();
					collector.stop();
				}
						
			    // Get the index of the page by button pressed
			    const pageIndex = buttons.indexOf(messageReaction.emoji.name);
				// Return if emoji is irrelevant or the page doesnt exist (number too high)
		   		if (pageIndex === -1) return;
			
		  		const notbot = messageReaction.users.filter(clientuser => clientuser !== client.user).first();
		  		await messageReaction.remove(notbot);
	   		});
		}).catch(err => console.log(err));
	},

	shop: function (client, message) {
		message.reply("WIP... Try again later");
	},

	property: function (client, message) {
		message.reply("WIP... Try again later");
	},

	explore: function (client, message) {
		message.reply("WIP... Try again later");
	},

	camp: function (client, message) {
		message.reply("WIP... Try again later");
	},

	hike: function (client, message) {
		message.reply("WIP... Try again later");
	},

	fish: function (client, message) {		
		var consumables = client.items.consumable;
		var fish = consumables[1];
		
		client.charFuncs.addItem(client, message, fish, "consumable", 5);
		message.reply("Caught 1 " + fish.name + ". +5XP.");
	},

	dive: function (client, message) {
		message.reply("WIP... Try again later");
	},

	hunt: function (client, message) {
		message.reply("WIP... Try again later");
	},

	gather: function (client, message) {
		let items = module.exports.loadItems(client);

		var consumables = items.consumable;
		var gather = consumables[0];
		
		client.charFuncs.addItem(client, message, gather, "consumable", 2);
		message.reply("Gathered 1 " + gather.name + ". +2XP.");
	},

	lumber: function (client, message) {
		message.reply("WIP... Try again later");
	}
}