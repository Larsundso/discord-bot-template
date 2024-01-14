import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Sets the positions of a guild's roles.
 * @param guild The guild to set the role positions for.
 * @param body The JSON body containing the new role positions.
 * @param reason The reason for setting the role positions (optional).
 * @returns A promise that resolves with an array of Role objects representing the updated roles,
 * or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 body: Discord.RESTPatchAPIGuildRolePositionsJSONBody,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canSetRolePositions(guild.members.me, body)) {
  const e = requestHandlerError(`Cannot set role positions`, [
   Discord.PermissionFlagsBits.ManageRoles,
  ]);

  error(guild, e);
  return e;
 }

 return API.guilds
  .setRolePositions(guild.id, body, { reason })
  .then((roles) => roles.map((r) => new Classes.Role(guild.client, r, guild)))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
/**
 * Checks if the user has the necessary permissions to set role positions.
 * @param me - The Discord guild member representing the user.
 * @returns A boolean indicating whether the user can set role positions.
 */
export const canSetRolePositions = (
 me: Discord.GuildMember | null,
 body: Discord.RESTPatchAPIGuildRolePositionsJSONBody,
) =>
 me &&
 (me.guild.ownerId === me.id ||
  (me.permissions.has(Discord.PermissionFlagsBits.ManageRoles) &&
   body.every(
    (r) =>
     me.roles.highest.comparePositionTo(r.id) > 0 && me.roles.highest.position > Number(r.position),
   )));
