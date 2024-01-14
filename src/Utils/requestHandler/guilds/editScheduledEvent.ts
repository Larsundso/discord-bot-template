import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Edits a scheduled event for a guild.
 * @param guild The guild where the scheduled event belongs.
 * @param eventId The ID of the scheduled event to edit.
 * @param body The new data for the scheduled event.
 * @param reason The reason for editing the scheduled event.
 * @returns A promise that resolves with the edited scheduled event,
 * or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 eventId: string,
 body: Discord.RESTPatchAPIGuildScheduledEventJSONBody,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canEditScheduledEvent(guild.members.me)) {
  const e = requestHandlerError(`Cannot edit scheduled event ${eventId}`, [
   Discord.PermissionFlagsBits.ManageEvents,
  ]);

  error(guild, e);
  return e;
 }

 return API.guilds
  .editScheduledEvent(
   guild.id,
   eventId,
   {
    ...body,
    image: body.image ? await Discord.DataResolver.resolveImage(body.image) : body.image,
   },
   { reason },
  )
  .then((e) => new Classes.GuildScheduledEvent(guild.client, e))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has the necessary permissions to edit a scheduled event.
 * @param me - The Discord guild member.
 * @returns True if the guild member has the "Manage Events" permission, false otherwise.
 */
export const canEditScheduledEvent = (me: Discord.GuildMember | null) =>
 me && me.permissions.has(Discord.PermissionFlagsBits.ManageEvents);
