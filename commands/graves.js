//Grave command
//Author: Tom Green
//Date Created: 9/11/2019

module.exports = {
	name: "graves",
	syntax: `~graves`,
	description: 'Displays the graves of previous characters.',
	usage: [
		"~graves - Display the graves of previous characters..",
	],
};


module.exports.run = (client, message) => {
	try {
		var graves = client.charFuncs.loadGrave(client, message.author.id);
	} catch (error) {
		console.log(error);
		message.reply("You can't use this command until a character dies.");
		return;
	}

	var reactions = client.reactions;
	const buttons = [
		reactions.zero, reactions.one,
		reactions.two, reactions.three,
		reactions.four, reactions.five,
		reactions.six, reactions.seven,
		reactions.eight, reactions.nine,
	];
		
	const gravesPerPage = 3;
	let pages;

	graves = graves.characters;

	for (var i = 0; i < graves.length; i++) {
		graves[i].date = new Date(graves[i].date);
	}	

	pages = client._.chunk(graves, gravesPerPage);
	
	pages = pages.map((page) => {
		const fields = page.map(grave => ({
			name: `Here lies ${grave.name}.`,
			value: `Level ${grave.level} \nAged ${grave.age} \nOn ${grave.date}`,
		}));
		  			  			
		return {
	 		embed: {
				title: `${message.author.username}'s Graves`,
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
		
		// Display X button after the others
				
		await msg.react(reactions.x);
		msg.delete(90000).catch();
		
		// Create collector to listen for button click
		const collector = msg.createReactionCollector((reaction, user) => user !== client.user);
	
		collector.on('collect', async (messageReaction) => {
			// If the x button is pressed, remove the message.
		    if (messageReaction.emoji.name === reactions.x) {
		    	msg.delete(); // Delete the message
		        collector.stop(); // Get rid of the collector.
		        return;
			}
					
		    // Get the index of the page by button pressed
		    const pageIndex = buttons.indexOf(messageReaction.emoji.name);
			// Return if emoji is irrelevant or the page doesnt exist (number too high)
	   		if (pageIndex === -1 || !pages[pageIndex]) return;
			
	   		// Edit the message to show the new page.
	   		msg.edit(pages[pageIndex]);
		
	  		const notbot = messageReaction.users.filter(clientuser => clientuser !== client.user).first();
	  		await messageReaction.remove(notbot);
		});
	}).catch(err => console.log(err));
		
	var graveMessage = client.config.block;
	message.delete();
}