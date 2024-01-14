import * as CT from '../../Typings/Typings.js';

/**
 * If a slash command has a autocomplete property,
 * the autocomplete file will be searched and called automatically.
 *
 * @example
 * If you have a slash command with the name 'ping';
 * The code will look for "src/Commands/AutocompleteCommands/ping.js"
 *
 * If you have a slash command with the name 'ping',
 * and it has a subcommand with the name 'user';
 * The code will look for "src/Commands/AutocompleteCommands/ping/user.js"
 *
 * If you have a slash command with the name 'ping',
 * and it has a subcommand group with the name 'user'
 * and a subcommand with the name 'info';
 * The code will look for "src/Commands/AutocompleteCommands/ping/user/info.js"
 */

const f: CT.AutoCompleteFile['default'] = async (cmd) =>
 new Array(5).fill(null).map(() => ({ name: cmd.guild?.name ?? '-', value: cmd.guild?.id ?? '-' }));

export default f;
