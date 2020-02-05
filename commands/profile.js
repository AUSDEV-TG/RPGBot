/*
Profile command
Author: Tom Green
Date Created: 08/01/2020
*/

module.exports = {
	name: "profile",
	syntax: `~profile name`,
	description: 'View a user profile.',
	usage: [
		"~profile - Views the user's profile.",
		"~profile *other user* - Views the specified user's profile.",
	],
};

module.exports.run = (client, message, args) => {
	// Try to load the profile, if an error occurs, notify the user.
	try {
		var profile = client.charFuncs.loadProfile(client, message.author.id);
	} catch (error) {
		message.react(client.reactions.error);
		return message.reply("You must have played RPGBot before you can use this command.");
	}

	if (args[0] == "-d" && message.author.id === client.config.devID) {
		// Debugging argument to delete the user profile.
		client.charFuncs.deleteProfile(client, message.author.id);
	} else {
		// Send a message containing all the user achievements.
		message.reply(client.config.block + "ARM\n" + profile.name + "\n\nAchievements:\n" +
			module.exports.getAchievements(profile) +
			client.config.block);
	}
};

// Function to compile the user achievements into a formatted string.
module.exports.getAchievements = (profile) => {
	var achievements = "";
	profile.achievements.forEach(achievement => {
		achievements += "\t" + achievement + "\n";
	});
	return achievements;
}