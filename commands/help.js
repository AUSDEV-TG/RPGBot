/*
Help Command
Author: Tom Green
Date Created: 20/10/2019 
*/

module.exports = {
	name: "help",
	description: "Get command help.",
	syntax: `~help`,
	usage: [
		'~help - Displays command help.',
	],
};

module.exports.run = (client, message, args) => {
	// Define the buttons to be used to navigate the help pages.
	const buttons = [
		client.reactions.zero, client.reactions.one,
		client.reactions.two, client.reactions.three,
		client.reactions.four, client.reactions.five,
		client.reactions.six, client.reactions.seven,
		client.reactions.eight, client.reactions.nine,
	];
	
	// Define a constant integer to determine how many commands are allowed to appear on one page (in this case: 3).
	const commandsPerPage = 3;
	let pages; // Initialise the 'pages' variable.

	// commands variable to store an array of commands.
	var commands = []; 

	/*
	If the argument '-a' is used, push each command to the commands array.
	otherwise, only push non-developer commands to the commands array.
	*/
	if (args[0] === "-a") {
		client.commands.forEach((value, key, map) => {
			commands.push(value);
		});
	} else {
		client.commands.forEach((value, key, map) => {
			if (value.name !== "destroy" && value.name !== "devcombat" 
				&& value.name !== "devxp" && value.name !== "kms" 
				&& value.name !== "mapgen" && value.name !== "reload"
				&& value.name !== "todo") {
				commands.push(value);
			}				
		});
	}


	/*
	As with the graves command, the pages definition and
	pages.map lambda below were borrowed from KMCGamer.
	You can see his code at: 
	https://github.com/KMCGamer/usc_bot/blob/master/commands/help.js
	*/
	
	// Chunk the commands array into equal arrays containing 3 commands and store them in the pages variable.
	pages = client._.chunk(commands, commandsPerPage);

	pages = pages.map((page) => {
		const fields = page.map(command => ({
			name: `__${command.name}__`,
			value: `Description: ${command.description}\nSyntax: \`${command.syntax}\``,
		}));
	  			  			
		return {
	 		embed: {
				title: "Help",
				color: 12388653,
				author: {
	  				name: 'RPGBot',
	   				icon_url: 'https://cdn.discordapp.com/app-icons/635414349778911242/d1c1c411ce55669c39f4992051c0a901.png',
				},
				fields, // Here are the commands!
				timestamp: new Date(),
				footer: {
					icon_url: 'https://cdn.discordapp.com/app-icons/635414349778911242/d1c1c411ce55669c39f4992051c0a901.png',
				},
			},
		};
	});

	message.channel.send(pages[0]).then(async (msg) => {
		// Display number buttons
		for (const [index, _] of pages.entries()) {
			await msg.react(buttons[index]);
		}
	
		// Display the X button after the others.
			
		await msg.react(client.reactions.x);
		msg.delete(90000).catch();
	
		// Create collector to listen for button click
		const collector = msg.createReactionCollector((reaction, user) => user !== client.user);

		collector.on('collect', async (messageReaction) => {
			// If the x button is pressed, remove the message.
		    if (messageReaction.emoji.name === client.reactions.x) {
		    	msg.delete(); // Delete the message
		        collector.stop(); // Get rid of the collector.
		        return;
			}
				
		    // Get the index of the page by button pressed
		    const pageIndex = buttons.indexOf(messageReaction.emoji.name);
			// Return if emoji is irrelevant or the page doesnt exist (number too high)
	   		if (pageIndex == -1 || !pages[pageIndex]) return;
			
	   		// Edit the message to show the new page.
	   		msg.edit(pages[pageIndex]);
		
	  		const notbot = messageReaction.users.filter(clientuser => clientuser !== client.user).first();
	  		await messageReaction.remove(notbot);
   		});
	}).catch(err => console.log(err));
	message.delete();
};
