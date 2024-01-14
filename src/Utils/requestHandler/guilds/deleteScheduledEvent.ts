import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Deletes a scheduled event for a guild.
 * @param guild - The guild where the event is scheduled.
 * @param eventId - The ID of the scheduled event to delete.
 * @param reason - The reason for deleting the scheduled event.
 * @returns A promise that resolves with the deleted event, or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, eventId: string, reason?: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canDeleteScheduledEvent(guild.members.me)) {
  const e = requestHandlerError(`Cannot delete scheduled event ${eventId}`, [
   Discord.PermissionFlagsBits.ManageEvents,
  ]);

  error(guild, e);
  return e;
 }

 return API.guilds.deleteScheduledEvent(guild.id, eventId, { reason }).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
};

/**
 * Checks if the given guild member has the necessary permissions to delete a scheduled event.
 * @param me - The Discord guild member.
 * @returns True if the guild member has the necessary permissions, false otherwise.
 */
export const canDeleteScheduledEvent = (me: Discord.GuildMember | null) =>
 me && me.permissions.has(Discord.PermissionFlagsBits.ManageEvents);
