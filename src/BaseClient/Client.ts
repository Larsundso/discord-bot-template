import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

const client = new Discord.Client({
 shards: 'auto',
 allowedMentions: {
  parse: ['users'],
  repliedUser: false,
 },
 partials: [],
 failIfNotExists: false,
 presence: {
  status: Discord.PresenceUpdateStatus.Idle,
  afk: false,
  activities: [
   {
    state: 'Starting up...',
    name: 'Starting up...',
    type: Discord.ActivityType.Custom,
   },
  ],
 },
 intents: [Discord.IntentsBitField.Flags.Guilds, Discord.IntentsBitField.Flags.GuildMembers],
});

await client.login(process.env.TOKEN);

export const API = new DiscordCore.API(client.rest);
export default client;
