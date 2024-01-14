import * as Discord from 'discord.js';
import { glob } from 'glob';

// TODO: Fix this
// eslint-disable-next-line no-console
const { log } = console;

export default async (cmd: Discord.Interaction) => {
 if (!cmd.isContextMenuCommand()) return;
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const files = await glob(`${process.cwd()}/dist/Commands/**/*`);

 const path = `${Discord.ApplicationCommandType[cmd.commandType]}/${cmd.commandName
  .replace(/\s+/g, '-')
  .toLowerCase()}`;

 log(path);

 const command = files.find((f) => f.endsWith(`/ContextCommands/${path}.js`));
 if (!command) return;

 (await import(command)).default(cmd);
};
