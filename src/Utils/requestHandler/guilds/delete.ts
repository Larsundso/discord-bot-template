import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Deletes the specified guild.
 * @param guild The guild to delete.
 * @returns A promise that resolves with the deleted guild ID if successful,
 * or rejects with a DiscordAPIError if an error occurs.
 */
export default async (guild: Discord.Guild) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canDelete(guild.members.me)) {
  const e = requestHandlerError(`Cannot delete guild ${guild.name} / ${guild.id}`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  error(guild, e);
  return e;
 }

 return API.guilds.delete(guild.id).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
};

/**
 * Checks if the specified guild member has the permission to delete the guild.
 * @param me - The Discord guild member.
 * @returns A boolean indicating whether the guild member can delete the guild.
 */
export const canDelete = (me: Discord.GuildMember | null) => me && me.guild.ownerId === me.id;
