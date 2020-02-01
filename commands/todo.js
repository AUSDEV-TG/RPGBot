/*
TODO command
Author: Tom Green
Date Created: 17/11/2019
*/

module.exports = {
	name: "todo",
	syntax: `~todo description.`,
	description: 'Adds a thing to be done for RPGBot.',
	usage: [
		"~todo Fix Bugs",
	],
};

module.exports.run = (client, message, args) => {
	/*
	If the author of the command is the developer, 
	return a message that the user has insufficient permissions.
	Then check if there are no arguments to the command.
	If the command is successful, execute the shell script 
	'todo_creator.sh' with the command arguments as the 
	script arguments, if the script fails for any reason, 
	notify the user.
	*/
	if (message.author.id !== client.config.devID) 
		return message.react(client.reactions.restricted);

	if (args == '') 
		return message.reply("Todo must have a description.");

	if (client.shell.exec('./bash/todo_creator.sh ' + Array.prototype.join.call(args, ' ')).code !== 0) {
		console.log("Error creating todo.");
		message.reply("Something went wrong... Please try again later.");
	} else {
		message.reply("TODO created successfully!");
	}
	message.delete();
}