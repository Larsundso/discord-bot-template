import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';

/**
 * Retrieves the voice regions for a given guild.
 * @param guild - The guild to retrieve the voice regions for.
 * @returns A promise that resolves with an array of voice regions for the guild.
 */
export default async (guild: Discord.Guild) =>
 API.guilds
  .getVoiceRegions(guild.id)
  .then((voiceRegions) => voiceRegions.map((vR) => new Classes.VoiceRegion(vR)))
  .catch((e) => {
   error(guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
