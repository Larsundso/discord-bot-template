import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Sends a message to a Discord channel.
 * @param guild The guild where the channel is located.
 * @param channelId The ID of the channel where the message will be sent.
 * @param payload The message content and options.
 * @param client The Discord client instance.
 * @returns A Promise that resolves to a new Message object if the message was sent successfully,
 * or rejects with a DiscordAPIError if an error occurred.
 */
export default async (
 guild: Discord.Guild | undefined | null,
 channelId: string,
 payload: Discord.RESTPostAPIChannelMessageJSONBody & {
  files?: Discord.RawFile[];
 },
 client: Discord.Client<true>,
): Promise<Discord.Message | Discord.DiscordAPIError | Error> => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (guild && !canSendMessage(channelId, payload, guild.members.me)) {
  const e = requestHandlerError(`Cannot send message`, [
   Discord.PermissionFlagsBits.ViewChannel,
   Discord.PermissionFlagsBits.SendMessages,
   Discord.PermissionFlagsBits.SendMessagesInThreads,
   Discord.PermissionFlagsBits.ReadMessageHistory,
   Discord.PermissionFlagsBits.AttachFiles,
  ]);

  error(guild, e, false);
  return e;
 }

 return API.channels
  .createMessage(channelId, {
   ...payload,
   message_reference: payload.message_reference
    ? { ...payload.message_reference, fail_if_not_exists: false }
    : undefined,
  })
  .then((m) => new Classes.Message(client, m))
  .catch((e: Discord.DiscordAPIError) => {
   if (guild) error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Determines whether the user can send a message in a channel.
 * @param channelId - The ID of the channel in which the message will be sent.
 * @param payload - The message payload, including optional files.
 * @param me - The guild member representing the user.
 * @returns A boolean indicating whether the user can send the message.
 */
export const canSendMessage = (
 channelId: string,
 payload: Discord.RESTPostAPIChannelMessageJSONBody & {
  files?: Discord.RawFile[];
 },
 me: Discord.GuildMember | null,
) => {
 if (!me) return false;
 if (!channelId) return true;

 const channel = me.guild.channels.cache.get(channelId);
 if (!channel) return false;

 switch (true) {
  case !me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ViewChannel):
   return false;
  case Number(me.communicationDisabledUntilTimestamp) > Date.now():
   return false;
  case channel &&
   !channel?.isThread() &&
   !me?.permissionsIn(channelId).has(Discord.PermissionFlagsBits.SendMessages):
  case channel &&
   channel?.isThread() &&
   !me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.SendMessagesInThreads):
   return false;
  case payload.tts &&
   !me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.SendTTSMessages): {
   payload.tts = false;
   return true;
  }
  case payload.message_reference &&
   !me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ReadMessageHistory): {
   payload.message_reference = undefined;
   return true;
  }
  case payload.files?.length &&
   !me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.AttachFiles):
   return false;

  default:
   return true;
 }
};
