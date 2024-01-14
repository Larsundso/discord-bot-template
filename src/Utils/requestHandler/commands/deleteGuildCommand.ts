import * as Discord from 'discord.js';
import { API } from '../../../BaseClient/Client.js';
import error from '../../error.js';

/**
 * Deletes a guild command from the Discord API and removes it from the guild's command cache.
 * @param guild The guild where the command is located.
 * @param commandId The ID of the command to be deleted.
 * @returns A promise that resolves when the command is successfully deleted,
 * or rejects with a DiscordAPIError if an error occurs.
 */
export default async (guild: Discord.Guild, commandId: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 return API.applicationCommands
  .deleteGuildCommand(guild.client.application.id, guild.id, commandId)
  .then(() => {
   guild.commands.cache.delete(commandId);
  })
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
