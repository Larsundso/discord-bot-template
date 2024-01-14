import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Unpins a message from a channel.
 * @param message The message to unpin.
 * @returns A promise that resolves with the unpinned message, or rejects with an error.
 */
export default async (message: Discord.Message<true>) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canUnPinMessage(message.channelId, message.guild.members.me)) {
  const e = requestHandlerError(
   `Cannot unpin message in ${message.guild.name} / ${message.guild.id}`,
   [Discord.PermissionFlagsBits.ManageMessages],
  );

  error(message.guild, e);
  return e;
 }

 return API.channels.unpinMessage(message.channelId, message.id).catch((e) => {
  error(message.guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
};

/**
 * Checks if the user has the permission to unpin messages in a guild text-based channel.
 * @param channelId - The ID of the guild text-based channel to check.
 * @param me - The guild member representing the user.
 * @returns A boolean indicating whether the user can pin messages in the channel.
 */
export const canUnPinMessage = (channelId: string, me: Discord.GuildMember | null) =>
 me && me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ManageMessages);
