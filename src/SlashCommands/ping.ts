import * as Discord from 'discord.js';
import client from '../BaseClient/Client.js';

export default new Discord.SlashCommandBuilder()
 .setName('ping')
 .setDescription(`Display the ${client.user?.username}'s Ping`)
 .setDMPermission(true);
