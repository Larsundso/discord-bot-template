import type * as Discord from 'discord.js';

/**
 * If a message context-menu command is pressed,
 * the according file will be searched and executed automatically.
 *
 * @example
 * If you have a message context-menu command with name "Ping";
 * The code will look for "src/Commands/ContextCommands/Message/Ping.js"
 *
 * If you have a message context-menu command with name "Ping Me";
 * The code will look for "src/Commands/ContextCommands/Message/ping-me.js"
 */

export default (cmd: Discord.MessageContextMenuCommandInteraction) => {
 cmd.reply({ content: `Hi!` });
};
