import * as Discord from 'discord.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';
import error from '../../error.js';

/**
 * Edits a guild command for a given guild.
 * @param guild The guild where the command is located.
 * @param commandId The ID of the command to edit.
 * @param body The new command data to update.
 * @returns A Promise that resolves with the updated command.
 */
export default async (
 guild: Discord.Guild,
 commandId: string,
 body: Discord.RESTPatchAPIApplicationGuildCommandJSONBody,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 return API.applicationCommands
  .editGuildCommand(guild.client.application.id, guild.id, commandId, body)
  .then((cmd) => {
   const parsed = new Classes.ApplicationCommand(guild.client, cmd, guild, guild.id);

   guild.commands.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
