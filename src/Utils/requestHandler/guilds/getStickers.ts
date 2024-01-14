import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';

/**
 * Retrieves the stickers for a given guild.
 * @param guild The guild to retrieve the stickers for.
 * @returns A Promise that resolves with an array of parsed Sticker objects.
 */
export default async (guild: Discord.Guild) =>
 API.guilds
  .getStickers(guild.id)
  .then((stickers) => {
   const parsed = stickers.map((s) => new Classes.Sticker(guild.client, s));
   parsed.forEach((p) => {
    if (guild.stickers.cache.get(p.id)) return;
    guild.stickers.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
