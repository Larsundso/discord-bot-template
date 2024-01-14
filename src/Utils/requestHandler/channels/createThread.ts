import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Creates a thread in a guild text-based channel.
 * @param channel - The guild text-based channel where the thread will be created.
 * @param body - The REST API JSON body for creating the thread.
 * @param messageId - The ID of the message to create the thread from.
 * @returns A promise that resolves with the created thread or rejects with a DiscordAPIError.
 */
export default async (
 channel: Discord.GuildTextBasedChannel,
 body: Discord.RESTPostAPIChannelThreadsJSONBody,
 messageId?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canCreateThread(channel.id, body, channel.guild.members.me)) {
  const e = requestHandlerError(
   `Cannot create ${
    body.type === Discord.ChannelType.PrivateThread ? 'private' : 'public / announcement'
   } threads in ${channel.name} / ${channel.id}`,
   [
    body.type === Discord.ChannelType.PublicThread
     ? Discord.PermissionFlagsBits.CreatePublicThreads
     : Discord.PermissionFlagsBits.CreatePrivateThreads,
   ],
  );

  error(channel.guild, e);
  return e;
 }

 return API.channels
  .createThread(channel.id, body, messageId)
  .then((t) => Classes.Channel<10>(channel.client, t, channel.guild))
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given user has permission to create a thread in the specified channel.
 * @param channelId - The ID of the guild text-based channel to check.
 * @param me - The guild member representing the user.
 * @returns True if the user has permission to create a thread, false otherwise.
 */
export const canCreateThread = (
 channelId: string,
 body: Discord.RESTPostAPIChannelThreadsJSONBody,
 me: Discord.GuildMember | null,
) =>
 me &&
 (body.type === Discord.ChannelType.PublicThread
  ? me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.CreatePublicThreads)
  : me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.CreatePrivateThreads));
