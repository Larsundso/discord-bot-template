import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Retrieves the vanity URL for a given guild and returns an invite object with the parsed data.
 * @param guild The guild to retrieve the vanity URL for.
 * @returns A Promise that resolves with the parsed invite object,
 * or rejects with a DiscordAPIError if the vanity URL is missing or inaccessible.
 */
export default async (guild: Discord.Guild) => {
 if (!canGetVanityURL(guild.members.me)) {
  const e = requestHandlerError(`Cannot get vanity URL`, [Discord.PermissionFlagsBits.ManageGuild]);

  error(guild, e);
  return e;
 }

 return API.guilds
  .getVanityURL(guild.id)
  .then(async (v) => {
   const parsed = v.code
    ? new Classes.Invite(guild.client, {
       code: v.code,
       guild: {
        id: guild.id,
        name: guild.name,
        splash: guild.splash,
        banner: guild.banner,
        icon: guild.icon,
        vanity_url_code: v.code,
        description: guild.description,
        features: guild.features as Discord.APIGuild['features'],
        verification_level: guild.verificationLevel,
        nsfw_level: guild.nsfwLevel,
        premium_subscription_count: guild.premiumSubscriptionCount ?? undefined,
       },
       channel: guild.rulesChannel
        ? {
           id: guild.rulesChannel.id,
           name: guild.rulesChannel.name,
           type: guild.rulesChannel.type,
          }
        : null,
       inviter: await API.users.get(guild.ownerId).catch(() => undefined),
       approximate_presence_count: guild.approximatePresenceCount ?? undefined,
       approximate_member_count: guild.approximateMemberCount ?? undefined,
       uses: v.uses,
       max_uses: 0,
       max_age: 0,
       temporary: false,
       created_at: guild.createdAt.toISOString(),
      })
    : undefined;
   if (parsed) guild.invites.cache.set(parsed.code, parsed);
   return parsed;
  })
  .catch((e) => {
   if (e.message !== 'Missing Access') {
    error(guild, new Error((e as Discord.DiscordAPIError).message));
   }
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the user has the necessary permissions to get the vanity URL of a guild.
 * @param me - The Discord GuildMember representing the user.
 * @returns A boolean indicating whether the user can get the vanity URL.
 */
export const canGetVanityURL = (me: Discord.GuildMember | null) =>
 me && me.permissions.has(Discord.PermissionFlagsBits.ManageGuild);
