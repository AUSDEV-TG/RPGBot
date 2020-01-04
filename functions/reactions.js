/*
This source is based off of KMCGamer's code.
You can see his code at:
https://github.com/KMCGamer/usc_bot/blob/master/modules/reactions.js
*/

/*
✅ (Success): A command completed succesfully with absolutely no errors.
❓ (Mistake): Malformed input? User typed something in wrong? Other user input issues.
🚫 (Restricted): The user is not allowed to do this command. User does not have proper permissions.
❌ (Error): The command did not execute properly due to a simple error that is supposed to be caught.
💢 (Debug): The bot broke because of this command. Completely unintentional error that needs to be debugged.
🌀 (Use): A command used in the inventory system to use a consumable.
⤵️ (equip): A command used in the inventory system to equip an equippable.
⚔️ (attack): A command used in the combat system to attack an enemy.
🏃 (run): A command used in the combat system to run from an enemy.
🖐 (interact): A command used to interact with the world.
🛒 (shop): A command used in a village to buy new items.
🏡 (property): A command used in a village to buy property.
🔍 (explore): A command used in a ruin to explore.
🏕️ (camp): A command used in the forest to rest.
🥾 (hike): A command used in the mountains to trigger encounters and events.
🎣 (fish): A command used on the water to catch fish.
🥽 (dive): A command used on the water to explore the depths.
🏹 (hunt): A command used in the forest to hunt game.
🧺 (gather): A command used in the forest to gather items.
*/

module.exports = {
  success: '✅',
  mistake: '❓',
  restricted: '🚫',
  error: '❌',
  debug: '💢',
  zero: '0⃣',
  one: '1⃣',
  two: '2⃣',
  three: '3⃣',
  four: '4⃣',
  five: '5⃣',
  six: '6⃣',
  seven: '7⃣',
  eight: '8⃣',
  nine: '9⃣',
  use: '🌀',
  equip: '⤵️',
  x: '🇽',
  attack: '⚔️',
  run: '🏃',
  up: '⬆️',
  down: '⬇️',
  left: '⬅️',
  right: '➡️',
  interact: '🖐',
  shop: '🛒',
  property: '🏡',
  explore: '🔍',
  camp: '🏕️',
  hike: '🥾',
  fish: '🎣',
  dive: '🥽',
  hunt: '🏹',
  gather: '🧺',
  lumber: '🪓'
};
