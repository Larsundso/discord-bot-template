import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Deletes an auto-moderation rule from a guild.
 * @param guild - The guild to delete the auto-moderation rule from.
 * @param ruleId - The ID of the auto-moderation rule to delete.
 * @param reason - The reason for deleting the auto-moderation rule.
 * @returns A promise that resolves with the deleted auto-moderation rule,
 * or rejects with an error.
 */
export default async (guild: Discord.Guild, ruleId: string, reason?: string) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canDeleteAutoModerationRule(guild.members.me)) {
  const e = requestHandlerError(`Cannot delete auto-moderation rule ${ruleId}`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  error(guild, e);
  return e;
 }

 return API.guilds.deleteAutoModerationRule(guild.id, ruleId, { reason }).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
};
/**
 * Checks if the given Discord GuildMember has the permission to delete an auto-moderation rule.
 * @param me - The Discord GuildMember object representing the bot itself.
 * @returns A boolean indicating whether the GuildMember has the required permission.
 */
export const canDeleteAutoModerationRule = (me: Discord.GuildMember | null) =>
 me && me.permissions.has(Discord.PermissionFlagsBits.ManageGuild);
