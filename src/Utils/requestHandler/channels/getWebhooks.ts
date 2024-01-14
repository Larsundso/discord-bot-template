import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Retrieves the webhooks for a given guild text-based channel or forum channel.
 * @param channel - The guild text-based channel or forum channel to retrieve webhooks for.
 * @returns A promise that resolves with an array of webhooks for the given channel.
 */
export default async (
 channel: Discord.GuildTextBasedChannel | Discord.ForumChannel | Discord.MediaChannel,
) => {
 if (!canGetWebhooks(channel.id, channel.guild.members.me)) {
  const e = requestHandlerError(`Cannot get webhooks in ${channel.name} / ${channel.id}`, [
   Discord.PermissionFlagsBits.ManageWebhooks,
  ]);

  error(channel.guild, e);
  return e;
 }

 return API.channels
  .getWebhooks(channel.id)
  .then((webhooks) => webhooks.map((w) => new Classes.Webhook(channel.client, w)))
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the user has permission to get webhooks in a given channel.
 * @param channelId - The ID of the channel to check permissions in.
 * @param me - The user's guild member object.
 * @returns A boolean indicating whether the user has permission to manage webhooks in the channel.
 */
export const canGetWebhooks = (channelId: string, me: Discord.GuildMember | null) =>
 me && me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ManageWebhooks);
