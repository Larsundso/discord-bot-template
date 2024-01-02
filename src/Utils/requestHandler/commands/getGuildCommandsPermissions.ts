import * as Discord from 'discord.js';
import { API } from '../../../BaseClient/Client.js';
import error from '../../error.js';
import commandPermissions from '../../commandPermissions.js';

/**
 * Retrieves the permissions for all the slash commands in a guild.
 * @param guild - The guild to retrieve the permissions for.
 * @returns A promise that resolves to the permissions for all the slash commands in the guild.
 */
export default async (guild: Discord.Guild) =>
 API.applicationCommands
  .getGuildCommandsPermissions(guild.client.application.id, guild.id)
  .then((res) => {
   res.forEach((r) => {
    commandPermissions.set(guild.id, r.id, r.permissions);
    return r.permissions;
   });

   return res;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
