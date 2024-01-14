import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Deletes a message from a channel.
 * @param message The message to be deleted.
 * @returns A promise that resolves with the deleted message, or rejects with a DiscordAPIError.
 */
export default async (msg: Discord.Message) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (
  msg.inGuild()
   ? !canDeleteMessages(msg, msg.guild.members.me)
   : msg.author.id === msg.client.user.id
 ) {
  const e = requestHandlerError(
   `Cannot delete message in ${msg.inGuild() ? `${msg.guild.name} / ${msg.guild.id}` : `DMs`}`,
   [Discord.PermissionFlagsBits.ManageMessages],
  );

  if (msg.inGuild()) error(msg.guild, e);
  return e;
 }

 return API.channels.deleteMessage(msg.channelId, msg.id).catch((e) => {
  if (msg.inGuild()) error(msg.guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
};

/**
 * Checks if the given message can be deleted by the user.
 * @param msg - The message to be checked.
 * @param me - The user's guild member object.
 * @returns A boolean indicating whether the user can delete the message.
 */
export const canDeleteMessages = (msg: Discord.Message<true>, me: Discord.GuildMember | null) =>
 me &&
 (msg.author.id === me.id
  ? true
  : me.permissionsIn(msg.channel).has(Discord.PermissionFlagsBits.ManageMessages));
