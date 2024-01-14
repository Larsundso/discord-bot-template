import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Retrieves the webhooks for a given guild.
 * @param guild The guild to retrieve the webhooks for.
 * @returns A promise that resolves with an array of Webhook objects.
 */
export default async (guild: Discord.Guild) => {
 if (!canGetWebhooks(guild.members.me)) {
  const e = requestHandlerError(`Cannot get webhooks`, [
   Discord.PermissionFlagsBits.ManageWebhooks,
  ]);

  error(guild, e);
  return e;
 }

 return API.guilds
  .getWebhooks(guild.id)
  .then((webhooks) => webhooks.map((w) => new Classes.Webhook(guild.client, w)))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
/**
 * Checks if the given guild member has the permission to get webhooks.
 * @param me - The Discord guild member.
 * @returns True if the guild member has the permission to get webhooks, false otherwise.
 */
export const canGetWebhooks = (me: Discord.GuildMember | null) =>
 me && me.permissions.has(Discord.PermissionFlagsBits.ManageWebhooks);
