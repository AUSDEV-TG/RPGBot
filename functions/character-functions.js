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
	 * json character data)
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

	loadCharacter: function (client, id) {
		var path = "/media/el-rat/USB/saves/" + id + "/character.json";
		let rawdata = client.fs.readFileSync(path);
		let character = JSON.parse(rawdata);
		return character;
	},

	destroyCharacter: function (client, id) {
		if (client.shell.exec('./bash/del-char.sh ' + id).code !== 0)
			console.log("Error deleting character.");
		else
			console.log("Character deleted.");
	},

	generateMap: function (client) {
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

	loadMap: function (client, id) {
		var path = "/media/el-rat/USB/saves/" + id + "/map.json";
		let rawdata = client.fs.readFileSync(path);
		let map = JSON.parse(rawdata);
		return map;
	},

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

	loadProfile: function (client, id) {
		var path = "/media/el-rat/USB/saves/" + id + "/profile.json";
		let rawdata = client.fs.readFileSync(path);
		let profile = JSON.parse(rawdata);
		return profile;
	},

	addAchievement: function (client, message, achievement) {
		let profile = module.exports.loadProfile(client, message.author.id);
		
		profile.achievements.forEach(element => {
			if (element == achievement) {
				return;
			} else {
				message.reply("Achieved: " + achievement + "!");
			}
		});

		profile.achievements.push(achievement);
		module.exports.saveProfile(client, message.author.id, profile);
	},

	heal: function (client, id, character, heal) {
		character.health += heal;
		if (character.health > character.maxHealth) character.health = character.maxHealth;
		module.exports.saveCharacter(client, id, character);
	},

	takeDamage: function (client, message, id, character, dam) {
		character.health -= dam;
		module.exports.checkDead(client, message, id, character);
	},

	addXP: function (client, message, character, val) {
		if (character === null)
			character = module.exports.loadCharacter(client, message.author.id);
		character.xp += val;
		module.exports.checkLevel(client, message, character);
	},

	addItem: function (client, message, character, item, type, xp) {
		var search = module.exports.searchItems(client, character, item, type);

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

	searchItems: function (client, character, item, type) {
		if (type == "consumable") {
			console.log(type);
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

	checkDead: function (client, message, id, character) {
		if (character.health <= 0) {
			character.dead = true;
			try {
				let grave = module.exports.loadGrave(client, id);
				let size = Object.keys(grave.characters).length;
				console.log(size);
				grave.characters[size] = {
					name: character.name,
					level: character.level,
					age: character.age,
					date: Date.now()
				};
				module.exports.destroyCharacter(client, id);
				module.exports.saveGrave(client, id, grave);
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
				module.exports.destroyCharacter(client, id);
				module.exports.saveGrave(client, id, grave);
			}
			message.reply(character.name + " has died...\n~graves");
		} else {
			module.exports.saveCharacter(client, id, character);
		}
		return false;
	},

	checkLevel: function (client, message, character) {
		if (character.xp >= character.xpCap) {
			do {
				character.level++;
				character.health += 10;
				character.maxHealth += 10;
				character.mana += 10;
				character.maxMana += 10;
				if (character.level % 2 === 0) character.dam++;
				character.xp -= character.xpCap;
				character.xpCap += 10;
				message.reply(character.name + " is now level " + character.level + "!");
			} while (character.xp >= character.xpCap);
		}
		module.exports.saveCharacter(client, message.author.id, character);
	},

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

	loadGrave: function (client, id) {
		var path = "/media/el-rat/USB/saves/" + id + "/grave.json";
		let rawdata = client.fs.readFileSync(path);
		let grave = JSON.parse(rawdata);
		console.log(grave);
		return grave;
	}
}