import * as Discord from 'discord.js';
import * as Typings from '../../Typings/Typings.js';

/**
 * If a string command is used the file will be searched and called automatically.
 *
 * @example
 * If you have a string command with the name 'ping';
 * The code will look for "src/Commands/StringCommands/ping.js"
 *
 * As the rest of the command files, this can be used infinitely deep
 * (as long as the 100 character limit is not exceeded).
 * but commands like "ping/user" don't look very pretty
 */

const cmd: Typings.Command<true> = {
 guildOnly: true,
 requiredArgs: 2,
 usage: 'test <arg1> <arg2>',
 exampleUsage: 'test 1 2',
 permissions: [Discord.PermissionFlagsBits.AddReactions],
 run: (msg, args, language) => {
  msg.client.util.request.channels.replyMsg(msg, {
   content: `${language.t.error} ${args.join(', ')}`,
  });
 },
};

export default cmd;
