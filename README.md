# RPGBot

A discord bot that allows members of a server to play a text-based RPG.<br/>
Developed using the discord.js library.<br/>
Not built with intention of being used as a public discord bot.<br/>
Innovations on the bot are encouraged.<br/>
Fork or pinch the code as you please; however, I would love to see  improvements!

### Short-term goals:

* Develop a functional co-op system.
* Develop a functional questing system.
* Rebuild character creation.
* Improve the efficiency of many functions.
* Re-balance leveling and stats.

### Long-term goals:

* Run the bot on a dedicated server (not a RPi).
* Multi-Thread the bot (necessary conversion from node).

#### World Map!
![](images/map-demo.gif)

#### Fishing!
![](images/fishing-demo.gif)

#### Inventory System!
![](images/inventory-demo.gif)

and much more!

### Recipe for config.json:
```json
{
    "token": "YOUR_BOT_TOKEN_GOES_HERE",
    "prefix": "~",
    "devID": "YOUR_ACCOUNT_SNOWFLAKE_GOES_HERE",
    "block": "```",
    "errorMsg": "Please try again, if the problem persists, contact the developer using the discord tag: YOUR_ACCOUNT_TAG_GOES_HERE"
}
```