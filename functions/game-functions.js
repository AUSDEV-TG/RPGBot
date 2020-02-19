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
		var tempMonster = monster;
		var reactions = client.reactions;
		const buttons = [reactions.attack, reactions.run,];
		var run = false;
		var msg = client.config.block + "A " + tempMonster.name
			+ "!" + "\tHP: " + tempMonster.hp + "\tDam:" + tempMonster.dam
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
				if (tempMonster.hp > 0 && run === false) {
					if (tempMonster.fatal == true) {
						message.reply(client.config.block + character.name
							+ " couldn't defend against the " + tempMonster.name
							+ " and was killed...\nTook " + character.health + " HP damage." + client.config.block);
						client.charFuncs.takeDamage(client, message, character, character.health);
					} else {
						if (tempMonster.dam != 0) {
							var dam = tempMonster.dam * 2.5;
							message.reply(client.config.block + character.name
								+ "'s Reaction time failed them...\n" + tempMonster.name
								+ " became enraged, thrashed " + character.name
								+ " and fled. Took " + dam.toFixed(2) + " HP damage." + client.config.block);
							client.charFuncs.takeDamage(client, message, character, dam.toFixed(2));
						}
					}
				}
			});

			// Create collector to listen for button click
			const collector = msg.createReactionCollector((reaction, user) => user !== client.user && user === message.author);

			collector.on('collect', async (messageReaction) => {
				if (messageReaction.emoji.name === reactions.attack) {
					tempMonster.hp -= character.dam;
					if (tempMonster.hp <= 0) {
						msg.edit(client.config.block + character.name
							+ " killed the " + tempMonster.name + ". +"
							+ tempMonster.xp + "XP." + client.config.block);

						// Get rewards from the tempMonster and add them to inventory
						var rewards = module.exports.getRewards(client, tempMonster.rewards);

						var gainedXP;

						if (rewards.length != 0)
							gainedXP = tempMonster.xp / rewards.length;

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

							message.reply(character.name + " got " + reward.count + " " + reward.name + ".");
						});

						if (!rewards) {
							client.charFuncs.addXp(client, message, character, tempMonster.xp);
						}

						msg.delete(2000).catch();
						collector.stop();
					} else {
						if (tempMonster.dam != 0) {
							tempMonster.dam *= 0.8;
							msg.edit(client.config.block + character.name
								+ " injured the " + tempMonster.name
								+ " but it attacked back. Took " + tempMonster.dam.toFixed(2) + " HP damage.\nIt now has "
								+ tempMonster.hp + "HP left"
								+ client.reactions.attack + "-attack\t"
								+ client.reactions.run + "-run\t"
								+ client.config.block);
							client.charFuncs.takeDamage(client, message, character, tempMonster.dam.toFixed(2));
						} else {
							msg.edit(client.config.block + character.name
								+ " injured the " + tempMonster.name + ".\n"
								+ client.reactions.attack + "-attack\t"
								+ client.reactions.run + "-run\t"
								+ client.config.block);
						}
					}
				}

				if (messageReaction.emoji.name === reactions.run) {
					run = true;
					if (tempMonster.dam != 0) {
						msg.edit(client.config.block + "The "
							+ tempMonster.name + " hit you but you managed to escape. Took "
							+ tempMonster.dam.toFixed(2) + " HP damage." + client.config.block);
						client.charFuncs.takeDamage(client, message, character, tempMonster.dam.toFixed(2));
					} else {
						msg.edit(client.config.block + character.name
							+ " has escaped." + client.config.block);
					}
					msg.delete(2000).catch();
					collector.stop();
				}

				// Get the index of the page by button pressed
				const pageIndex = buttons.indexOf(messageReaction.emoji.name);
				// Return if emoji is irrelevant or the page doesn't exist (number too high)
				if (pageIndex == -1) return;

				const notBot = messageReaction.users.filter(clientUser => clientUser !== client.user).first();
				await messageReaction.remove(notBot);
			});
		}).catch(err => console.log(err));
	},

	getRewards: function (client, rewardType) {
		var rewards = [];
		if (rewardType == "squirrel") {
			rewards = new Array(2);
			rewards[0] = client.items.consumable[3]; // Steak
			rewards[1] = client.items.tradable[2]; // Squirrel Pelt
		} else if (rewardType == "wolf") {
			rewards = new Array(2);
			rewards[0] = client.items.consumable[3]; // Steak
			rewards[1] = client.items.tradable[3]; // Wolf Pelt
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
			rewards[1] = client.items.tradable[5]; // Shark Tooth
		} else if (rewardType == "goat") {
			rewards = new Array(2);
			rewards[0] = client.items.consumable[3]; // Steak
			rewards[1] = client.items.tradable[4]; // Goat Horn
		} else if (rewardType == "golem") {
			rewards = new Array(4);
			rewards[0] = client.items.tradable[6]; // Pearl
			rewards[1] = client.items.tradable[7]; // Silver Bar
			rewards[2] = client.items.tradable[8]; // Gold Bar
			rewards[3] = client.items.tradable[9]; // Diamond Bar
		} else if (rewardType == "fruit") {
			rewards = new Array(1);
			rewards[0] = client.items.consumable[0]; // Apple
		} else if (rewardType == "skeleton") {
			rewards = new Array(1);
			rewards[0] = client.items.equippable[2]; // Bone Club
		} else if (rewardType == "spectre") {
			rewards = new Array(1);
			rewards[0] = client.items.tradable[10]; // Ectoplasm
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
		var shopHeaders = ["Buy", "Sell"];
		var selectedIndex = 0;

		const buttons = [client.reactions.up, client.reactions.down, client.reactions.enter,
			client.reactions.money, client.reactions.doubleUp, client.reactions.doubleDown];

		var msg = module.exports.getShopMenuHeaders(client, character, shopHeaders, selectedIndex);

		message.channel.send(msg).then(async (msg) => {
			// Display number buttons
			await msg.react(buttons[0]);
			await msg.react(buttons[1]);
			await msg.react(buttons[2]);

			await msg.react(client.reactions.x);
			msg.delete(90000).catch();

			// Create collector to listen for button click
			const collector = msg.createReactionCollector((reaction, user) => user !== client.user && user === message.author);

			collector.on('collect', async (messageReaction) => {
				// If the x button is pressed, remove the message.
				if (messageReaction.emoji.name === client.reactions.x) {
					msg.delete(); // Delete the message
					collector.stop(); // Get rid of the collector.
					return;
				}

				if (messageReaction.emoji.name === client.reactions.up) {
					if (selectedIndex > 0) {
						selectedIndex--;
						msg.edit(module.exports.getShopMenuHeaders(client, character, shopHeaders, selectedIndex));
					}
				}

				if (messageReaction.emoji.name === client.reactions.down) {
					if (selectedIndex < shopHeaders.length) {
						selectedIndex++;
						msg.edit(module.exports.getShopMenuHeaders(client, character, shopHeaders, selectedIndex));
					}
				}

				if (messageReaction.emoji.name === client.reactions.enter) {
					msg.delete(); // Delete the message
					collector.stop(); // Get rid of the collector.

					var selectedType = "consumable";

					var characterMoneyIndex;
					for (var i = 0; i < character.inventory.tradable.length; i++) {
						if (character.inventory.tradable[i].name == "Money")
							characterMoneyIndex = i;
					}
					
					if (selectedIndex == 0) {
						var consumables = [client.items.consumable[0], client.items.consumable[2],
							client.items.consumable[3], client.items.consumable[4], client.items.consumable[5],
							client.items.consumable[6], client.items.consumable[7], client.items.consumable[8]];

						var equippables = [client.items.equippable[0], client.items.equippable[1],
							client.items.equippable[2], client.items.equippable[3], client.items.equippable[4],
							client.items.equippable[5]];

						var tradables = [client.items.tradable[1], client.items.tradable[2], client.items.tradable[3],
							client.items.tradable[4], client.items.tradable[5], client.items.tradable[6],
							client.items.tradable[7], client.items.tradable[8], client.items.tradable[9],
							client.items.tradable[10]];

						var buyMsg = module.exports.getBuyMenu(client, character, characterMoneyIndex, consumables, equippables, tradables, selectedIndex, selectedType);

						message.channel.send(buyMsg).then(async (buyMsg) => {
							// Display number buttons
							await buyMsg.react(buttons[0]);
							await buyMsg.react(buttons[4]);
							await buyMsg.react(buttons[1]);
							await buyMsg.react(buttons[5]);
							await buyMsg.react(buttons[3]);

							await buyMsg.react(client.reactions.x);
							buyMsg.delete(90000).catch();

							// Create collector to listen for button click
							const collector = buyMsg.createReactionCollector((reaction, user) => user !== client.user && user === message.author);

							collector.on('collect', async (messageReaction) => {
								// If the x button is pressed, remove the message.
								if (messageReaction.emoji.name === client.reactions.x) {
									buyMsg.delete(); // Delete the message
									collector.stop(); // Get rid of the collector.
									return;
								}

								if (messageReaction.emoji.name === client.reactions.up) {
									selectedIndex--;
									if (selectedIndex < 0 && selectedType == "consumable") selectedIndex = 0;
									else if (selectedIndex < 0 && selectedType == "equippable") {
										selectedIndex = consumables.length - 1;
										selectedType = "consumable";
									}
									else if (selectedIndex < 0 && selectedType == "tradable") {
										selectedIndex = equippables.length - 1;
										selectedType = "equippable";
									}
									buyMsg.edit(module.exports.getBuyMenu(client, character, characterMoneyIndex, consumables, equippables, tradables, selectedIndex, selectedType));
								}

								if (messageReaction.emoji.name === client.reactions.doubleUp) {
									if (selectedType == "consumable")
										selectedIndex = 0;
									else if (selectedType == "equippable") {
										selectedIndex = 0;
										selectedType = "consumable";
									} else if (selectedType == "tradable") {
										selectedIndex = 0;
										selectedType = "equippable";
									}
									buyMsg.edit(module.exports.getBuyMenu(client, character, characterMoneyIndex, consumables, equippables, tradables, selectedIndex, selectedType));
								}

								if (messageReaction.emoji.name === client.reactions.down) {
									selectedIndex++;
									if (selectedIndex > consumables.length - 1 && selectedType == "consumable") {
										selectedIndex = 0;
										selectedType = "equippable";
									} else if (selectedIndex > equippables.length - 1 && selectedType == "equippable") {
										selectedIndex = 0;
										selectedType = "tradable";
									} else if (selectedIndex > tradables.length - 1 && selectedType == "tradable")
										selectedIndex = tradables.length - 1;

									buyMsg.edit(module.exports.getBuyMenu(client, character, characterMoneyIndex, consumables, equippables, tradables, selectedIndex, selectedType));
								}

								if (messageReaction.emoji.name === client.reactions.doubleDown) {
									if (selectedType == "consumable") {
										selectedIndex = 0;
										selectedType = "equippable";
									} else if (selectedType == "equippable") {
										selectedIndex = 0;
										selectedType = "tradable";
									} else if (selectedType == "tradable")
										selectedIndex = tradables.length - 1;
									buyMsg.edit(module.exports.getBuyMenu(client, character, characterMoneyIndex, consumables, equippables, tradables, selectedIndex, selectedType));
								}

								if (messageReaction.emoji.name === client.reactions.money) {
									var purchasedItem;

									if (selectedType == "consumable")
										purchasedItem = consumables[selectedIndex];
									else if (selectedType == "equippable")
										purchasedItem = equippables[selectedIndex];
									else if (selectedType == "tradable")
										purchasedItem = tradables[selectedIndex];

									if (characterMoneyIndex != null) {
										if (purchasedItem.value > character.inventory.tradable[characterMoneyIndex].count) {
											message.reply(character + " does not have enough money.");
										} else {
											character.inventory.tradable[characterMoneyIndex].count -= purchasedItem.value;
											client.charFuncs.addItem(client, message, character, purchasedItem, selectedType, 0);
										}
									}
									buyMsg.edit(module.exports.getBuyMenu(client, character, characterMoneyIndex, consumables, equippables, tradables, selectedIndex, selectedType));
								}

								// Get the index of the page by button pressed
								const pageIndex = buttons.indexOf(messageReaction.emoji.name);
								// Return if emoji is irrelevant or the page doesnt exist (number too high)
								if (pageIndex == -1) return;

								const notBot = messageReaction.users.filter(clientUser => clientUser !== client.user).first();
								await messageReaction.remove(notBot);
							});
						}).catch(err => console.log(err));
					} else if (selectedIndex == 1) {
						selectedIndex = 0;

						if (character.inventory.consumable.length == 0 && selectedType == "consumable") 
							selectedType = "equippable";
						
						if (character.inventory.equippable.length == 0 && selectedType == "equippable") 
							selectedType = "tradable";
						
						if (character.inventory.tradable.length == 0 && selectedType == "tradable")
							selectedType = "consumable"

						var sellMsg = module.exports.getSellMenu(client, character, selectedIndex, selectedType);

						message.channel.send(sellMsg).then(async (sellMsg) => {
							// Display number buttons
							await sellMsg.react(buttons[0]);
							await sellMsg.react(buttons[4]);
							await sellMsg.react(buttons[1]);
							await sellMsg.react(buttons[5]);
							await sellMsg.react(buttons[3]);

							await sellMsg.react(client.reactions.x);
							sellMsg.delete(90000).catch();

							// Create collector to listen for button click
							const collector = sellMsg.createReactionCollector((reaction, user) => user !== client.user && user === message.author);

							collector.on('collect', async (messageReaction) => {
								// If the x button is pressed, remove the message.
								if (messageReaction.emoji.name === client.reactions.x) {
									sellMsg.delete(); // Delete the message
									collector.stop(); // Get rid of the collector.
									return;
								}

								if (messageReaction.emoji.name === client.reactions.up) {
									selectedIndex--;
									if (selectedIndex < 0 && selectedType == "consumable") selectedIndex = 0;
									else if (selectedIndex < 0 && selectedType == "equippable") {
										selectedIndex = character.inventory.consumable.length - 1;
										selectedType = "consumable";
									}
									else if (selectedIndex < 0 && selectedType == "tradable") {
										selectedIndex = character.inventory.equippable.length - 1;
										selectedType = "equippable";
									}

									if (character.inventory.consumable.length == 0 && selectedType == "consumable") {
										selectedIndex = 0;
										selectedType = "equippable";
									}
									
									if (character.inventory.equippable.length == 0 && selectedType == "equippable") {
										selectedIndex = 0;
										selectedType = "tradable";
									}
									
									if (character.inventory.tradable.length == 0 && selectedType == "tradable") {
										selectedIndex = 0;
										selectedType = "consumable"
									}

									sellMsg.edit(module.exports.getSellMenu(client, character, selectedIndex, selectedType));
								}

								if (messageReaction.emoji.name === client.reactions.doubleUp) {
									if (selectedType == "consumable")
										selectedIndex = 0;
									else if (selectedType == "equippable") {
										selectedIndex = 0;
										selectedType = "consumable";
									} else if (selectedType == "tradable") {
										selectedIndex = 0;
										selectedType = "equippable";
									}

									if (character.inventory.consumable.length == 0 && selectedType == "consumable") {
										selectedIndex = 0;
										selectedType = "equippable";
									}
									
									if (character.inventory.equippable.length == 0 && selectedType == "equippable") {
										selectedIndex = 0;
										selectedType = "tradable";
									}
									
									if (character.inventory.tradable.length == 0 && selectedType == "tradable") {
										selectedIndex = 0;
										selectedType = "consumable"
									}

									sellMsg.edit(module.exports.getSellMenu(client, character, selectedIndex, selectedType));
								}

								if (messageReaction.emoji.name === client.reactions.down) {
									selectedIndex++;
									if (selectedIndex > character.inventory.consumable.length - 1 && selectedType == "consumable") {
										selectedIndex = 0;
										selectedType = "equippable";
									} else if (selectedIndex > character.inventory.equippable.length - 1 && selectedType == "equippable") {
										selectedIndex = 0;
										selectedType = "tradable";
									} else if (selectedIndex > character.inventory.tradable.length - 1 && selectedType == "tradable")
										selectedIndex = character.inventory.tradable.length - 1;

									if (character.inventory.consumable.length == 0 && selectedType == "consumable") {
										selectedIndex = 0;
										selectedType = "equippable";
									}
									
									if (character.inventory.equippable.length == 0 && selectedType == "equippable") {
										selectedIndex = 0;
										selectedType = "tradable";
									}
									
									if (character.inventory.tradable.length == 0 && selectedType == "tradable") {
										selectedIndex = 0;
										selectedType = "consumable"
									}

									sellMsg.edit(module.exports.getSellMenu(client, character, selectedIndex, selectedType));
								}

								if (messageReaction.emoji.name === client.reactions.doubleDown) {
									if (selectedType == "consumable") {
										selectedIndex = 0;
										selectedType = "equippable";
									} else if (selectedType == "equippable") {
										selectedIndex = 0;
										selectedType = "tradable";
									} else if (selectedType == "tradable")
										selectedIndex = character.inventory.tradable.length - 1;
									
									if (character.inventory.consumable.length == 0 && selectedType == "consumable") {
										selectedIndex = 0;
										selectedType = "equippable";
									}
									
									if (character.inventory.equippable.length == 0 && selectedType == "equippable") {
										selectedIndex = 0;
										selectedType = "tradable";
									}
									
									if (character.inventory.tradable.length == 0 && selectedType == "tradable") {
										selectedIndex = 0;
										selectedType = "consumable"
									}

									sellMsg.edit(module.exports.getSellMenu(client, character, selectedIndex, selectedType));
								}

								if (messageReaction.emoji.name === client.reactions.money) {
									var selectedItem;
									if (selectedType == "consumable") {
										selectedItem = character.inventory.consumable[selectedIndex];
										character.inventory.consumable[selectedIndex].count--;
										if (character.inventory.consumable[selectedIndex].count <= 0)
											character.inventory.consumable.splice(selectedIndex, 1);

										if (character.inventory.consumable.length == 0) {
											selectedIndex = 0;
											selectedType = "equippable";
										} else if (character.inventory.equippable.length == 0) {
											selectedIndex = 0;
											selectedType = "tradable";
										}
									} else if (selectedType == "equippable") {
										selectedItem = character.inventory.equippable[selectedIndex];
										character.inventory.equippable[selectedIndex].count--;
										if (character.inventory.equippable[selectedIndex].count <= 0)
											character.inventory.equippable.splice(selectedIndex, 1);
										
										if (character.inventory.equippable.length == 0) {
											selectedIndex = 0;
											selectedType = "tradable";
										}
										
										if (character.inventory.tradable.length == 0) {
											selectedIndex = 0;
											selectedType = "consumable";
										}
									} else if (selectedType == "tradable") {
										selectedItem = character.inventory.tradable[selectedIndex];
										character.inventory.tradable[selectedIndex].count--;
										if (character.inventory.tradable[selectedIndex].count <= 0)
											character.inventory.tradable.splice(selectedIndex, 1);
									
										if (character.inventory.tradable.length == 0) {
											selectedIndex = 0;
											selectedType = "consumable";
										}
										
										if (character.inventory.consumable.length == 0) {
											selectedIndex = 0;
											selectedType = "equippable";
										}
									}
									
									selectedItem.count = 1;

									character.inventory.tradable[characterMoneyIndex].count += module.exports.getSellValue(selectedItem);
									client.charFuncs.saveCharacter(client, message.author.id, character);
									sellMsg.edit(module.exports.getSellMenu(client, character, selectedIndex, selectedType));
								}

								// Get the index of the page by button pressed
								const pageIndex = buttons.indexOf(messageReaction.emoji.name);
								// Return if emoji is irrelevant or the page doesnt exist (number too high)
								if (pageIndex == -1) return;

								const notBot = messageReaction.users.filter(clientUser => clientUser !== client.user).first();
								await messageReaction.remove(notBot);
							});
						}).catch(err => console.log(err));
					}
				}

				// Get the index of the page by button pressed
				const pageIndex = buttons.indexOf(messageReaction.emoji.name);
				// Return if emoji is irrelevant or the page doesnt exist (number too high)
				if (pageIndex == -1) return;

				const notBot = messageReaction.users.filter(clientUser => clientUser !== client.user).first();
				await messageReaction.remove(notBot);
			});
		}).catch(err => console.log(err));
	},

	getShopMenuHeaders: function (client, character, headers, selectedIndex) {
		var msg = client.config.block + "Welcome to the village shop.\n" +
			"What would " + character.name + " like to do?\n\n";

		if (headers != null) {
			for (var i = 0; i < headers.length; i++) {
				if (i == selectedIndex)
					msg += ">   " + headers[i] + "\n";
				else
					msg += "\t" + headers[i] + "\n";
			}
		}

		msg += client.config.block;
		return msg;
	},

	getBuyMenu: function (client, character, moneyIndex, consumables, equippables, tradables, selectedIndex, selectedType) {
		var msg = client.config.block + "Items available:\t\t" + character.name + " owns " + ((moneyIndex != null) ? character.inventory.tradable[moneyIndex].count : 0) + " Gold.\n\n";

		// Must add important item stats to this string formatting block

		if (consumables != null) {
			msg += "Consumables\n\n";
			for (var i = 0; i < consumables.length; i++) {
				if (i == selectedIndex && selectedType == "consumable")
					msg += ">   " + consumables[i].name + "\tCosts: " + consumables[i].val + " Gold.\n";
				else
					msg += "\t" + consumables[i].name + "\tCosts: " + consumables[i].val + " Gold.\n";
			}
			msg += "\n";
		} else {
			msg += "No consumables available.\n\n";
		}

		if (equippables != null) {
			msg += "Equippables\n\n";
			for (var i = 0; i < equippables.length; i++) {
				if (i == selectedIndex && selectedType == "equippable")
					msg += ">   " + equippables[i].name + "\tCosts: " + equippables[i].val + " Gold.\n";
				else
					msg += "\t" + equippables[i].name + "\tCosts: " + equippables[i].val + " Gold.\n";
			}
			msg += "\n";
		} else {
			msg += "No equippables available.\n\n";
		}

		if (tradables != null) {
			msg += "Tradables\n\n";
			for (var i = 0; i < tradables.length; i++) {
				if (i == selectedIndex && selectedType == "tradable")
					msg += ">   " + tradables[i].name + "\tCosts: " + tradables[i].val + " Gold.\n";
				else
					msg += "\t" + tradables[i].name + "\tCosts: " + tradables[i].val + " Gold.\n";
			}
			msg += "\n";
		} else {
			msg += "No tradables available.\n\n";
		}

		msg += client.config.block;
		return msg;
	},

	getSellMenu: function (client, character, selectedIndex, selectedType) {
		var msg = client.config.block + character.name + "'s Inventory:\n\n";

		if (character.inventory.consumable.length != 0) {
			msg += "Consumables:\n\n";
			for (var i = 0; i < character.inventory.consumable.length; i++) {
				if (i == selectedIndex && selectedType == "consumable") {
					msg += ">   " + character.inventory.consumable[i].count + "\t" + character.inventory.consumable[i].name + "\tSell Value: "
						+ module.exports.getSellValue(character.inventory.consumable[i]) + " Gold.\n";
				} else {
					msg += "\t" + character.inventory.consumable[i].count + "\t" + character.inventory.consumable[i].name + "\tSell Value: "
						+ module.exports.getSellValue(character.inventory.consumable[i]) + " Gold.\n";
				}
			}
			msg += "\n";
		} else {
			msg += "No consumables in inventory.\n\n";
		}

		if (character.inventory.equippable.length != 0) {
			msg += "Equippables:\n\n";
			for (var i = 0; i < character.inventory.equippable.length; i++) {
				if (i == selectedIndex && selectedType == "equippable") {
					msg += ">   " + character.inventory.equippable[i].count + "\t" + character.inventory.equippable[i].name + "\tSell Value: "
						+ module.exports.getSellValue(character.inventory.equippable[i]) + " Gold.\n";
				} else {
					msg += "\t" + character.inventory.equippable[i].count + "\t" + character.inventory.equippable[i].count + character.inventory.equippable[i].name + "\tSell Value: "
						+ module.exports.getSellValue(character.inventory.equippable[i]) + " Gold.\n";
				}
			}
			msg += "\n";
		} else {
			msg += "No equippables in inventory.\n\n";
		}

		if (character.inventory.tradable.length != 0) {
			msg += "Tradables:\n\n";
			for (var i = 0; i < character.inventory.tradable.length; i++) {
				if (i == selectedIndex && selectedType == "tradable") {
					msg += ">   " + character.inventory.tradable[i].count + "\t" + character.inventory.tradable[i].name + "\tSell Value: "
						+ module.exports.getSellValue(character.inventory.tradable[i]) + " Gold.\n";
				} else {
					msg += "\t" + character.inventory.tradable[i].count + "\t" + character.inventory.tradable[i].name + "\tSell Value: "
						+ module.exports.getSellValue(character.inventory.tradable[i]) + " Gold.\n";
				}
			}
			msg += "\n";
		} else {
			msg += "No tradables in inventory.\n\n";
		}

		msg += client.config.block;
		return msg;
	},

	getSellValue: function (item) {
		var modifier = 0.8;
		if (item.name == "Money")
			modifier = 1;
		return parseInt(item.val * modifier);
	},

	property: function (client, message, character) {
		message.reply("WIP... Try again later");
	},

	explore: function (client, message, character) {
		message.reply("WIP... Try again later");
	},

	camp: function (client, message, character) {
		client.charFuncs.heal(client, message.author.id, character, 10);
		message.reply(character.name + " camped out and healed for 10HP.");
		client.charFuncs.addAchievement(client, message, "Happy Camper");

		if (Math.floor(Math.random() * 10) % 3 == 0) {
			// Initialise the variable rand with a floored random number based upon the length of the forest array contained in the monsters.json file.
			var rand = Math.floor(Math.random() * client.monsters.forest.length);

			// Run the engageCombat function to begin combat using the random forest monster.
			module.exports.engageCombat(client, message, character, client.monsters.forest[rand]);
		}
	},

	hike: function (client, message, character) {
		message.reply(character.name + " took a hike up the mountain...");

		if (Math.floor(Math.random() * 10) % 4 == 0) {
			// Assign the variable rand with a floored random number based upon the length of the mountain array contained in the monsters.json file.
			rand = Math.floor(Math.random() * client.monsters.mountain.length);

			// Run the engageCombat function to begin combat using the random mountain monster.
			module.exports.engageCombat(client, message, character, client.monsters.mountain[rand]);
		}
	},

	fish: function (client, message, character) {
		client.charFuncs.addItem(client, message, character, client.items.consumable[2], "consumable", 5);
		message.reply("Caught a " + client.items.consumable[2].name + ". +5XP.");
		client.charFuncs.addAchievement(client, message, "First Fish");

		if (Math.floor(Math.random() * 10) % 4 == 0) {
			// Initialise the variable rand with a floored random number based upon the length of the water array contained in the monsters.json file.
			var rand = Math.floor(Math.random() * client.monsters.water.length);

			// Run the engageCombat function to begin combat using the random water monster.
			module.exports.engageCombat(client, message, character, client.monsters.water[rand]);
		}
	},

	dive: function (client, message, character) {
		message.reply(character.name + " is diving into the depths...");
		client.charFuncs.addAchievement(client, message, "Scuba Diver");

		var rand = Math.floor(Math.random() * 10);

		if (rand % 2 == 0) {
			client.charFuncs.addItem(client, message, character, client.items.tradable[5], "tradable", 10);
			message.reply(character.name + " found a Shark Tooth!");
		} else if (rand % 4 == 0) {
			client.charFuncs.addItem(client, message, character, client.items.tradable[6], "tradable", 10);
			message.reply(character.name + " found a Pearl!");
		} else {
			message.reply("There is nothing in the depths...");
		}

		if (Math.floor(Math.random() * 10) % 4 == 0) {
			// Assign the variable rand with a floored random number based upon the length of the water array contained in the monsters.json file.
			rand = Math.floor(Math.random() * client.monsters.water.length);

			// Run the engageCombat function to begin combat using the random water monster.
			module.exports.engageCombat(client, message, character, client.monsters.water[rand]);
		}
	},

	hunt: function (client, message, character) {
		message.reply(character.name + " is looking for game...");

		if (Math.floor(Math.random() * 10) % 3 == 0) {
			// Initialise the variable rand with a floored random number based upon the length of the forest array contained in the monsters.json file.
			var rand = Math.floor(Math.random() * client.monsters.forest.length);

			// Run the engageCombat function to begin combat using the random forest monster.
			module.exports.engageCombat(client, message, character, client.monsters.forest[rand]);
		} else {
			message.reply("There is no game around at the moment.");
		}
	},

	gather: function (client, message, character) {
		client.charFuncs.addItem(client, message, character, client.items.consumable[0], "consumable", 2);
		message.reply("Gathered a " + client.items.consumable[0].name + ". +2XP.");

		if (Math.floor(Math.random() * 10) % 5 == 0) {
			// Initialise the variable rand with a floored random number based upon the length of the forest array contained in the monsters.json file.
			var rand = Math.floor(Math.random() * client.monsters.forest.length);

			// Run the engageCombat function to begin combat using the random forest monster.
			module.exports.engageCombat(client, message, character, client.monsters.forest[rand]);
		}
	},

	lumber: function (client, message, character) {
		client.charFuncs.addItem(client, message, character, client.items.tradable[1], "tradable", 5);
		message.reply(character.name + " cut down a tree.");
		client.charFuncs.addAchievement(client, message, "Lumberjack");

		if (Math.floor(Math.random() * 10) % 3 == 0) {
			// Run the engageCombat function to begin combat with a rabid squirrel.
			module.exports.engageCombat(client, message, character, client.monsters.forest[0]);
		}
	}
}