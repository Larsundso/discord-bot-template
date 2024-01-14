import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';

/**
 * Retrieves all members of a given thread channel.
 * @param thread - The thread channel to retrieve members from.
 * @returns A promise that resolves with an array of ThreadMember objects
 * representing the members of the thread.
 */
export default async (thread: Discord.ThreadChannel) =>
 API.threads
  .getAllMembers(thread.id)
  .then((members) => {
   const parsed = members.map((m) => new Classes.ThreadMember(thread, m));
   parsed.forEach((p) => {
    if (thread.members.cache.get(p.id)) return;
    thread.members.cache.set(p.id, p);
   });
   return parsed;
  })
  .catch((e) => {
   error(thread.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
