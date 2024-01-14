import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';

/**
 * Returns the preview of a guild.
 * @param guild - The guild to get the preview for.
 * @returns A promise that resolves with the guild preview.
 */
export default async (guild: Discord.Guild) =>
 API.guilds
  .getPreview(guild.id)
  .then((p) => new Classes.GuildPreview(guild.client, p))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
