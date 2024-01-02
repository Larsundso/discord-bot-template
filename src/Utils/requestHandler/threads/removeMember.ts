import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import requestHandlerError from '../../requestHandlerError.js';
/**
 * Removes a member from a thread in a guild.
 * @param guild - The guild where the thread is located.
 * @param thread - The thread to remove the member from.
 * @param userId - The ID of the user to remove from the thread.
 * @returns A promise that resolves with the removed member's ID if successful,
 * or rejects with a DiscordAPIError if unsuccessful.
 */
export default async (thread: Discord.ThreadChannel, userId: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canRemoveMember(thread.guild.members.me, thread)) {
  const e = requestHandlerError(
   `Cannot remove member ${userId} from thread ${thread.id} in ${thread.guild.name} / ${thread.guild.id}`,
   [Discord.PermissionFlagsBits.ManageThreads],
  );

  error(thread.guild, e);
  return e;
 }

 return API.threads.removeMember(thread.id, userId).catch((e) => {
  error(thread.guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
};

/**
 * Checks if the given guild member has the permission to remove members from threads.
 * @param me - The guild member to check.
 * @param thread - The thread channel.
 * @returns A boolean indicating whether the guild member can remove members from threads.
 */
export const canRemoveMember = (me: Discord.GuildMember | null, thread: Discord.ThreadChannel) =>
 me &&
 !thread.archived &&
 (me.permissionsIn(thread.id).has(Discord.PermissionFlagsBits.ManageThreads) ||
  me.id === thread.ownerId);
