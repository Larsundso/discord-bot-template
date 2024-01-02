import * as Discord from 'discord.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';
import error from '../../error.js';

/**
 * Retrieves the global slash commands for a guild.
 * @param guild - The guild to retrieve the commands for.
 * @param query - Optional query parameters to filter the commands.
 * @returns A Promise that resolves to an array of parsed ApplicationCommand objects.
 */
export default async (
 guild: Discord.Guild | undefined,
 client: Discord.Client<true>,
 query?: Discord.RESTGetAPIApplicationCommandsQuery,
) =>
 API.applicationCommands
  .getGlobalCommands(guild ? guild.client.application.id : client.user.id, query)
  .then((cmds) => {
   const parsed = cmds.map((cmd) => new Classes.ApplicationCommand(client, cmd));

   parsed.forEach((p) => client.application.commands.cache.set(p.id, p));
   return parsed;
  })
  .catch((e) => {
   if (guild) error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
