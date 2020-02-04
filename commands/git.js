/*
Git command
Author: Tom Green
Date Created: 04/02/2019
*/

module.exports = {
    name: "git",
    syntax: `~git`,
    description: 'Get an embedded link to the RPGBot GitHub Repository.',
    usage: [
        "~git - Get an embedded link to the RPGBot GitHub Repository.",
    ],
};

module.exports.run = (client, message) => {
    // Send an embed containing a link to the RPGBot GitHub Repository
    message.channel.send({
        embed: {
            color: 3447003,
            author: {
                name: client.user.username,
                icon_url: client.user.avatarURL
            },
            title: "RPGBot's Github Repo.",
            url: "https://github.com/AUSDEV-TG/RPGBot",
            timestamp: new Date(),
            footer: {
                text: "© AUSDEV-TG"
            }
        }
    });
}