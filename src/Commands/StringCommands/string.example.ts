import * as Discord from 'discord.js';
import Util from '../../BaseClient/Util.js';

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

export const dmAllowed = false;

export default (msg: Discord.Message<typeof dmAllowed>, args: string[]) => {
 Util.request.channels.replyMsg(msg, {
  content: `Hello, world! ${args.join(', ')}`,
 });
};
