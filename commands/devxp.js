/*
Developer XP command.
Author: Tom Green
Date Created: 11/12/2019
*/

module.exports = {
	name: "devxp",
	description: "Add xp to your character.",
	syntax: `~devxp amount`,
	usage: [
		'~destroy amount - Adds the desired amount of xp to your character.',
	],
};

module.exports.run = (client, message, args) => {
	// If the user is not the developer return a message letting the user know they are unable to use the command.
	if (message.author.id !== client.config.devID) 
		return message.reply("Insufficient permissions.");	
	
	/*
	Try to parse the arguments into an integer, if no errors occured, 
	use the addXP function to add experience points to a character save.
	*/
	try {
		var xpVal = parseInt(args);
		client.charFuncs.addXP(client, message, null, xpVal);	
	} catch (error) {
		// If an error occurs, log the error message and notify the user that their command could not be processed.
		console.log(error);
		message.reply(client.config.errorMsg);
	}
	message.delete();
}