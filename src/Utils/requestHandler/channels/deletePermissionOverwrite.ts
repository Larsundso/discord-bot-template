import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Deletes a permission overwrite for a channel in a guild.
 * @param channel - The guild-based channel where the permission overwrite is being deleted.
 * @param overwriteId - The ID of the permission overwrite to delete.
 * @param reason - The reason for deleting the permission overwrite.
 * @returns A promise that resolves with the deleted permission overwrite,
 * or rejects with a DiscordAPIError.
 */
export default async (channel: Discord.GuildBasedChannel, overwriteId: string, reason?: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canDeletePermissionOverwrite(channel.id, channel.guild.members.me)) {
  const e = requestHandlerError(
   `Cannot delete permission overwrite in ${channel.name} / ${channel.id}`,
   [Discord.PermissionFlagsBits.ManageRoles],
  );

  error(channel.guild, e);
  return e;
 }

 return API.channels.deletePermissionOverwrite(channel.id, overwriteId, { reason }).catch((e) => {
  error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
};
/**
 * Checks if the user has the permission to delete a permission overwrite in a channel.
 * @param channelId - The ID of the guild-based channel to check.
 * @param me - The guild member representing the user.
 * @returns A boolean indicating whether the user has the permission to
 * delete the permission overwrite.
 */
export const canDeletePermissionOverwrite = (channelId: string, me: Discord.GuildMember | null) =>
 me && me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ManageRoles);
