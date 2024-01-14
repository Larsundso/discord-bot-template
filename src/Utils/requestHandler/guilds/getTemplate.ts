import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';

/**
 * Returns a Promise that resolves with a new GuildTemplate instance for the given guild.
 * If the guild has an API cache, it will use that cache, otherwise it will use the default API.
 * If an error occurs, it will log the error and return the DiscordAPIError.
 * @param guild The guild to get the template for.
 * @returns A Promise that resolves with a new GuildTemplate instance for the given guild.
 */
export default async (guild: Discord.Guild) =>
 API.guilds
  .getTemplate(guild.id)
  .then((t) => new Classes.GuildTemplate(guild.client, t))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
