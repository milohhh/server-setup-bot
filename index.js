const fs = require('fs')
const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js')
require('dotenv').config()

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
})

client.commands = new Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.data.name, command)
}

client.once('ready', () => {
  client.user.setActivity({
    type: ActivityType.Custom,
    name: '🔗 Setting up servers'
  })
  console.log(`✅ Logged in as ${client.user.tag}`)
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return

  const command = client.commands.get(interaction.commandName)
  if (!command) return

  try {
    await command.execute(interaction)
  } catch (err) {
    console.error(err)
    await interaction.reply({ content: '❌ There was an error executing this command.', ephemeral: true })
  }
})

client.login(process.env.TOKEN)
