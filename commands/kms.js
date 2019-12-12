//KMS command
//Author: Tom Green
//Date Created: 9/11/2019

module.exports = {
	name: "kms",
	syntax: `~kms`,
	description: 'This kills the character.',
	usage: [
		"~kms - Die.",
	],
};

module.exports.run = (client, message) => {
	message.reply("Are you sure? y/n");
	message.channel.awaitMessages(m => m.author.id === message.author.id, {
		max: 1,
		time: 30000,
		errors:['time']
		})
		.then(collected => {
			if (collected.first().content.includes("y")) {
				client.charFuncs.takeDamage(client, message, message.author.id, 1000);
				message.reply("Ouch!");
			} else {
				message.reply("Phew!");
			}
		}).catch(collected => {
			console.log(collected);
			console.log("Command time up."); //collected"Command time up.");
		})
}