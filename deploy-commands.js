const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');


const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} global application (/) commands.`);


    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID), 
      { body: commands },
    );

    console.log(`Successfully reloaded global application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
