import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';

/**
 * Retrieves members from a guild.
 * @param guild - The guild to retrieve members from.
 * @param query - The query parameters for the API request.
 * @returns A promise that resolves with an array of GuildMember objects.
 */
export default async (guild: Discord.Guild, query?: Discord.RESTGetAPIGuildMembersQuery) =>
 API.guilds
  .getMembers(guild.id, query)
  .then((members) => {
   const parsed = members.map((m) => new Classes.GuildMember(guild.client, m, guild));
   parsed.forEach((p) => {
    if (guild.members.cache.get(p.id)) return;
    guild.members.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
