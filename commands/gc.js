/*
Garbage collector command
Author: Tom Green
Date Created: 09/01/2020
*/

module.exports = {
    name: "gc",
	syntax: `~gc`,
	description: "Collects all garbage RPGBot messages and deletes them.",
	usage: [
		"~gc - Collect and delete garbage...",
	],
};

module.exports.run = (client, message) => {
    if (message.channel.type == 'text') {
        message.channel.fetchMessages().then(messages => {
            const rpgBotMessages = messages.filter(msg => msg.author.bot && msg.author.username == "RPGBot");
            message.channel.bulkDelete(rpgBotMessages);
            messagesDeleted = rpgBotMessages.array().length;

            message.reply(messagesDeleted + " messages deleted.");
            message.delete(10000).catch();
        }).catch(err => {
            console.log("Error with bulk delete.");
            console.log(err);
        });
    }
}