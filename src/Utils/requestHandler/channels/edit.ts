import * as Discord from 'discord.js';
import error from '../../error.js';
import { API } from '../../../BaseClient/Client.js';
import * as Classes from '../../Classes.js';
import requestHandlerError from '../../requestHandlerError.js';

/**
 * Edits a guild-based channel or thread channel.
 * @param channel - The channel to edit.
 * @param body - The new channel data.
 * @returns A promise that resolves with the updated channel, or rejects with a DiscordAPIError.
 */
export default async (
 channel: Discord.GuildBasedChannel | Discord.ThreadChannel,
 body: Discord.RESTPatchAPIChannelJSONBody,
) => {
 if (process.argv.includes('--silent')) return new Error('Silent mode enabled.');

 if (!canEdit(channel, body, channel.guild.members.me)) {
  const e = requestHandlerError(`Cannot edit channel ${channel.name} / ${channel.id}`, [
   channel.isThread()
    ? Discord.PermissionFlagsBits.ManageThreads
    : Discord.PermissionFlagsBits.ManageChannels,
  ]);

  error(channel.guild, e);
  return e;
 }

 return API.channels
  .edit(channel.id, body)
  .then((c) => Classes.Channel(channel.client, c, channel.guild))
  .catch((e) => {
   error(channel.guild, new Error((e as Discord.DiscordAPIError).message));
   return e as Discord.DiscordAPIError;
  });
};

/**
 * Checks if the user has permission to edit a channel.
 * @param channel - The guild-based channel to be edited.
 * @param body - The JSON body containing the channel edits.
 * @param me - The guild member representing the user.
 * @returns A boolean indicating whether the user can edit the channel.
 */
export const canEdit = (
 channel: Discord.GuildBasedChannel | Discord.ThreadChannel,
 body: Discord.RESTPatchAPIChannelJSONBody,
 me: Discord.GuildMember | null,
) =>
 me &&
 (me.guild.ownerId === me.id ||
  (me.permissionsIn(channel.id).has(Discord.PermissionFlagsBits.ManageChannels) &&
   (body.permission_overwrites
    ? me.permissionsIn(channel.id).has(Discord.PermissionFlagsBits.ManageRoles) &&
      body.permission_overwrites.every(
       (overwrite) =>
        me
         .permissionsIn(channel.id)
         .has(
          new Discord.PermissionsBitField(overwrite.allow ? BigInt(overwrite.allow) : 0n).bitfield,
         ) &&
        me
         .permissionsIn(channel.id)
         .has(
          new Discord.PermissionsBitField(overwrite.deny ? BigInt(overwrite.deny) : 0n).bitfield,
         ),
      )
    : true)));
