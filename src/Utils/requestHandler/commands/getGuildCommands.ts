import * as Discord from 'discord.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';
import error from '../../error.js';

/**
 * Retrieves the guild commands for a given guild.
 * @param guild The guild to retrieve the commands for.
 * @param query Optional query parameters to include in the request.
 * @returns A Promise that resolves with an array of parsed ApplicationCommand objects.
 */
export default async (
 guild: Discord.Guild,
 query?: Discord.RESTGetAPIApplicationGuildCommandsQuery,
) =>
 API.applicationCommands
  .getGuildCommands(guild.client.application.id, guild.id, query)
  .then((cmds) => {
   const parsed = cmds.map(
    (cmd) => new Classes.ApplicationCommand(guild.client, cmd, guild, guild.id),
   );

   parsed.forEach((p) => {
    if (guild.commands.cache.get(p.id)) return;
    guild.commands.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
