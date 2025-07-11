const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Set up your server with a chosen template.')
    .addStringOption(option =>
      option
        .setName('template')
        .setDescription('Choose a server setup template')
        .setRequired(true)
        .addChoices(
          { name: 'Bot Support', value: 'bot-support' },
          { name: 'Community', value: 'community' },
          { name: 'FiveM Server', value: 'fivem-server' },
        )
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setTitle('Permission Denied')
            .setDescription('❌ You must be an admin to use this command.')
        ],
        ephemeral: false
      });
    }

    const template = interaction.options.getString('template');

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('Yellow')
          .setTitle('🔄 Wiping server...')
          .setDescription(`Setting up server with the **${template}** template... Deleting channels & roles...`)
      ],
      ephemeral: false
    });

    try {
      const guild = interaction.guild;

      const channelsToKeep = new Set([
        interaction.channel.id,
        'general',
        'bot-commands',
        'suggestions',
      ]);

      await Promise.all(
        guild.channels.cache
          .filter(channel => {
            if (channelsToKeep.has(channel.id)) return false;
            if (channelsToKeep.has(channel.name)) return false;
            return true;
          })
          .map(channel => channel.delete().catch(() => {}))
      );

      await Promise.all(
        guild.roles.cache
          .filter(role => !role.managed && role.id !== guild.id)
          .map(role => role.delete().catch(() => {}))
      );

      await new Promise(resolve => setTimeout(resolve, 3000));

      if (template === 'bot-support') {
        const infoCat = await guild.channels.create({ name: '📁 Info', type: 4 });
        const supportCat = await guild.channels.create({ name: '🛠 Support', type: 4 });
        const voiceCat = await guild.channels.create({ name: '🔊 Voice', type: 4 });
        const staffCat = await guild.channels.create({ name: '👮 Staff', type: 4 });

        await guild.channels.create({ name: '📄┃welcome', type: 0, parent: infoCat.id });
        await guild.channels.create({ name: '📢┃announcements', type: 0, parent: infoCat.id });
        await guild.channels.create({ name: '📜┃rules', type: 0, parent: infoCat.id });
        await guild.channels.create({ name: '📚┃faq', type: 0, parent: infoCat.id });

        await guild.channels.create({ name: '💬┃support-chat', type: 0, parent: supportCat.id });
        await guild.channels.create({ name: '🎫┃tickets', type: 0, parent: supportCat.id });
        await guild.channels.create({ name: '📝┃bug-reports', type: 0, parent: supportCat.id });

        await guild.channels.create({ name: '🔊┃general-voice', type: 2, parent: voiceCat.id });
        await guild.channels.create({ name: '🔊┃staff-voice', type: 2, parent: voiceCat.id });

        await guild.channels.create({ name: '👮┃staff-chat', type: 0, parent: staffCat.id });
        await guild.channels.create({ name: '📋┃mod-logs', type: 0, parent: staffCat.id });
        await guild.channels.create({ name: '🔧┃admin-room', type: 0, parent: staffCat.id });

        await guild.roles.create({
          name: 'Supporter',
          color: 'Green',
          permissions: [PermissionsBitField.Flags.ManageMessages]
        });
        await guild.roles.create({
          name: 'Moderator',
          color: 'Orange',
          permissions: [
            PermissionsBitField.Flags.KickMembers,
            PermissionsBitField.Flags.BanMembers,
            PermissionsBitField.Flags.ManageMessages,
            PermissionsBitField.Flags.ManageChannels
          ]
        });
      }
      else if (template === 'community') {
        const infoCat = await guild.channels.create({ name: '📁 Server Info', type: 4 });
        const communityCat = await guild.channels.create({ name: '💬 Community', type: 4 });
        const voiceCat = await guild.channels.create({ name: '🔊 Voice Channels', type: 4 });
        const staffCat = await guild.channels.create({ name: '🛠 Staff', type: 4 });
        const eventsCat = await guild.channels.create({ name: '🎉 Events', type: 4 });

        await guild.channels.create({ name: '📄┃welcome', type: 0, parent: infoCat.id });
        await guild.channels.create({ name: '📜┃rules', type: 0, parent: infoCat.id });
        await guild.channels.create({ name: '📣┃announcements', type: 0, parent: infoCat.id });
        await guild.channels.create({ name: '📚┃faq', type: 0, parent: infoCat.id });

        await guild.channels.create({ name: '💬┃general', type: 0, parent: communityCat.id });
        await guild.channels.create({ name: '📸┃media', type: 0, parent: communityCat.id });
        await guild.channels.create({ name: '🤖┃bot-commands', type: 0, parent: communityCat.id });
        await guild.channels.create({ name: '🧠┃suggestions', type: 0, parent: communityCat.id });
        await guild.channels.create({ name: '🎨┃art', type: 0, parent: communityCat.id });
        await guild.channels.create({ name: '🎮┃gaming', type: 0, parent: communityCat.id });

        await guild.channels.create({ name: '🔊┃Lounge', type: 2, parent: voiceCat.id });
        await guild.channels.create({ name: '🎮┃Gaming', type: 2, parent: voiceCat.id });
        await guild.channels.create({ name: '🎤┃Music', type: 2, parent: voiceCat.id });

        const staffChat = await guild.channels.create({ name: '🛠┃staff-chat', type: 0, parent: staffCat.id });
        await staffChat.permissionOverwrites.create(guild.roles.everyone, { ViewChannel: false });
        await guild.channels.create({ name: '📋┃mod-logs', type: 0, parent: staffCat.id });
        await guild.channels.create({ name: '🔧┃admin-room', type: 0, parent: staffCat.id });
        await guild.channels.create({ name: '📝┃staff-announcements', type: 0, parent: staffCat.id });

        await guild.channels.create({ name: '📅┃events-schedule', type: 0, parent: eventsCat.id });
        await guild.channels.create({ name: '🎉┃event-chat', type: 0, parent: eventsCat.id });

        await guild.roles.create({
          name: 'Admin',
          color: 'Red',
          permissions: [PermissionsBitField.Flags.Administrator]
        });
        await guild.roles.create({
          name: 'Moderator',
          color: 'Orange',
          permissions: [
            PermissionsBitField.Flags.KickMembers,
            PermissionsBitField.Flags.BanMembers,
            PermissionsBitField.Flags.ManageMessages
          ]
        });
        await guild.roles.create({
          name: 'Member',
          color: 'Blue'
        });
      }
      else if (template === 'fivem-server') {
        const infoCat = await guild.channels.create({ name: '🛠 Server Info', type: 4 });
        const rolesCat = await guild.channels.create({ name: '👥 Roles', type: 4 });
        const chatCat = await guild.channels.create({ name: '💬 Chat', type: 4 });
        const voiceCat = await guild.channels.create({ name: '🔊 Voice', type: 4 });
        const staffCat = await guild.channels.create({ name: '🛠 Staff', type: 4 });

        await guild.channels.create({ name: '📄┃welcome', type: 0, parent: infoCat.id });
        await guild.channels.create({ name: '📢┃announcements', type: 0, parent: infoCat.id });
        await guild.channels.create({ name: '📜┃rules', type: 0, parent: infoCat.id });

        await guild.channels.create({ name: '👋┃introductions', type: 0, parent: chatCat.id });
        await guild.channels.create({ name: '💬┃general-chat', type: 0, parent: chatCat.id });
        await guild.channels.create({ name: '🎮┃game-chat', type: 0, parent: chatCat.id });
        await guild.channels.create({ name: '📢┃announcements-chat', type: 0, parent: chatCat.id });

        await guild.channels.create({ name: '🔊┃General', type: 2, parent: voiceCat.id });
        await guild.channels.create({ name: '🔊┃RP-Voice', type: 2, parent: voiceCat.id });
        await guild.channels.create({ name: '🔊┃Admin-Voice', type: 2, parent: voiceCat.id });

        await guild.channels.create({ name: '🛠┃staff-chat', type: 0, parent: staffCat.id });
        await guild.channels.create({ name: '📋┃mod-logs', type: 0, parent: staffCat.id });
        await guild.channels.create({ name: '🔧┃admin-room', type: 0, parent: staffCat.id });
        await guild.channels.create({ name: '📝┃staff-announcements', type: 0, parent: staffCat.id });

        await guild.roles.create({
          name: 'Admin',
          color: 'Red',
          permissions: [PermissionsBitField.Flags.Administrator]
        });
        await guild.roles.create({
          name: 'Moderator',
          color: 'Orange',
          permissions: [
            PermissionsBitField.Flags.KickMembers,
            PermissionsBitField.Flags.BanMembers,
            PermissionsBitField.Flags.ManageMessages
          ]
        });
        await guild.roles.create({
          name: 'Player',
          color: 'Blue'
        });
      }
      else {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor('Red')
              .setTitle('❌ Unknown Template')
              .setDescription('Please choose a valid template.')
          ]
        });
      }

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor('Green')
            .setTitle('✅ Server Setup Complete')
            .setDescription(`Setup finished using the **${template}** template.`)
        ]
      });

    } catch (err) {
      console.error(err);
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setTitle('❌ Setup Failed')
            .setDescription(`\`\`\`${err.message}\`\`\``)
        ]
      });
    }
  }
};
