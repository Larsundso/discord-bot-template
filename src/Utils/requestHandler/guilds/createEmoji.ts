import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Creates a new emoji for the specified guild.
 * @param guild The guild to create the emoji in.
 * @param body The emoji data to create.
 * @param reason The reason for creating the emoji.
 * @returns A promise that resolves with the created GuildEmoji object,
 *  or rejects with a DiscordAPIError.
 */
export default async (
 guild: Discord.Guild,
 body: Discord.RESTPostAPIGuildEmojiJSONBody,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canCreateEmoji(guild.members.me)) {
  const e = requestHandlerError(`Cannot create emoji`, [
   Discord.PermissionFlagsBits.ManageGuildExpressions,
  ]);

  error(guild, e);
  return e;
 }

 return API.guilds
  .createEmoji(
   guild.id,
   {
    ...body,
    image: (await Discord.DataResolver.resolveImage(body.image)) as string,
   },
   { reason },
  )
  .then((e) => new Classes.GuildEmoji(guild.client, e, guild))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

// TODO: CreateGuildExpressions should be coming to D.js soon.
/**
 * Checks if the given guild member has the permission to create an emoji.
 * @param me - The guild member to check.
 * @returns True if the guild member has the permission to create an emoji, false otherwise.
 */
export const canCreateEmoji = (me: Discord.GuildMember | null) =>
 me &&
 (me.permissions.has(8796093022208n) ||
  me.permissions.has(Discord.PermissionFlagsBits.ManageGuildExpressions));
