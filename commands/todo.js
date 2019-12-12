// New command
// Author: Tom Green
// Date Created: 20/10/2019
module.exports = {
	name: "todo",
	syntax: `~todo description.`,
	description: 'Adds a thing to be done for RPGBot.',
	usage: [
		"~todo Fix Bugs",
	],
};

module.exports.run = (client, message, args) => {
	if (message.author.id !== client.config.devID) return message.reply("Insufficient Permissions.");
	if (args == '') return message.reply("Must have parameters todo");
	if (client.shell.exec('./bash/todo_creator.sh ' + Array.prototype.join.call(args, ' ')).code !== 0) {
		console.log("Error creating todo.");
		message.reply("Something went wrong... Please try again later.");
	} else {
		message.reply("TODO created successfully!");
	}
	message.delete();
}