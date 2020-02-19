/*
 * Character Functions
 * Author: Tom Green
 * Date Created: 22/10/2019
 */

module.exports = {
	/*
	 * saveCharacter function, which is used to save a 
	 * user's character, using the parameters: client 
	 * (the discord.js client instance), id (the 
	 * snowflake of a discord user) and save (the 
	 * json character data).
	 */
	saveCharacter: function (client, id, save) {
		const jsonString = JSON.stringify(save);

		var path = "/media/el-rat/USB/saves/" + id + "/character.json";

		client.fs.writeFile(path, jsonString, err => {
			if (err)
				console.log("Error writing file", err);
			else
				console.log("Successfully wrote file");
		});
	},

	/*
	 * loadCharacter function, which is used to load a 
	 * user's character, using the parameters: client 
	 * (the discord.js client instance), id (the 
	 * snowflake of a discord user). 
	 * It returns the user's character object.
	 */
	loadCharacter: function (client, id) {
		var path = "/media/el-rat/USB/saves/" + id + "/character.json";
		let rawData = client.fs.readFileSync(path);
		let character = JSON.parse(rawData);
		return character;
	},

	/*
	 * destroyCharacter function, which is used to delete
	 * a user's character via the shell script 'del-char.sh'.
	 * The function parameters are: client 
	 * (the discord.js client instance), id (the 
	 * snowflake of a discord user). 
	 */
	destroyCharacter: function (client, id) {
		if (client.shell.exec('./bash/del-char.sh ' + id).code !== 0)
			console.log("Error deleting character.");
		else
			console.log("Character deleted.");
	},

	/*
	 * generateMap function, which is used to generate a world 
	 * map for a character. It is used for initial map generation 
	 * and debugging purposes.
	 */
	generateMap: function () {
		var map = {
			map: {
				0: ['', '', '', '', '', '', ''],
				1: ['', '', '', '', '', '', ''],
				2: ['', '', '', '', '', '', ''],
				3: ['', '', '', '', '', '', ''],
				4: ['', '', '', '', '', '', ''],
				5: ['', '', '', '', '', '', ''],
				6: ['', '', '', '', '', '', ''],
				7: ['', '', '', '', '', '', ''],
				8: ['', '', '', '', '', '', ''],
				9: ['', '', '', '', '', '', '']
			}
		};
		for (var x = 0; x < 10; x++) {
			for (var y = 0; y < 10; y++) {
				var rand = Math.floor((Math.random() * 5));
				switch (rand) {
					case 0:
						map.map[x][y] = '~';
						break;
					case 1:
						map.map[x][y] = '¿';
						break;
					case 2:
						map.map[x][y] = '^';
						break;
					case 3:
						if (x * y % 2 === 0)
							map.map[x][y] = '⌂';
						else
							map.map[x][y] = '‡';
						break;
					case 4:
						map.map[x][y] = '‡';
						break;
				}
				if (x == 0 || y == 0 || x == 9 || y == 9) map.map[x][y] = '~';
			}
		}
		return map;
	},

	/*
	 * saveMap function, which is used to save a 
	 * user's world map, using the parameters: client 
	 * (the discord.js client instance), id (the 
	 * snowflake of a discord user) and map (the 
	 * json map data).
	 */
	saveMap: function (client, id, map) {
		const jsonString = JSON.stringify(map);

		var path = "/media/el-rat/USB/saves/" + id + "/map.json";
		client.fs.writeFile(path, jsonString, err => {
			if (err)
				console.log("Error writing map.", err);
			else
				console.log("Successfully wrote map.");
		});
	},

	/*
	 * loadMap function, which is used to load a 
	 * user's world map, using the parameters: client 
	 * (the discord.js client instance), id (the 
	 * snowflake of a discord user). 
	 * It returns the user's world map object.
	 */
	loadMap: function (client, id) {
		var path = "/media/el-rat/USB/saves/" + id + "/map.json";
		let rawData = client.fs.readFileSync(path);
		let map = JSON.parse(rawData);
		return map;
	},

	/*
	 * saveProfile function, which is used to save a 
	 * user's profile, using the parameters: client 
	 * (the discord.js client instance), id (the 
	 * snowflake of a discord user) and profile (the 
	 * json profile data).
	 */
	saveProfile: function (client, id, profile) {
		const jsonString = JSON.stringify(profile);

		var path = "/media/el-rat/USB/saves/" + id + "/profile.json";
		client.fs.writeFile(path, jsonString, err => {
			if (err)
				console.log("Error writing profile.json", err);
			else
				console.log("Successfully wrote profile.json");
		});
	},

	/*
	 * loadProfile function, which is used to load a 
	 * user's profile, using the parameters: client 
	 * (the discord.js client instance), id (the 
	 * snowflake of a discord user). 
	 * It returns the user's profile object.
	 */
	loadProfile: function (client, id) {
		var path = "/media/el-rat/USB/saves/" + id + "/profile.json";
		let rawData = client.fs.readFileSync(path);
		let profile = JSON.parse(rawData);
		return profile;
	},

	/*
	 * deleteProfile function, which is used to delete
	 * a user's profile via the shell script 'del-profile.sh'.
	 * Used for debugging purposes.
	 * The function parameters are: client 
	 * (the discord.js client instance), id (the 
	 * snowflake of a discord user).
	 */
	deleteProfile: function (client, id) {
		if (client.shell.exec('./bash/del-profile.sh ' + id).code !== 0)
			console.log("Error deleting profile.");
		else
			console.log("Profile deleted.");
	},

	/*
	 * addAchievement function, which is used to add 
	 * achievements to a user profile.
	 * The function parameters are: client 
	 * (the discord.js client instance), message (the
	 * command message that triggered the function), 
	 * achievement (the achievement that the user achieved).
	 */
	addAchievement: function (client, message, achievement) {
		let profile = module.exports.loadProfile(client, message.author.id);

		var found = false;

		profile.achievements.forEach(element => {
			if (element == achievement)
				found = true;
		});

		if (found == true)
			return;
		else
			message.reply("Achieved: " + achievement + "!");

		profile.achievements.push(achievement);
		module.exports.saveProfile(client, message.author.id, profile);
	},

	/*
	 * heal function, which is used to add hp to a character.
	 * The function parameters are: client 
	 * (the discord.js client instance), id (the 
	 * snowflake of a discord user), character (the character
	 * object to be modified), heal (the amount of hp to be added).
	 */
	heal: function (client, id, character, heal) {
		character.health += heal;
		if (character.health > character.maxHealth) character.health = character.maxHealth;
		module.exports.saveCharacter(client, id, character);
	},

	/*
	 * takeDamage function, which is used to remove hp from a character.
	 * The function parameters are: client 
	 * (the discord.js client instance), id (the 
	 * snowflake of a discord user), message (the
	 * command message that triggered the function), 
	 * character (the character object to be modified), 
	 * dam (the amount of hp to be removed).
	 */
	takeDamage: function (client, message, character, dam) {
		character.health -= dam;
		module.exports.checkDead(client, message, character);
	},

	/*
	 * addXP function, which is used to add xp to a character.
	 * The function parameters are: client 
	 * (the discord.js client instance), message (the
	 * command message that triggered the function), 
	 * character (the character object to be modified), 
	 * val (the amount of xp to be added).
	 */
	addXP: function (client, message, character, val) {
		if (character === null)
			character = module.exports.loadCharacter(client, message.author.id);
		character.xp += val;
		module.exports.checkLevel(client, message, character);
	},

	/*
	 * addItem function, which is used to add items to 
	 * a character's inventory.
	 * The function parameters are: client 
	 * (the discord.js client instance), message (the
	 * command message that triggered the function), 
	 * character (the character object to be modified), 
	 * item (the item to be added), type (the type of the item to be added),
	 * xp (the amount of xp that should be added along with the item).
	 */
	addItem: function (client, message, character, item, type, xp) {
		var search = module.exports.searchItems(character, item, type);

		if (type == "consumable") {
			if (Number.isNaN(search))
				character.inventory.consumable.push(item);
			else
				character.inventory.consumable[search].count += item.count;
		} else if (type == "equippable") {
			if (Number.isNaN(search))
				character.inventory.equippable.push(item);
			else
				character.inventory.equippable[search].count += item.count;
		} else if (type == "tradable") {
			if (Number.isNaN(search))
				character.inventory.tradable.push(item);
			else
				character.inventory.tradable[search].count += item.count;
		}

		module.exports.saveCharacter(client, message.author.id, character);

		if (!Number.isNaN(xp))
			module.exports.addXP(client, message, character, xp);
	},

	/*
	 * removeItem function, which is used to remove items from 
	 * a character's inventory.
	 * The function parameters are: client 
	 * (the discord.js client instance), message (the
	 * command message that triggered the function), 
	 * character (the character object to be modified), 
	 * item (the item to be added), type (the type of the item to be added),
	 * amount (the amount of the specified item to be removed).
	 */
	removeItem: function (client, message, character, item, type, amount) {
		var search = module.exports.searchItems(character, item, type);

		if (type == "consumable") {
			if (!Number.isNaN(search)) {
				character.inventory.consumable[search].count -= amount;

				if (character.inventory.consumable[search].count <= 0)
					character.inventory.consumable.splice(search, 1);
			}
		} else if (type == "equippable") {
			if (!Number.isNaN(search)) {
				character.inventory.equippable[search].count -= amount;

				if (character.inventory.equippable[search].count <= 0) 
					character.inventory.equippable.splice(search, 1);
			}
		} else if (type == "tradable") {
			if (!Number.isNaN(search)) {
				character.inventory.tradable[search].count -= amount;

				if (character.inventory.tradable[search].count <= 0) 
					character.inventory.tradable.splice(search, 1);
			}
		}

		module.exports.saveCharacter(client, message.author.id, character);
	},

	/*
	 * searchItems function, which is used to determine which index 
	 * the specified item is located in the character's inventory. 
	 * If the item is not in the character's inventory, return NaN. 
	 * The function parameters are: 
	 * character (the character object to be modified), 
	 * item (the item to be searched for), type (the type of the item to be searched for),
	 */
	searchItems: function (character, item, type) {
		if (type == "consumable") {
			for (var i = 0; i < character.inventory.consumable.length; i++) {
				if (character.inventory.consumable[i].name === item.name)
					return i;
			}
		} else if (type == "equippable") {
			for (var i = 0; i < character.inventory.equippable.length; i++) {
				if (character.inventory.equippable[i].name === item.name)
					return i;
			}
		} else if (type == "tradable") {
			for (var i = 0; i < character.inventory.tradable.length; i++) {
				if (character.inventory.tradable[i].name === item.name)
					return i;
			}
		}
		return NaN;
	},

	/*
	 * checkDead function, which is used to check whether a character is dead. 
	 * Returns true if the character is dead and false if the character is alive.
	 * The function parameters are: client 
	 * (the discord.js client instance), message (the
	 * command message that triggered the function), 
	 * character (the character object to be modified).
	 */
	checkDead: function (client, message, character) {
		if (character.health <= 0) {
			character.dead = true;
			try {
				let grave = module.exports.loadGrave(client, message.author.id);
				let size = Object.keys(grave.characters).length;
				grave.characters[size] = {
					name: character.name,
					level: character.level,
					age: character.age,
					date: Date.now()
				};
				module.exports.destroyCharacter(client, message.author.id);
				module.exports.saveGrave(client, message.author.id, grave);
			} catch (error) {
				console.log(error);
				grave = {
					characters: [
						{
							name: character.name,
							level: character.level,
							age: character.age,
							date: Date.now()
						}
					]
				};
				module.exports.destroyCharacter(client, message.author.id);
				module.exports.saveGrave(client, message.author.id, grave);
			}
			message.reply(character.name + " has died...\n~graves");
		} else {
			module.exports.saveCharacter(client, message.author.id, character);
		}
		return false;
	},

	/*
	 * checkLevel function, which is used to check whether a character 
	 * should level up. If they should, scale their stats and notify the 
	 * user that their character has leveled up.
	 * The function parameters are: client 
	 * (the discord.js client instance), message (the
	 * command message that triggered the function), 
	 * character (the character object to be modified).
	 */
	checkLevel: function (client, message, character) {
		while (character.xp >= character.xpCap) {
			character.level++;
			character.health += 10;
			character.maxHealth += 10;
			character.mana += 10;
			character.maxMana += 10;
			if (character.level % 2 === 0) character.dam++;
			character.xp -= character.xpCap;
			character.xpCap += 10;
			message.reply(character.name + " is now level " + character.level + "!");
		}
		module.exports.saveCharacter(client, message.author.id, character);
	},

	/*
	 * saveGrave function, which is used to save a 
	 * user's graves, using the parameters: client 
	 * (the discord.js client instance), id (the 
	 * snowflake of a discord user) and grave (the 
	 * json grave data).
	 */
	saveGrave: function (client, id, grave) {
		const jsonString = JSON.stringify(grave);
		var path = "/media/el-rat/USB/saves/" + id + "/grave.json";

		client.fs.writeFile(path, jsonString, err => {
			if (err)
				console.log("Error writing file", err);
			else
				console.log("Successfully wrote file");
		});
	},

	/*
	 * loadGrave function, which is used to load a 
	 * user's grave, using the parameters: client 
	 * (the discord.js client instance), id (the 
	 * snowflake of a discord user). 
	 * It returns the user's grave object.
	 */
	loadGrave: function (client, id) {
		var path = "/media/el-rat/USB/saves/" + id + "/grave.json";
		let rawData = client.fs.readFileSync(path);
		let grave = JSON.parse(rawData);
		console.log(grave);
		return grave;
	}
}