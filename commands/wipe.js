const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wipe')
    .setDescription('Deletes all channels and roles in the server except this channel and @everyone role.'),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setTitle('Permission Denied')
            .setDescription('❌ You must be an administrator to use this command.')
        ],
        ephemeral: true
      });
    }

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('Yellow')
          .setTitle('🧹 Wiping Server...')
          .setDescription('Deleting all channels and roles (except this channel and @everyone role)...')
      ],
      ephemeral: true
    });

    try {
      const guild = interaction.guild;

      const channelsToDelete = guild.channels.cache.filter(ch => ch.id !== interaction.channel.id);
      await Promise.all(channelsToDelete.map(ch => ch.delete().catch(() => {})));

      const rolesToDelete = guild.roles.cache.filter(r => !r.managed && r.id !== guild.id);
      await Promise.all(rolesToDelete.map(r => r.delete().catch(() => {})));

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor('Green')
            .setTitle('✅ Wipe Complete')
            .setDescription('All channels (except this one) and all roles (except @everyone) have been deleted.')
        ]
      });

    } catch (error) {
      console.error(error);
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setTitle('❌ Wipe Failed')
            .setDescription(`\`\`\`${error.message}\`\`\``)
        ]
      });
    }
  }
};
