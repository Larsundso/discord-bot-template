import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';

/**
 * Retrieves the roles of a guild from the Discord API
 * and parses them into an array of Role objects.
 * @param guild - The guild to retrieve the roles from.
 * @returns A Promise that resolves with an array of Role objects.
 */
export default async (guild: Discord.Guild) =>
 API.guilds
  .getRoles(guild.id)
  .then((roles) => {
   const parsed = roles.map((r) => new Classes.Role(guild.client, r, guild));
   parsed.forEach((p) => {
    if (guild.roles.cache.get(p.id)) return;
    guild.roles.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
