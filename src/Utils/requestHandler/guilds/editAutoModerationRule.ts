import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Edits an auto-moderation rule for a guild.
 * @param guild The guild to edit the auto-moderation rule for.
 * @param ruleId The ID of the auto-moderation rule to edit.
 * @param body The new data for the auto-moderation rule.
 * @param reason The reason for editing the auto-moderation rule.
 * @returns A promise that resolves with the updated auto-moderation rule,
 * or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 ruleId: string,
 body: Discord.RESTPatchAPIAutoModerationRuleJSONBody,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canEditAutoModerationRule(guild.members.me)) {
  const e = requestHandlerError(`Cannot edit auto-moderation rule ${ruleId}`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  error(guild, e);
  return e;
 }

 return API.guilds
  .editAutoModerationRule(guild.id, ruleId, body, { reason })
  .then((r) => new Classes.AutoModerationRule(guild.client, r, guild))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member has the necessary permissions to edit an auto-moderation rule.
 * @param me - The Discord guild member.
 * @returns True if the guild member has the "ManageGuild" permission, false otherwise.
 */
export const canEditAutoModerationRule = (me: Discord.GuildMember | null) =>
 me && me.permissions.has(Discord.PermissionFlagsBits.ManageGuild);
