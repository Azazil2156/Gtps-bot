const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ] 
});

// Token dari environment variable
const DISCORD_TOKEN = process.env.MTQxMzczNjM4ODUzNjU2OTkwNg.GnQ85J.jZ8nuMErKXm2BcORD29a0wpDayX-PMagvkrVEo;
const GTPS_API_URL = 'https://growsoft-docs.vercel.app';

client.once('ready', () => {
  console.log(`✅ Bot ${client.user.tag} sudah online!`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  // Command: !player <username>
  if (message.content.startsWith('!player')) {
    const args = message.content.split(' ');
    if (args.length < 2) return message.reply('❌ Format: !player <username>');
    
    const username = args[1];
    try {
      const response = await axios.get(`${GTPS_API_URL}/api/players/${username}`);
      const player = response.data;

      const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`👤 Info Player: ${player.name}`)
        .addFields(
          { name: 'Level', value: player.level.toString(), inline: true },
          { name: 'Gems', value: player.gems.toString(), inline: true },
          { name: 'World', value: player.world || 'Tidak diketahui', inline: true },
          { name: 'Status', value: player.online ? '🟢 Online' : '🔴 Offline', inline: true }
        )
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (error) {
      message.reply('❌ Gagal mengambil info player. Pastikan username benar.');
    }
  }

  // Command: !status
  if (message.content.startsWith('!status')) {
    try {
      const response = await axios.get(`${GTPS_API_URL}/api/server/status`);
      const status = response.data;

      const embed = new EmbedBuilder()
        .setColor(status.online ? 0x00FF00 : 0xFF0000)
        .setTitle('🖥️ Status Server GTPS')
        .addFields(
          { name: 'Status', value: status.online ? '🟢 Online' : '🔴 Offline', inline: true },
          { name: 'Players Online', value: status.players.toString(), inline: true }
        )
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (error) {
      message.reply('❌ Gagal mengambil status server.');
    }
  }

  // Command: !help
  if (message.content.startsWith('!help')) {
    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('❓ Bantuan Bot GTPS')
      .setDescription('**Command yang tersedia:**')
      .addFields(
        { name: '!player <username>', value: 'Info player GTPS' },
        { name: '!status', value: 'Status server GTPS' },
        { name: '!help', value: 'Menampilkan bantuan' }
      )
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
});

client.login(DISCORD_TOKEN).catch(console.error);
