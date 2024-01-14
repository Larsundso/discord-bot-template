import * as Discord from 'discord.js';
import { API } from '../../../BaseClient/Client.js';
import error from '../../error.js';
import commandPermissions from '../../commandPermissions.js';

/**
 * Retrieves the permissions for a specific command in a guild.
 * @param guild - The guild where the command is located.
 * @param commandId - The ID of the command to retrieve permissions for.
 * @returns A promise that resolves with the command permissions, or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, commandId: string) =>
 API.applicationCommands
  .getGuildCommandPermissions(guild.client.application.id, guild.id, commandId)
  .then((res) => {
   commandPermissions.set(guild.id, commandId, res.permissions);
   return res.permissions;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
