import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Sets the voice state for the given guild.
 * @param guild - The guild for which the voice state is to be set.
 * @param body - Optional JSON body containing the voice state data.
 * @returns A promise that resolves with the updated voice state,
 * or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 body?: Discord.RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canSetVoiceState(guild.members.me, body)) {
  const e = requestHandlerError(`Cannot set voice state`, [
   Discord.PermissionFlagsBits.RequestToSpeak,
  ]);

  error(guild, e);
  return e;
 }

 return API.guilds.setVoiceState(guild.id, body).catch((e) => {
  error(guild, new Error((e as Discord.DiscordAPIError).message));
  return e as Discord.DiscordAPIError;
 });
};
/**
 * Checks if the user has the necessary permissions to set the voice state.
 * @param me - The Discord guild member representing the user.
 * @returns A boolean indicating whether the user can set the voice state.
 */
export const canSetVoiceState = (
 me: Discord.GuildMember | null,
 body?: Discord.RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody,
) => {
 if (!me) return false;
 if (!body) return true;
 if (!body.channel_id) return true;
 if (!body.suppress) {
  return me.permissionsIn(body.channel_id).has(Discord.PermissionFlagsBits.RequestToSpeak);
 }
 return true;
};
