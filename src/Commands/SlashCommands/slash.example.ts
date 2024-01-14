import * as Discord from 'discord.js';

/**
 * If a slash command is used the file will be searched and called automatically.
 *
 * @example
 * If you have a slash command with the name 'ping';
 * The code will look for "src/Commands/SlashCommands/ping.js"
 *
 * If you have a slash command with the name 'ping',
 * and it has a subcommand with the name 'user';
 * The code will look for "src/Commands/SlashCommands/ping/user.js"
 *
 * If you have a slash command with the name 'ping',
 * and it has a subcommand group with the name 'user'
 * and a subcommand with the name 'info';
 * The code will look for "src/Commands/SlashCommands/ping/user/info.js"
 */

export default (cmd: Discord.ChatInputCommandInteraction) => {
 new Array(5).fill(null).map(() => ({ name: cmd.guild?.name ?? '-', value: cmd.guild?.id ?? '-' }));
};
