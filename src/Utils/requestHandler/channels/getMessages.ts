import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';

import { canGetMessage } from './getMessage.js';import requestHandlerError from '../../requestHandlerError.js';

/**
 * Retrieves messages from a guild text-based channel.
 * @param channel - The guild text-based channel to retrieve messages from.
 * @param query - The query parameters to include in the request.
 * @returns A promise that resolves with an array of parsed messages.
 */
export default async (
 channel: Discord.GuildTextBasedChannel,
 query?: Discord.RESTGetAPIChannelMessagesQuery,
) => {
 if (!canGetMessage(channel, channel.guild.members.me)) {
  const e = requestHandlerError(`Cannot get messages in ${channel.name} / ${channel.id}`, [
   Discord.PermissionFlagsBits.ViewChannel,
   Discord.PermissionFlagsBits.ReadMessageHistory,
   ...([Discord.ChannelType.GuildVoice, Discord.ChannelType.GuildStageVoice].includes(channel.type)
    ? [Discord.PermissionFlagsBits.Connect]
    : []),
  ]);

  error(channel.guild, e);
  return e;
 }

 return API.channels
  .getMessages(channel.id, query)
  .then((msgs) => {
   const parsed = msgs.map((m) => new Classes.Message(channel.client, m));
   parsed.forEach((p) => {
    if (channel.messages.cache.get(p.id)) return;
    channel.messages.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
