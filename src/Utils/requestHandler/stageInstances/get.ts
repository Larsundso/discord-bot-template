import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';

/**
 * Retrieves the stage instance associated with the given stage channel.
 * @param channel The stage channel to retrieve the stage instance for.
 * @returns A promise that resolves with the stage instance, or rejects with an error.
 */
export default async (channel: Discord.StageChannel) =>
 channel.guild.stageInstances.cache.find((s) => s.channelId === channel.id) ??
 API.stageInstances
  .get(channel.id)
  .then((s) => {
   const parsed = new Classes.StageInstance(channel.client, s, channel);
   if (channel.guild.stageInstances.cache.get(parsed.id)) return parsed;
   channel.guild.stageInstances.cache.set(parsed.id, parsed);
   return parsed;
  })
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
