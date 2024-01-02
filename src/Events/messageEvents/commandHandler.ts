import * as Discord from 'discord.js';
import { glob } from 'glob';
import * as Jobs from 'node-schedule';
import * as stringSimilarity from 'string-similarity';
import client from '../../BaseClient/Client.js';
import Util from '../../BaseClient/Util.js';

const { log } = console;

export default async (msg: Discord.Message) => {
 if (!msg.content) return;

 if (!msg.inGuild()) dmCommand(msg);
 else guildCommand(msg);
};

const dmCommand = async (msg: Discord.Message) => {
 const args = msg.content
  .slice(process.env.Prefix?.length)
  .trim()
  .split(/\s+|\n+/g);

 const commandName = args.shift()?.toLowerCase() as string;
 const command = await getComand(commandName);
 if (!command) return;
 if (!command.dmAllowed) return;

 command.default(msg, args);
};

const guildCommand = async (msg: Discord.Message<true>) => {
 const args = msg.content
  .slice(process.env.Prefix?.length)
  .trim()
  .split(/\s+|\n+/g);

 const commandName = args.shift()?.toLowerCase();
 if (!commandName) return;

 const command = await getComand(commandName);
 if (!command) {
  const allSlashCommands = (
   await glob(
    `${process.cwd()}${process.cwd().includes('dist') ? '' : '/dist'}/Commands/SlashCommands/**/*`,
   )
  )
   .filter((f) => f.endsWith('.js') && !f.endsWith('.map.js'))
   .map((f) =>
    f
     .replace(
      `${process.cwd()}${process.cwd().includes('dist') ? '' : '/dist'}/Commands/SlashCommands/`,
      '',
     )
     .replace('.js', '')
     .replace(/\/.*/g, ''),
   );

  const matchingName = stringSimilarity.findBestMatch(commandName, allSlashCommands).bestMatch
   .target;

  const slashCommand =
   msg.guild?.commands.cache.find((c) => c.name === matchingName) ??
   client.application?.commands.cache.find((c) => c.name === matchingName);
  if (!slashCommand) return;

  const canUse = checkCommandPermissions(msg, commandName);
  if (!canUse) Util.request.channels.addReaction(msg, '❌');
  return;
 }

 const language = await Util.getLanguage(msg.guildId);

 const commandIsEnabled = await checkCommandIsEnabled(msg, commandName);
 if (!commandIsEnabled) {
  const reaction = await Util.request.channels.addReaction(msg, '❌');

  if (typeof reaction !== 'undefined') Util.error(msg.guild, new Error(reaction.message));
  return;
 }

 const canRunCommand = checkCommandPermissions(msg, commandName);
 if (!canRunCommand) {
  const m = await Util.errorMsg(msg, language.t.permissions.error.you, language);
  Jobs.scheduleJob(new Date(Date.now() + 10000), async () => {
   if (m && !('message' in m)) Util.request.channels.deleteMessage(m);
   Util.request.channels.deleteMessage(msg);
  });
  return;
 }

 command.default(msg, args);
};

const getComand = async (commandName: string) => {
 const files = await glob(
  `${process.cwd()}${process.cwd().includes('dist') ? '' : '/dist'}/Commands/StringCommands/**/*`,
 );

 const path = files.find((f) => f.endsWith(`/${commandName}.js`));
 if (!path) return undefined;

 log(commandName);

 return (await import(path)) as {
  dmAllowed: boolean;
  default: (msg: Discord.Message, args: string[]) => void;
 };
};

export const checkCommandPermissions = (
 msg: {
  guildId: string;
  guild: Discord.Guild;
  author: Discord.User;
  channelId: string;
  member: Discord.GuildMember | null;
 },
 commandName: string,
) => {
 const slashCommand =
  client.application?.commands.cache.find((c) => c.name === commandName) ??
  msg.guild.commands.cache.find((c) => c.name === commandName);

 if (!slashCommand) return true;

 const commandPerms = Util.commandPermissions.cache.get(msg.guildId)?.get(slashCommand.id);
 if (
  !commandPerms?.length &&
  (!slashCommand.defaultMemberPermissions ||
   msg.member?.permissions.has(slashCommand.defaultMemberPermissions.toArray()))
 ) {
  return true;
 }

 if (!commandPerms?.length) return false;

 const userPermission = commandPerms.find(
  (p) => p.type === Discord.ApplicationCommandPermissionType.User && p.id === msg.author.id,
 );

 if (userPermission) return userPermission.permission;

 const channelPermissions = commandPerms.filter(
  (p) => p.type === Discord.ApplicationCommandPermissionType.Channel,
 );
 const channelPermission = channelPermissions.find((p) => p.id === msg.channelId);
 const allChannelPermission = channelPermissions.find((p) => p.id === msg.guildId);

 if (channelPermission && !channelPermission.permission) return false;
 if (allChannelPermission && allChannelPermission.permission && !channelPermission?.permission) {
  return false;
 }

 const rolePermissions = commandPerms.filter(
  (p) => p.type === Discord.ApplicationCommandPermissionType.Role,
 );
 const everyonePermission = rolePermissions.find((p) => p.id === msg.guildId);
 const rolePermission = rolePermissions.filter((p) => msg.member?.roles.cache.has(p.id));

 if (everyonePermission && !everyonePermission.permission) return false;
 if (
  rolePermission.length &&
  !rolePermission.find((r) => !!r.permission) &&
  !everyonePermission?.permission
 ) {
  return false;
 }

 return true;
};

const checkCommandIsEnabled = async (msg: Discord.Message<true>, commandName: string) => {
 const slashCommand =
  client.application?.commands.cache.find((c) => c.name === commandName) ??
  msg.guild.commands.cache.find((c) => c.name === commandName);

 if (!slashCommand) return false;
 return true;
};
