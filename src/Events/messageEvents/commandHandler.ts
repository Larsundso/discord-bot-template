import * as Discord from 'discord.js';
import { glob } from 'glob';
import * as stringSimilarity from 'string-similarity';
import client from '../../BaseClient/Client.js';
import * as Typings from '../../Typings/Typings.js';

const { log } = console;

export default async (msg: Discord.Message) => {
 if (!msg.content) return;

 if (!msg.inGuild()) dmCommand(msg);
 else guildCommand(msg);
};

const dmCommand = async (msg: Discord.Message) => {
 if (!msg.content.startsWith(process.env.Prefix ?? '')) return;

 const args = msg.content
  .slice(process.env.Prefix?.length)
  .trim()
  .split(/\s+|\n+/g);

 const commandName = args.shift()?.toLowerCase() as string;
 const command = await getComand(commandName, false);
 if (!command) return;
 if (command.guildOnly) return;

 const language = await msg.client.util.getLanguage('en-GB');

 command.run(msg, args, language);
};

const guildCommand = async (msg: Discord.Message<true>) => {
 if (!msg.content.startsWith(process.env.Prefix ?? '')) return;

 const args = msg.content
  .slice(process.env.Prefix?.length)
  .trim()
  .split(/\s+|\n+/g);

 const commandName = args.shift()?.toLowerCase();
 if (!commandName) return;

 const command = await getComand(commandName, true);
 if (!command) {
  const allSlashCommands = (await glob(`${process.cwd()}/dist/Commands/SlashCommands/**/*`))
   .filter((f) => f.endsWith('.js') && !f.endsWith('.map.js'))
   .map((f) =>
    f
     .replace(`${process.cwd()}/dist/Commands/SlashCommands/`, '')
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
  if (!canUse) msg.client.util.request.channels.addReaction(msg, '❌');
  return;
 }

 const language = await msg.client.util.getLanguage(msg.guildId);

 if (!command.permissions.every((p) => msg.member?.permissions.has(p))) {
  await msg.client.util.request.channels.addReaction(msg, '❌');
  return;
 }

 if (command.requiredArgs > args.length) {
  await msg.client.util.request.channels.addReaction(msg, '❌');

  msg.client.util.request.channels.replyMsg(msg, {
   embeds: [
    {
     color: Discord.Colors.Red,
     fields: [
      { name: language.t.commandHandler.usage, value: command.usage, inline: false },
      { name: language.t.commandHandler.exampleUsage, value: command.exampleUsage, inline: false },
     ],
    },
   ],
  });
  return;
 }

 command.run(msg, args, language);
};

const getComand = async (commandName: string, inGuild: boolean) => {
 const files = await glob(`${process.cwd()}/dist/Commands/StringCommands/**/*`);

 const path = files.find((f) => f.endsWith(`/${commandName}.js`));
 if (!path) return undefined;

 log(commandName);

 return (await import(path)).default as Typings.Command<typeof inGuild>;
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

 const commandPerms = client.util.commandPermissions.cache.get(msg.guildId)?.get(slashCommand.id);
 if (
  !commandPerms?.length &&
  (!slashCommand.defaultMemberPermissions ||
   slashCommand.defaultMemberPermissions.toArray().find((p) => msg.member?.permissions.has(p)))
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

 if (rolePermission.find((p) => !p.permission)) return false;

 if (
  !everyonePermission &&
  slashCommand.defaultMemberPermissions &&
  !slashCommand.defaultMemberPermissions.toArray().find((p) => msg.member?.permissions.has(p))
 ) {
  return false;
 }
 if (everyonePermission && !everyonePermission.permission) {
  return false;
 }

 return true;
};
