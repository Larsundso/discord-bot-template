import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Retrieves a message from a guild text-based channel by its ID.
 * @param channel - The guild text-based channel where the message is located.
 * @param messageId - The ID of the message to retrieve.
 * @returns A Promise that resolves with the retrieved message or rejects with an error.
 */
export default async (
 channel: Extract<Discord.TextBasedChannel, { messages: Discord.GuildMessageManager }>,
 messageId: string,
 force: boolean = false,
) => {
 if (!canGetMessage(channel, channel.guild.members.me)) {
  const e = requestHandlerError(
   `Cannot get message ${messageId} in ${channel.name} / ${channel.id}`,
   [
    Discord.PermissionFlagsBits.ViewChannel,
    Discord.PermissionFlagsBits.ReadMessageHistory,
    ...([Discord.ChannelType.GuildVoice, Discord.ChannelType.GuildStageVoice].includes(channel.type)
     ? [Discord.PermissionFlagsBits.Connect]
     : []),
   ],
  );

  error(channel.guild, e);
  return e;
 }

 const cachedM = channel.messages.cache.get(messageId);
 if (!force && cachedM) return cachedM;

 return API.channels
  .getMessage(channel.id, messageId)
  .then((m) => {
   const parsed = new Classes.Message(channel.guild.client, m);
   if (channel.messages.cache.get(parsed.id)) return parsed;
   channel.messages.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => e as Discord.DiscordAPIError);
};

/**
 * Checks if the user has the necessary permissions to get a message in a channel.
 * @param channel - The channel to check permissions in.
 * @param me - The user's guild member object.
 * @returns A boolean indicating whether the user has the necessary permissions.
 */
export const canGetMessage = (channel: Discord.GuildBasedChannel, me: Discord.GuildMember | null) =>
 me &&
 me.permissionsIn(channel).has(Discord.PermissionFlagsBits.ViewChannel) &&
 me.permissionsIn(channel).has(Discord.PermissionFlagsBits.ReadMessageHistory) &&
 ([Discord.ChannelType.GuildVoice, Discord.ChannelType.GuildStageVoice].includes(channel.type)
  ? me.permissionsIn(channel).has(Discord.PermissionFlagsBits.Connect)
  : true);
