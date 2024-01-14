import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Creates a new template for the specified guild.
 * @param guild The guild to create the template for.
 * @param body The template data to create the template with.
 * @returns A promise that resolves with the created guild template,
 * or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, body: Discord.RESTPostAPIGuildTemplatesJSONBody) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canCreateTemplate(guild.members.me)) {
  const e = requestHandlerError(`Cannot create template`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  error(guild, e);
  return e;
 }

 return API.guilds
  .createTemplate(guild.id, body)
  .then((t) => new Classes.GuildTemplate(guild.client, t))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
/**
 * Checks if the given guild member has the permission to create a template.
 * @param me - The Discord guild member.
 * @returns A boolean indicating whether the guild member can create a template.
 */
export const canCreateTemplate = (me: Discord.GuildMember | null) =>
 me && me.permissions.has(Discord.PermissionFlagsBits.ManageGuild);
