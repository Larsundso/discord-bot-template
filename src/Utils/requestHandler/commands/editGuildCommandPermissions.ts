import * as Discord from 'discord.js';
import { API } from '../../../BaseClient/Client.js';
import error from '../../error.js';
import commandPermissions from '../../commandPermissions.js';

/**
 * Edits the permissions for a command in a guild.
 * @param guild The guild where the command is located.
 * @param userToken The token of the user making the request.
 * @param commandId The ID of the command to edit.
 * @param body The new permissions for the command.
 * @returns A promise that resolves with the updated command permissions
 * or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 userToken: string,
 commandId: string,
 body: Discord.RESTPutAPIApplicationCommandPermissionsJSONBody,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 return API.applicationCommands
  .editGuildCommandPermissions(userToken, guild.client.application.id, guild.id, commandId, body)
  .then((res) => {
   commandPermissions.set(guild.id, commandId, res.permissions);
   return res.permissions;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
