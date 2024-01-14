import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';

/**
 * Returns the current user for the given guild.
 * @param guild - The guild to get the current user for.
 * @returns A promise that resolves with a new instance of the ClientUser class
 * representing the current user, or rejects with a DiscordAPIError if an error occurs.
 */
export default async (guild: Discord.Guild) =>
 API.users
  .getCurrent()
  .then((u) => new Classes.ClientUser(guild.client, u))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
