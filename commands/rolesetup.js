const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rolesetup')
    .setDescription('Create standard roles like Admin, Mod, Member, etc.'),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setTitle('Permission Denied')
            .setDescription('❌ You must be an admin to use this command.')
        ],
        ephemeral: true
      });
    }

    await interaction.deferReply({ ephemeral: false });

    try {
      const guild = interaction.guild;

      const rolesToCreate = [
        {
          name: 'Admin',
          color: 'Red',
          permissions: [PermissionsBitField.Flags.Administrator]
        },
        {
          name: 'Moderator',
          color: 'Orange',
          permissions: [
            PermissionsBitField.Flags.KickMembers,
            PermissionsBitField.Flags.BanMembers,
            PermissionsBitField.Flags.ManageMessages,
            PermissionsBitField.Flags.ManageChannels
          ]
        },
        {
          name: 'Member',
          color: 'Blue'
        },
        {
          name: 'Supporter',
          color: 'Green',
          permissions: [PermissionsBitField.Flags.ManageMessages]
        },
        {
          name: 'Muted',
          color: 'Grey',
          permissions: []
        }
      ];

      for (const roleData of rolesToCreate) {
        const exists = guild.roles.cache.find(r => r.name.toLowerCase() === roleData.name.toLowerCase());
        if (!exists) await guild.roles.create(roleData);
      }

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor('Green')
            .setTitle('✅ Roles Created')
            .setDescription('All standard roles have been created (if they didn’t already exist).')
        ]
      });
    } catch (err) {
      console.error(err);
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setTitle('❌ Failed to Create Roles')
            .setDescription(`\`\`\`${err.message}\`\`\``)
        ]
      });
    }
  }
};
