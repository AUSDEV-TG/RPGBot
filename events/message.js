// Message Event
// Author: Tom Green
// Date Created: 20/10/2019

module.exports = (client, message) => {
	// Ignore messages that are not from a guild
	if (!message.guild) return;
	// Ignore bots
	if (message.author.bot) return;
	
	// Ignore messages not starting with prefix
	if (message.content.indexOf(client.config.prefix) !== 0) return;

	// Standard arg/command name definition
	const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	// Grab the command data from the client.commands Enmap
	const cmd = client.commands.get(command);

	// If the command doesn't exist, exit and do nothing
	if (!cmd) return;

	// Run the command
	cmd.run(client, message, args);
}
