const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

// Inisialisasi client Discord
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ] 
});

// Konfigurasi
const DISCORD_TOKEN = process.env.MTQxMzczNjM4ODUzNjU2OTkwNg.GnQ85J.jZ8nuMErKXm2BcORD29a0wpDayX-PMagvkrVEo; // Ambil dari environment variable
const GTPS_API_URL = 'https://growsoft-docs.vercel.app';

// Event ketika bot ready
client.once('ready', () => {
  console.log(`✅ Bot ${client.user.tag} sudah online!`);
  console.log(`🤖 Bot ID: ${client.user.id}`);
  console.log(`👋 Invite link: https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`);
});

// Event ketika ada message
client.on('messageCreate', async (message) => {
  // Jangan response ke bot lain atau diri sendiri
  if (message.author.bot) return;

  // Command: !player <username>
  if (message.content.startsWith('!player')) {
    const args = message.content.split(' ');
    if (args.length < 2) {
      return message.reply('❌ Format: `!player <username>`');
    }

    const username = args[1];
    
    try {
      // Typing indicator
      message.channel.sendTyping();
      
      const response = await axios.get(`${GTPS_API_URL}/api/players/${username}`);
      const player = response.data;

      const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`👤 Player Info: ${player.name}`)
        .setThumbnail('https://i.imgur.com/6eBQhXZ.png') // Ganti dengan avatar GTPS
        .addFields(
          { name: 'Level', value: player.level.toString(), inline: true },
          { name: 'Gems', value: player.gems.toString(), inline: true },
          { name: 'World', value: player.world || 'Unknown', inline: true },
          { name: 'Status', value: player.online ? '🟢 Online' : '🔴 Offline', inline: true },
          { name: 'XP', value: player.xp.toString(), inline: true },
          { name: 'User ID', value: player.userID.toString(), inline: true }
        )
        .setFooter({ text: 'GTPS Bot • Powered by GrowSoft API' })
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error:', error);
      message.reply('❌ Gagal mengambil info player. Pastikan username benar atau coba lagi nanti.');
    }
  }

  // Command: !status
  if (message.content.startsWith('!status')) {
    try {
      message.channel.sendTyping();
      
      const response = await axios.get(`${GTPS_API_URL}/api/server/status`);
      const status = response.data;

      const embed = new EmbedBuilder()
        .setColor(status.online ? 0x00FF00 : 0xFF0000)
        .setTitle('🖥️ Server Status')
        .addFields(
          { name: 'Status', value: status.online ? '🟢 Online' : '🔴 Offline', inline: true },
          { name: 'Players Online', value: status.players.toString(), inline: true },
          { name: 'Uptime', value: status.uptime || 'Unknown', inline: true },
          { name: 'Version', value: status.version || 'Unknown', inline: true }
        )
        .setFooter({ text: 'GTPS Bot • Powered by GrowSoft API' })
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error:', error);
      message.reply('❌ Gagal mengambil status server. Coba lagi nanti.');
    }
  }

  // Command: !help
  if (message.content.startsWith('!help')) {
    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('❓ GTPS Bot Help')
      .setDescription('Berikut adalah command yang tersedia:')
      .addFields(
        { name: '!player <username>', value: 'Mendapatkan info player GTPS' },
        { name: '!status', value: 'Mengecek status server GTPS' },
        { name: '!help', value: 'Menampilkan bantuan' }
      )
      .setFooter({ text: 'GTPS Bot • Powered by GrowSoft API' })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
});

// Handle errors
client.on('error', (error) => {
  console.error('❌ Discord Client Error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Promise Rejection:', error);
});

// Login bot dengan token
client.login(DISCORD_TOKEN).catch((error) => {
  console.error('❌ Login failed:', error);
  console.log('ℹ️ Pastikan DISCORD_TOKEN sudah diset dengan benar!');
});
