import * as Discord from 'discord.js';
import { glob } from 'glob';
import * as CT from '../../Typings/Typings.js';

// eslint-disable-next-line no-console
const { log } = console;

export default async (cmd: Discord.Interaction) => {
 if (!cmd.isAutocomplete()) return;
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const files = await glob(`${process.cwd()}/dist/Commands/**/*`);

 const subcommandGroup = cmd.options.data.find(
  (c) => c.type === Discord.ApplicationCommandOptionType.SubcommandGroup,
 );
 const subcommand = (subcommandGroup?.options ?? cmd.options.data).find(
  (c) => c.type === Discord.ApplicationCommandOptionType.Subcommand,
 );

 const path = () => {
  const pathArgs: string[] = [];

  if (cmd.commandName) pathArgs.push(cmd.commandName);
  if (subcommandGroup?.name) pathArgs.push(subcommandGroup?.name);
  if (subcommand?.name) pathArgs.push(subcommand?.name);

  return pathArgs.join('/');
 };

 log(path());

 const command = files.find((f) => f.endsWith(`/AutocompleteCommands/${path()}.js`));
 if (!command) return;

 const responses = await ((await import(command)) as CT.AutoCompleteFile).default<typeof cmd>(cmd);

 cmd.respond(responses ?? []);
};
