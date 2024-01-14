import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Creates a new guild.
 * @param guild The guild to create the new guild in.
 * @param body The JSON body of the request.
 * @returns A promise that resolves with the newly created guild or rejects with a DiscordAPIError.
 */
export default async (guild: Discord.Guild, body: Discord.RESTPostAPIGuildsJSONBody) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canCreate(guild.members.me)) {
  const e = requestHandlerError(`Cannot create guild ${guild.name} / ${guild.id}`, [
   Discord.PermissionFlagsBits.ManageGuild,
  ]);

  error(guild, e);
  return e;
 }

 return API.guilds
  .create(body)
  .then((g) => new Classes.Guild(guild.client, g))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the given guild member can create a new guild.
 * @param me - The Discord guild member.
 * @returns True if the guild member can create a new guild, false otherwise.
 */
export const canCreate = (me: Discord.GuildMember | null) => me && me.client.guilds.cache.size < 10;
