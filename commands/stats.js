// Stats command
// Author: Tom Green
// Date Created: 22/10/2019

module.exports = {
	name: "stats",
	syntax: `~stats`,
	description: "Displays the character's stats.",
	usage: [
		"~stats - Display the character's stats.",
	],
};

module.exports.run = (client, message) => {
	try {
		var character = client.charFuncs.loadCharacter(client, message.author.id);
	} catch (error) {
		console.log(error);
		return message.reply("You must create a character to use that command.");
	}

	message.reply(client.config.block + "ARM\n" + character.name + "\n\nLevel " + character.level
		+ "\nXP: " + character.xp + "/" + character.xpCap + "\nHealth: " + character.health + "/"
		+ character.maxHealth + "\tMana: " + character.mana + "/" + character.maxMana
		+ "\nDamage: " + character.dam + "\nAge: " + character.age + "\nAt: "
		+ (character.posX + 1) + ", " + (character.posY + 1) + client.config.block);
	message.delete();
}