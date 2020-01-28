/*
Game Functions
Author: Tom Green
Date Created: 12/11/2019
*/

module.exports = {
	/*
	engageCombat function, which is used to engage 
	combat between and character and a monster.
	*/
	engageCombat: function (client, message, character, monster) {
		var reactions = client.reactions;
		const buttons = [reactions.attack, reactions.run,];
		var run = false;
		var msg = client.config.block + "A " + monster.name
			+ "!" + "\tHP: " + monster.hp + "\tDam:" + monster.dam
			+ "\nWhat will " + character.name + " do?\n" + client.reactions.attack + "-attack\t" + client.reactions.run
			+ "-run\t" + client.config.block;

		message.channel.send(msg).then(async (msg) => {
			// Display number buttons
			await msg.react(buttons[0]);
			await msg.react(buttons[1]);

			msg.delete(20000).then(msg => {
				throw new Error('Time-Out');
			}).catch(err => {
				console.log(err);
				if (monster.hp > 0 && run === false) {
					if (monster.fatal == true) {
						message.reply(client.config.block + character.name
							+ " couldn't defend against the " + monster.name
							+ " and was killed...\nTook " + character.health + " HP damage." + client.config.block);
						client.charFuncs.takeDamage(client, message, message.author.id, character, character.health);
					} else {
						if (monster.dam != 0) {
							var dam = monster.dam * 2.5;
							message.reply(client.config.block + character.name
								+ "'s Reaction time failed them...\n" + monster.name
								+ " became enraged, thrashed " + character.name
								+ " and fled. Took " + dam.toFixed(2) + " HP damage." + client.config.block);
							client.charFuncs.takeDamage(client, message, message.author.id, character, dam.toFixed(2));
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

						// Get rewards from the monster and add them to inventory
						var rewards = module.exports.getRewards(client, monster.rewards);

						var gainedXP;

						if (rewards.length != 0)
							gainedXP = monster.xp / rewards.length;

						rewards.forEach(reward => {
							if (typeof reward.heal !== 'undefined') {
								client.charFuncs.addItem(client, message, character, reward, "consumable", gainedXP);
							}

							if (typeof reward.dam !== 'undefined') {
								client.charFuncs.addItem(client, message, character, reward, "equippable", gainedXP);
							}

							if (!reward.heal && !reward.dam) {
								client.charFuncs.addItem(client, message, character, reward, "tradable", gainedXP);
							}
<<<<<<< HEAD

							message.reply(character.name + " got " + reward.count + " " + reward.name + ".");
=======
>>>>>>> a431db11e4a36d9d8bcdc43ff519d5eab795b108
						});

						if (!rewards) {
							client.charFuncs.addXp(client, message, character, monster.xp);
						}

						msg.delete(2000).catch();
						collector.stop();
					} else {
						if (monster.dam != 0) {
							monster.dam *= 0.8;
							msg.edit(client.config.block + character.name
								+ " injured the " + monster.name
								+ " but it attacked back. Took " + monster.dam.toFixed(2) + " HP damage.\nIt now has "
								+ monster.hp + "HP left"
								+ client.reactions.attack + "-attack\t"
								+ client.reactions.run + "-run\t"
								+ client.config.block);
							client.charFuncs.takeDamage(client, message, message.author.id, character, monster.dam.toFixed(2));
						} else {
							msg.edit(client.config.block + character.name
								+ " injured the " + monster.name + ".\n"
								+ client.reactions.attack + "-attack\t"
								+ client.reactions.run + "-run\t"
								+ client.config.block);
						}
					}
				}

				if (messageReaction.emoji.name === reactions.run) {
					run = true;
					if (monster.dam != 0) {
						msg.edit(client.config.block + "The "
							+ monster.name + " hit you but you managed to escape. Took "
							+ monster.dam.toFixed(2) + " HP damage." + client.config.block);
						client.charFuncs.takeDamage(client, message, message.author.id, character, monster.dam.toFixed(2));
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
				if (pageIndex == -1) return;

				const notbot = messageReaction.users.filter(clientuser => clientuser !== client.user).first();
				await messageReaction.remove(notbot);
			});
		}).catch(err => console.log(err));
	},

	getRewards: function (client, rewardType) {
		var rewards = [];
		if (rewardType == "squirrel") {
			rewards = new Array(2);
			rewards[0] = client.items.consumable[3]; // Steak
			rewards[1] = client.items.tradable[1]; // Squirrel Pelt
		} else if (rewardType == "wolf") {
			rewards = new Array(2);
			rewards[0] = client.items.consumable[3]; // Steak
			rewards[1] = client.items.tradable[2]; // Wolf Pelt
		} else if (rewardType == "bandit") {
			rewards = new Array(3);
			rewards[0] = client.items.consumable[5]; // Potion
			rewards[1] = client.items.equippable[1]; // Dagger
			rewards[2] = client.items.tradable[0]; // Money
		} else if (rewardType == "fish") {
			rewards = new Array(1);
			rewards[0] = client.items.consumable[2]; // Fish
		} else if (rewardType == "leech") {
			rewards = new Array(1);
			rewards[0] = client.items.consumable[1]; // Blood Sack
		} else if (rewardType == "shark") {
			rewards = new Array(2);
			rewards[0] = client.items.consumable[2]; // Fish
			rewards[1] = client.items.tradable[4]; // Shark Tooth
		} else if (rewardType == "goat") {
			rewards = new Array(2);
			rewards[0] = client.items.consumable[3]; // Steak
			rewards[1] = client.items.tradable[3]; // Goat Horn
		} else if (rewardType == "golem") {
			rewards = new Array(4);
			rewards[0] = client.items.tradable[5]; // Pearl
			rewards[1] = client.items.tradable[6]; // Silver Bar
			rewards[2] = client.items.tradable[7]; // Gold Bar
			rewards[3] = client.items.tradable[8]; // Diamond Bar
		} else if (rewardType == "fruit") {
			rewards = new Array(1);
			rewards[0] = client.items.consumable[0]; // Apple
		} else if (rewardType == "skeleton") {
			rewards = new Array(1);
			rewards[0] = client.items.equippable[2]; // Bone Club
		} else if (rewardType == "spectre") {
			rewards = new Array(1);
			rewards[0] = client.items.tradable[9]; // Ectoplasm
		} else if (rewardType == "chicken") {
			rewards = new Array(1);
			rewards[0] = client.items.consumable[3]; // Steak
		} else if (rewardType == "spaghetti") {
			rewards = new Array(1);
			rewards[0] = client.items.consumable[4]; // Spaghetti
		} else if (rewardType == "cultist") {
			rewards = new Array(1);
			rewards[0] = client.items.equippable[6]; // Occult Staff
		} else if (rewardType == "demon") {
			rewards = new Array(1);
			rewards[0] = client.items.consumable[7]; // Demon Blade
		} else if (rewardType == "mutant") {
			rewards = new Array(1);
			rewards[0] = client.items.consumable[3]; // Steak
		}

		return rewards;
	},

	shop: function (client, message, character) {
		message.reply("WIP... Try again later");
	},

	property: function (client, message, character) {
		message.reply("WIP... Try again later");
	},

	explore: function (client, message, character) {
		message.reply("WIP... Try again later");
	},

	camp: function (client, message, character) {
<<<<<<< HEAD
		client.charFuncs.heal(client, message.author.id, character, 10);
		message.reply(character.name + " camped out and healed for 10HP.");
		client.charFuncs.addAchievement(client, message, "Happy Camper");

		if (Math.floor(Math.random() * 10) % 3 == 0) {
			// Initialise the variable rand with a floored random number based upon the length of the forest array contained in the monsters.json file.
			var rand = Math.floor(Math.random() * client.monsters.forest.length);

			// Run the initialise combat function to begin combat using the random forest monster.
			module.exports.engageCombat(client, message, character, client.monsters.forest[rand]);
		}
=======
		message.reply("WIP... Try again later");
>>>>>>> a431db11e4a36d9d8bcdc43ff519d5eab795b108
	},

	hike: function (client, message, character) {
		message.reply("WIP... Try again later");
	},

	fish: function (client, message, character) {
		client.charFuncs.addItem(client, message, character, client.items.consumable[2], "consumable", 5);
		message.reply("Caught 1 " + character, client.items.consumable[2].name + ". +5XP.");
<<<<<<< HEAD
		client.charFuncs.addAchievement(client, message, "First Fish");

		if (Math.floor(Math.random() * 10) % 4 == 0) {
			// Initialise the variable rand with a floored random number based upon the length of the water array contained in the monsters.json file.
			var rand = Math.floor(Math.random() * client.monsters.water.length);

			// Run the initialise combat function to begin combat using the random water monster.
			module.exports.engageCombat(client, message, character, client.monsters.water[rand]);
		}
=======
>>>>>>> a431db11e4a36d9d8bcdc43ff519d5eab795b108
	},

	dive: function (client, message, character) {
		message.reply("WIP... Try again later");
	},

	hunt: function (client, message, character) {
<<<<<<< HEAD
		message.reply(character.name + " is looking for game...");

		if (Math.floor(Math.random() * 10) % 3 == 0) {
			// Initialise the variable rand with a floored random number based upon the length of the forest array contained in the monsters.json file.
			var rand = Math.floor(Math.random() * client.monsters.forest.length);

			// Run the initialise combat function to begin combat using the random forest monster.
			module.exports.engageCombat(client, message, character, client.monsters.forest[rand]);
		} else {
			message.reply("There is no game around at the moment.");
		}
=======
		message.reply("WIP... Try again later");
>>>>>>> a431db11e4a36d9d8bcdc43ff519d5eab795b108
	},

	gather: function (client, message, character) {
		client.charFuncs.addItem(client, message, character, client.items.consumable[0], "consumable", 2);
		message.reply("Gathered 1 " + client.items.consumable[0].name + ". +2XP.");
<<<<<<< HEAD
	
		if (Math.floor(Math.random() * 10) % 5 == 0) {
			// Initialise the variable rand with a floored random number based upon the length of the forest array contained in the monsters.json file.
			var rand = Math.floor(Math.random() * client.monsters.forest.length);

			// Run the initialise combat function to begin combat using the random forest monster.
			module.exports.engageCombat(client, message, character, client.monsters.forest[rand]);
		}
=======
>>>>>>> a431db11e4a36d9d8bcdc43ff519d5eab795b108
	},

	lumber: function (client, message, character) {
		message.reply("WIP... Try again later");
	}
}