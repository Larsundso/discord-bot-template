import type * as Discord from 'discord.js';

/**
 * If a user context-menu command is pressed,
 * the according file will be searched and executed automatically.
 *
 * @example
 * If you have a user context-menu command with name "Ping";
 * The code will look for "src/Commands/ContextCommands/User/ping.js"
 *
 * If you have a user context-menu command with name "Ping User";
 * The code will look for "src/Commands/ContextCommands/User/ping-user.js"
 */

export default (cmd: Discord.UserContextMenuCommandInteraction) => {
 cmd.reply({ content: `Hi!` });
};
