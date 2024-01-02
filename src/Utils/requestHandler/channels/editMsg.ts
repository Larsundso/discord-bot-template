import * as DiscordCore from '@discordjs/core';
import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Edits a message in a channel.
 * @param message - The message to edit.
 * @param payload - The new message content and options.
 * @returns A promise that resolves with the edited message, or rejects with a DiscordAPIError.
 */
export default async (
 message: Discord.Message<true>,
 payload: Parameters<DiscordCore.ChannelsAPI['editMessage']>[2],
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canEditMessage(message, payload, message.guild.members.me)) {
  const e = requestHandlerError(
   `Cannot edit message in ${message.guild.name} / ${message.guild.id}`,
   [Discord.PermissionFlagsBits.ManageMessages],
  );

  error(message.guild, e);
  return e;
 }

 return API.channels
  .editMessage(message.channel.id, message.id, payload)
  .then((m) => new Classes.Message(message.client, m))
  .catch((e) => {
   error(message.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the message can be edited.
 * @param msg - The message to be edited.
 * @param payload - The payload containing the message edit data.
 * @param me - The guild member representing the user.
 * @returns Returns true if the message can be edited, otherwise false.
 */
export const canEditMessage = (
 msg: Discord.Message<true>,
 payload: Parameters<DiscordCore.ChannelsAPI['editMessage']>[2],
 me: Discord.GuildMember | null,
) =>
 me &&
 (msg.author.id === me.id
  ? true
  : me.permissionsIn(msg.channelId).has(Discord.PermissionFlagsBits.ManageMessages) &&
    !!payload.flags);
