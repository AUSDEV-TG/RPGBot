// Interact command
// Author: Tom Green
// Date Created: 12/11/2019

module.exports = {
	name: "interact",
	syntax: `~interact`,
	description: 'Allows the character to interact with the location they are at.',
	usage: [
		"~interact - Initiates location interaction.",
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

    var reactions = client.reactions;

    var map = mapSave.map;
    const buttons = [
    	reactions.shop, reactions.property, reactions.explore, 
    	reactions.camp, reactions.hike, reactions.fish, reactions.dive, 
    	reactions.hunt, reactions.gather, reactions.lumber];

	if (map[character.posY][character.posX] == '⌂') {
		var msg = client.config.block + "Village:\n" + reactions.shop + "-Shop\t" + reactions.property + "-Property\t" 
			+ client.config.block;

		message.channel.send(msg).then(async (msg) => {
			// Display number buttons
			await msg.react(buttons[0]);
			await msg.react(buttons[1]);
	
			await msg.react(reactions.x);
			msg.delete(60000).catch();
						
			// Create collector to listen for button click
			const collector = msg.createReactionCollector((reaction, user) => user !== client.user && user === message.author);
				
			collector.on('collect', async (messageReaction) => {
				// If the x button is pressed, remove the message.
				if (messageReaction.emoji.name === reactions.x) {
				   	msg.delete(); // Delete the message
				    collector.stop(); // Get rid of the collector.
				    return;
				}

				if (messageReaction.emoji.name === reactions.shop) {
					client.gameFuncs.shop(client, message);
				}

				if (messageReaction.emoji.name === reactions.property) {
					client.gameFuncs.property(client, message);
				}

				// Get the index of the page by button pressed
				const pageIndex = buttons.indexOf(messageReaction.emoji.name);
				// Return if emoji is irrelevant or the page doesnt exist (number too high)
				if (pageIndex === -1) return;
								
				const notbot = messageReaction.users.filter(clientuser => clientuser !== client.user).first();
				await messageReaction.remove(notbot);
			});
		}).catch(err => {
			console.log(err)
			msg.edit("There was an error");
			return;
		});
	}

	if (map[character.posY][character.posX] === '¿') {
		var msg = client.config.block + "Ruin:\n" + reactions.explore + "-Explore\t"
					+ client.config.block;
	
		message.channel.send(msg).then(async (msg) => {
			// Display number buttons
			await msg.react(buttons[2]);
			
			await msg.react(reactions.x);
			msg.delete(60000).catch();
								
			// Create collector to listen for button click
			const collector = msg.createReactionCollector((reaction, user) => user !== client.user && user === message.author);
				
			collector.on('collect', async (messageReaction) => {
				// If the x button is pressed, remove the message.
				if (messageReaction.emoji.name === reactions.x) {
				   	msg.delete(); // Delete the message
				    collector.stop(); // Get rid of the collector.
				    return;
				}
		
				if (messageReaction.emoji.name === reactions.explore) {
					client.gameFuncs.explore(client, message);
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
	}
	
	if (map[character.posY][character.posX] == '^') {
		var msg = client.config.block + "Mountain:\n" + reactions.camp + "-Camp\t" + reactions.hike + "-Hike\t"
			+ client.config.block;

		message.channel.send(msg).then(async (msg) => {
			// Display number buttons
			await msg.react(buttons[3]);
			await msg.react(buttons[4]);
					
			await msg.react(reactions.x);
			msg.delete(60000).catch();
										
			// Create collector to listen for button click
			const collector = msg.createReactionCollector((reaction, user) => user !== client.user && user === message.author);
						
			collector.on('collect', async (messageReaction) => {
				// If the x button is pressed, remove the message.
				if (messageReaction.emoji.name === reactions.x) {
				   	msg.delete(); // Delete the message
				    collector.stop(); // Get rid of the collector.
				    return;
				}
				
				if (messageReaction.emoji.name === reactions.camp) {
					client.gameFuncs.camp(client, message);
				}

				if (messageReaction.emoji.name === reactions.hike) {
					client.gameFuncs.hike(client, message);
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
	}
	
	if (map[character.posY][character.posX] == '~') {
		var msg = client.config.block + "Water:\n" + reactions.fish + "-Fish\t" + reactions.dive + "-Dive\t"
			+ client.config.block;

		message.channel.send(msg).then(async (msg) => {
			// Display number buttons
			await msg.react(buttons[5]);
			await msg.react(buttons[6]);
							
			await msg.react(reactions.x);
			msg.delete(60000).catch();
												
			// Create collector to listen for button click
			const collector = msg.createReactionCollector((reaction, user) => user !== client.user && user === message.author);
								
			collector.on('collect', async (messageReaction) => {
				// If the x button is pressed, remove the message.
				if (messageReaction.emoji.name === reactions.x) {
				   	msg.delete(); // Delete the message
				    collector.stop(); // Get rid of the collector.
				    return;
				}
					
				if (messageReaction.emoji.name === reactions.fish) {
					client.gameFuncs.fish(client, message);
				}
		
				if (messageReaction.emoji.name === reactions.dive) {
					client.gameFuncs.dive(client, message);
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
	}
	
	if (map[character.posY][character.posX] == '‡') {
		var msg = client.config.block + "Forest:\n" + reactions.hunt + "-Hunt\t" + reactions.gather  
			+ "-Gather\t" + reactions.lumber + "-Lumber\t"
			+ client.config.block;	

		message.channel.send(msg).then(async (msg) => {
			// Display number buttons
			await msg.react(buttons[7]);
			await msg.react(buttons[8]);
			await msg.react(buttons[9]);
									
			await msg.react(reactions.x);
			msg.delete(60000).catch();
														
			// Create collector to listen for button click
			const collector = msg.createReactionCollector((reaction, user) => user !== client.user && user === message.author);
										
			collector.on('collect', async (messageReaction) => {
				// If the x button is pressed, remove the message.
				if (messageReaction.emoji.name === reactions.x) {
				   	msg.delete(); // Delete the message
				    collector.stop(); // Get rid of the collector.
				    return;
				}
							
				if (messageReaction.emoji.name === reactions.hunt) {
					client.gameFuncs.hunt(client, message);
				}
				
				if (messageReaction.emoji.name === reactions.gather) {
					client.gameFuncs.gather(client, message);
				}

				if (messageReaction.emoji.name === reactions.lumber) {
					client.gameFuncs.lumber(client, message);
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
	}
	message.delete();
}