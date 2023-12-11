import * as Discord from 'discord.js';

/**
 * If a string-select-component is pressed,
 * the according file will be searched and executed automatically.
 *
 * @example
 * If you have a string-select-component with custom ID 'ping';
 * The code will look for "src/Commands/SelectCommands/StringSelect/ping.js"
 *
 * If you have a string-select-component with custom ID 'ping/user',
 * and it has a subcommand with the name 'user';
 * The code will look for "src/Commands/SelectCommands/StringSelect/ping/user.js"
 *
 * This can be used infinitely deep (as long as the 100 character limit is not exceeded).
 *
 * Additionally you can provide Arguments inside the custom ID by using underscores.
 * Example: 'ping_user_123' will be parsed as Array<['user' '123']>
 * and executed in file "src/Commands/SelectCommands/StringSelect/ping.js"
 */

export default async (cmd: Discord.StringSelectMenuInteraction, args: string[]) => {
 cmd.reply({ content: `Hi! ${args[0]}` });
};
