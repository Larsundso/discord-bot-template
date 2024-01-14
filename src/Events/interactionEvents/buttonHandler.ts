import type * as Discord from 'discord.js';
import { glob } from 'glob';

// eslint-disable-next-line no-console
const { log } = console;

export default async (cmd: Discord.Interaction) => {
 if (!cmd.isButton()) return;
 if (cmd.inGuild() && !cmd.inCachedGuild()) return;

 const files = await glob(`${process.cwd()}/dist/Commands/**/*`);

 log(cmd.customId);
 const args = cmd.customId.split(/_+/g);
 const path = args.shift();

 const command = files.find((f) => f.endsWith(`/ButtonCommands/${path}.js`));
 if (!command) return;

 (await import(command)).default(cmd, args);
};
