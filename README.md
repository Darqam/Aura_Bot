# This has not been updated in years, if you find your way here; you should probably not use this.

# Aura_Bot
A discord bot created to query the GW2 API and perform a few other fun and useful tasks

## Features
The bot can do various tasks to help GW2 guild discord servers.
 - **Guild Wars 2**
   - Discord Synchronization
     - Link Discord and Guild Wars 2 accounts with API keys
   - Accounts
     - Basic information
     - Weekly raid kill progress
     - Raid achievement progress
     - Current currencies
   - Guilds
     - Displays MOTD
     - Displays needed items in the treasury
   - Other
     - Display today or tomorrow's dailies
     - Display most recent patch notes
     - Post random cutsy pictures
     - Post random quaggans
 - **Management**
   - Allow capacity to block users from using certain command types through blacklist/banlists

### Available commands
You can type `!help` in any text channel will dm you list of available commands.
You can also type `!help, <command>`, where `<command>` is the name of a command, in order to receive more detailed information about a specific command.

## Usage
This bot is not available for public invites, and probably never will be. As such you will need to run the bot on your own.
The bot is meant to only be run on a single server as all settings are made for the entire bot instance and not limitted per guild. At the moment there is no plan to change this.

Note that any command can be disabled by going into the appropriate file in the `commands` folder and switching the `enabled` in `exports.conf` from `true` to `false`.

### Installing
 - Install the following software:
   - Node.js v7 or higher
 - Clone or download the zip of a specific version (or master if that isn't available)
 - Install the dependencies with your favorite package manager (e.g. `npm install`)
 - Run the bot (e.g. `node aura_bot.js`)

If you are running the bot non-stop, it is recommended to have a process manager that monitors the bot's process, for example pm2 or nodemon.

## Updating
If you grab any updates from this project, you are expected to ensure that any possible new dependency is matched or updated.

## Contributing
Anyone is welcome to contribute either code or simply ideas. I can't guarantee that anything or everything will be implemented, but it can't hurt to ask.

If you encounter a bug or issue, please create an issue here on github explaining it with as much information as possible.
I am also happy to accept any grammar/sentence structure/whatever help and/or corrections to the bot.
