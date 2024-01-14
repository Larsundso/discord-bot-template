import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';

/**
 * Retrieves scheduled events for a given guild.
 * @param guild - The guild to retrieve scheduled events for.
 * @returns A promise that resolves with an array of parsed scheduled events.
 */
export default async (guild: Discord.Guild) =>
 API.guilds
  .getScheduledEvents(guild.id)
  .then((events) => {
   const parsed = events.map((e) => new Classes.GuildScheduledEvent(guild.client, e));
   parsed.forEach((p) => {
    if (guild.scheduledEvents.cache.get(p.id)) return;
    guild.scheduledEvents.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
