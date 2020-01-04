/* 
Move command
Author: Tom Green
Date Created: 22/10/2019
*/

module.exports = {
	name: "move",
	syntax: `~move bearing distance`,
	description: "Moves the character's position on the map.",
	usage: [
		"~move north 3 - Move the character's position north by 3 units.",
	],
};

module.exports.run = (client, message, args) => {
	// Try to load the character, map and monsters, if an error occurs, the user has no character or map.
	try {
		var character = client.charFuncs.loadCharacter(client, message.author.id);
		var mapSave = client.charFuncs.loadMap(client, message.author.id);
		var monsters = client.gameFuncs.loadMonsters(client);
	} catch (error) {
        console.log(error);
		return message.reply("You must create a character to use that command.");
    }

	// Parse the number argument, if it is undefined or NaN, notify the user.
    var num = parseInt(args[1]);
    if (num === undefined || Number.isNaN(num) === true) 
    	return message.reply("Please specify a direction and distance.");

	// Move the character in the desired direction
	if (args[0] === "north" && args[1] !== '') {
		character.posY += parseInt(args[1]);
		if (character.posY > 9) character.posY = 9;
	} else if (args[0] === "east" && args[1] !== '') {
		character.posX += parseInt(args[1]);
		if (character.posX > 9) character.posX = 9;
	} else if (args[0] === "south" && args[1] !== '') {
		character.posY -= parseInt(args[1]);
		if (character.posY < 0) character.posY = 0;
	} else if (args[0] === "west" && args[1] !== '') {
		character.posX -= parseInt(args[1]);
		if (character.posX < 0) character.posX = 0;
	}

	if (mapSave.map[character.posY][character.posX] === '⌂') {
		//message.reply("Arrived at a village.");
		monsters = monsters.village;
	}
	
	if (mapSave.map[character.posY][character.posX] === '^') {
		//message.reply("Arrived at a mountain.");
		monsters = monsters.mountain;
	}
	
	if (mapSave.map[character.posY][character.posX] === '~') {
		//message.reply("In the water.");
		monsters = monsters.water;
	}

	if (mapSave.map[character.posY][character.posX] === '‡') {
		//message.reply("Arrived at a forest.");
		monsters = monsters.forest;
	}

	if (mapSave.map[character.posY][character.posX] === '¿') {
		//message.reply("Arrived at ruins.")
		monsters = monsters.ruin;
	}

	// Save the character with their new position.
	client.charFuncs.saveCharacter(client, message.author.id, character);

	/* 
	Create a random chance (≈ .33% chance of occuring) to determine 
	whether the character will encounter an enemy.
	If an enemy is to be encountered, create another variable to be 
	used to access a randomised monster from the pool of available monsters.
	*/
	if (Math.floor(Math.random() * 10) % 3 === 0 ) {
		var rand = Math.floor(Math.random() * monsters.length);

		var monster = monsters[rand];
				
		client.gameFuncs.engageCombat(client, message, character, monster);
	}
	message.delete();
}