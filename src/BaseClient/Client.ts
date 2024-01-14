import * as Sharding from 'discord-hybrid-sharding';
import * as Discord from 'discord.js';
import * as DiscordCore from '@discordjs/core';

const client = new Discord.Client({
 shards: Sharding.getInfo().SHARD_LIST,
 shardCount: Sharding.getInfo().TOTAL_SHARDS,
 allowedMentions: {
  parse: ['users'],
  repliedUser: false,
 },
 partials: [Discord.Partials.Reaction, Discord.Partials.Message],
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
 intents: [
  Discord.IntentsBitField.Flags.Guilds,
  Discord.IntentsBitField.Flags.GuildMessageReactions,
  Discord.IntentsBitField.Flags.GuildMessages,
  Discord.IntentsBitField.Flags.MessageContent,
 ],
});

await client.login(process.env.Token);

client.cluster = new Sharding.ClusterClient(client);

export const API = new DiscordCore.API(client.rest);
export default client;
