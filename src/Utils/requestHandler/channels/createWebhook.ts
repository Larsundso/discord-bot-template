import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Creates a webhook for a given guild and channel with the provided data.
 * @param guild - The guild where the webhook will be created.
 * @param channelId - The ID of the channel where the webhook will be created.
 * @param body - The data to be sent in the request body.
 * @returns A promise that resolves with a new Webhook object if successful,
 * or rejects with a DiscordAPIError if unsuccessful.
 */
export default async (
 guild: Discord.Guild,
 channelId: string,
 body: Discord.RESTPostAPIChannelWebhookJSONBody,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canCreateWebhook(channelId, guild.members.me)) {
  const e = requestHandlerError(`Cannot create webhook`, [
   Discord.PermissionFlagsBits.ManageWebhooks,
  ]);

  error(guild, e);
  return e;
 }

 return API.channels
  .createWebhook(channelId, {
   ...body,
   avatar: body.avatar ? await Discord.DataResolver.resolveImage(body.avatar) : body.avatar,
  })
  .then((w) => new Classes.Webhook(guild.client, w))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the user has the necessary permissions to create a webhook in a given channel.
 * @param channelId - The ID of the guild-based channel where the webhook will be created.
 * @param me - The guild member representing the user.
 * @returns A boolean indicating whether the user can create a webhook in the channel.
 */
export const canCreateWebhook = (channelId: string, me: Discord.GuildMember | null) =>
 me && me.permissionsIn(channelId).has(Discord.PermissionFlagsBits.ManageWebhooks);
