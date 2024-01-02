import * as Discord from 'discord.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';
import error from '../../error.js';

/**
 * Retrieves a global command from the cache or from the Discord API.
 * @param guild - The guild where the command is located.
 * @param commandId - The ID of the command to retrieve.
 * @returns A Promise that resolves with the retrieved command or rejects with an error.
 */
export default async (guild: Discord.Guild, commandId: string) =>
 guild.client.application.commands.cache.get(commandId) ??
 API.applicationCommands
  .getGlobalCommand(guild.client.application.id, commandId)
  .then((cmd) => {
   const parsed = new Classes.ApplicationCommand(guild.client, cmd);

   guild.client.application.commands.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
