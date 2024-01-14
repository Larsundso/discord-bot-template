import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';

import { canBanUser } from './banUser.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Bans a user from a guild.
 * @param member The member to ban.
 * @param body Optional request body to send.
 * @param reason Reason for banning the user.
 * @returns A promise that resolves with the DiscordAPIError if the request fails, otherwise void.
 */
export default async (
 member: Discord.GuildMember,
 body?: Discord.RESTPutAPIGuildBanJSONBody,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canBanUser(member.guild.members.me)) {
  const e = requestHandlerError(`Cannot ban member in ${member.displayName} / ${member.id}`, [
   Discord.PermissionFlagsBits.BanMembers,
  ]);

  error(member.guild, e);
  return e;
 }

 return API.guilds
  .banUser(member.guild.id, member.id, body, { reason })
  .catch((e) => {
   error(member.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has the permission to ban another member.
 * @param me - The guild member to check.
 * @returns True if the guild member has the permission to ban another member, false otherwise.
 */
export const canBanMember = (me: Discord.GuildMember | null, member: Discord.GuildMember) =>
 me &&
 (me.guild.ownerId === me.id ||
  (canBanUser(me) && member.roles.highest.comparePositionTo(me.roles.highest) < 0));
