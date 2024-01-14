import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Deletes a guild template.
 * @param guild - The guild where the template is located.
 * @param templateCode - The code of the template to delete.
 * @returns A promise that resolves with the deleted template,
 * or rejects with a DiscordAPIError if an error occurs.
 */
export default async (guild: Discord.Guild, templateCode: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canDeleteTemplate(guild.members.me)) {
  const e = requestHandlerError(`Cannot delete template ${templateCode}`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  error(guild, e);
  return e;
 }

 return API.guilds.deleteTemplate(guild.id, templateCode).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
};
export const canDeleteTemplate = (me: Discord.GuildMember | null) =>
 me && me.permissions.has(Discord.PermissionFlagsBits.ManageGuild);
