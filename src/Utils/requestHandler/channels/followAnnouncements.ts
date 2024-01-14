import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Follows announcements from a specified channel in a guild text-based channel.
 * @param channel - The guild text-based channel to follow announcements in.
 * @param followedChannelId - The ID of the channel to follow announcements from.
 * @returns A Promise that resolves to an object containing the ID of the source channel
 * and the ID of the created webhook,
 * or rejects with a DiscordAPIError.
 */
export default async (channel: Discord.GuildTextBasedChannel, followedChannelId: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canFollowAnnouncements(channel.id, channel.guild.members.me)) {
  const e = requestHandlerError(`Cannot follow announcements in ${channel.name} / ${channel.id}`, [
   Discord.PermissionFlagsBits.ManageWebhooks,
  ]);

  error(channel.guild, e);
  return e;
 }

 return API.channels
  .followAnnouncements(followedChannelId, channel.id)
  .then((c) => ({ sourceChannelId: c.channel_id, createdWebhookId: c.webhook_id }))
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the user has the necessary permissions to follow announcements.
 * @param channelId - The ID of the guild text-based channel to check.
 * @param me - The guild member representing the user.
 * @returns A boolean indicating whether the user can follow announcements in the channel.
 */
export const canFollowAnnouncements = (channelId: string, me: Discord.GuildMember | null) =>
 me && me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ManageWebhooks);
