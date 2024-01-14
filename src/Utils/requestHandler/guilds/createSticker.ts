import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Creates a new sticker for the given guild.
 * @param guild The guild to create the sticker in.
 * @param body The sticker data to send in the request.
 * @param reason The reason for creating the sticker.
 * @returns A promise that resolves with the created sticker, or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 body: Omit<Discord.RESTPostAPIGuildStickerFormDataBody, 'file'> & {
  file: Discord.RawFile;
 },
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canCreateSticker(guild.members.me)) {
  const e = requestHandlerError(`Cannot create sticker`, [
   Discord.PermissionFlagsBits.ManageGuildExpressions,
  ]);

  error(guild, e);
  return e;
 }

 return API.guilds
  .createSticker(guild.id, body, { reason })
  .then((s) => new Classes.Sticker(guild.client, s))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

// TODO: CreateGuildExpressions should be coming to D.js soon.
/**
 * Checks if the given guild member has the permission to create an sticker.
 * @param me - The guild member to check.
 * @returns True if the guild member has the permission to create an sticker, false otherwise.
 */
export const canCreateSticker = (me: Discord.GuildMember | null) =>
 me &&
 (me.permissions.has(8796093022208n) ||
  me.permissions.has(Discord.PermissionFlagsBits.ManageGuildExpressions));
