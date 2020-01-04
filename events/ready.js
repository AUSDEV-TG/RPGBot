/*
 * Ready Event
 * Author: Tom Green
 * Date Created: 21/10/2019
 */

module.exports = (client) => {
	console.log(`Ready to play in ${client.channels.size} channels with a total of ${client.users.size} users.`);
	client.user.setActivity("RPG | ~help");
}
