import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Edits a member in a guild.
 * @param member The member to edit.
 * @param body The data to update the member with.
 * @param reason The reason for editing the member.
 * @returns A promise that resolves with the updated guild member,
 * or rejects with a DiscordAPIError.
 */
export default async (
 member: Discord.GuildMember,
 body: Discord.RESTPatchAPIGuildMemberJSONBody,
 reason?: string,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canEditMember(member.guild.members.me, member, body)) {
  const e = requestHandlerError(
   `Cannot edit member ${member.user.username} / ${member.user.id}\nCheck role hierarchy.`,
   [
    Discord.PermissionFlagsBits.ManageGuild,
    Discord.PermissionFlagsBits.ModerateMembers,
    Discord.PermissionFlagsBits.MoveMembers,
    Discord.PermissionFlagsBits.ManageNicknames,
    Discord.PermissionFlagsBits.ManageRoles,
   ],
  );

  error(member.guild, e);
  return e;
 }

 return API.guilds
  .editMember(member.guild.id, member.id, body, { reason })
  .then((m) => new Classes.GuildMember(member.client, m, member.guild))
  .catch((e) => {
   error(member.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};
/**
 * Determines whether the given guild member can be edited with the provided body.
 * @param me - The guild member representing the bot.
 * @param member - The guild member to be edited.
 * @param body - The JSON body containing the changes to be made.
 * @returns A boolean indicating whether the member can be edited.
 */
export const canEditMember = (
 me: Discord.GuildMember | null,
 member: Discord.GuildMember,
 body: Discord.RESTPatchAPIGuildMemberJSONBody,
) => {
 if (!me) return false;
 if (member.guild.ownerId === me.id) return true;

 switch (true) {
  case 'channel_id' in body && body.channel_id !== member.voice.channelId: {
   if (!body.channel_id) return me.permissions.has(Discord.PermissionFlagsBits.MoveMembers);

   return me.permissionsIn(body.channel_id).has(Discord.PermissionFlagsBits.Connect);
  }
  case !!body.communication_disabled_until:
   return (
    !member.permissions.has(Discord.PermissionFlagsBits.Administrator) &&
    me.permissions.has(Discord.PermissionFlagsBits.ModerateMembers)
   );
  case !!body.mute:
   return !!member.voice.channelId && me.permissions.has(Discord.PermissionFlagsBits.MuteMembers);
  case !!body.deaf:
   return !!member.voice.channelId && me.permissions.has(Discord.PermissionFlagsBits.DeafenMembers);
  case !!body.nick:
   return (
    me.permissions.has(Discord.PermissionFlagsBits.ManageNicknames) &&
    member.roles.highest.comparePositionTo(me.roles.highest) < 0
   );
  case !!body.roles: {
   const removedRoles = member.roles.cache.filter((r) => !body.roles?.includes(r.id));
   const addedRoles = body.roles.filter((r) => !member.roles.cache.has(r));

   if (removedRoles.some((r) => r.comparePositionTo(me.roles.highest) > 0)) return false;
   if (removedRoles.some((r) => r.managed)) return false;
   if (addedRoles.some((r) => me.guild.roles.cache.get(r)?.managed)) return false;

   return (
    me.permissions.has(Discord.PermissionFlagsBits.ManageRoles) &&
    addedRoles.every(
     (r) => Number(me.guild.roles.cache.get(r)?.comparePositionTo(me.roles.highest)) < 0,
    )
   );
  }
  default:
   return member.roles.highest.comparePositionTo(me.roles.highest) < 0;
 }
};
