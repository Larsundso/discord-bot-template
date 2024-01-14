import * as Discord from 'discord.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';
import error from '../../error.js';

/**
 * Creates a global command for the given guild.
 * @param guild - The guild to create the command for.
 * @param body - The REST API JSON body for the command.
 * @returns A Promise that resolves with the created ApplicationCommand object,
 * or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 body: Discord.RESTPostAPIApplicationCommandsJSONBody,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 return API.applicationCommands
  .createGlobalCommand(guild.client.application.id, body)
  .then((cmd) => {
   const parsed = new Classes.ApplicationCommand(guild.client, cmd);

   guild.client.application.commands.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
