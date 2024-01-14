import * as Discord from 'discord.js';

export default new Discord.SlashCommandBuilder()
 .setName('ping')
 .setDescription(`Display the Ping`)
 .setDMPermission(true);
