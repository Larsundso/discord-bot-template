/* eslint-disable no-console */
import 'dotenv/config';
import type * as Discord from 'discord.js';
import * as DiscordRest from '@discordjs/rest';
import * as DiscordCore from '@discordjs/core';
import { glob } from 'glob';

const files = (await glob(`${process.cwd()}/dist/SlashCommands/*`)).filter((f) =>
 f.endsWith('.js'),
);
const createCommands = (await Promise.all(files.map((c) => import(c)))).map(
 (c) => c.default as Discord.SlashCommandBuilder,
);

await new DiscordCore.API(
 new DiscordRest.REST({ version: '10' }).setToken(process.env.Token?.replace('Bot ', '') ?? ''),
).applicationCommands
 .bulkOverwriteGlobalCommands(
  process.env.botID ?? '',
  createCommands.map((c) => c.toJSON()),
 )
 .then((r) => console.log(`[MAIN] Registered ${r.length} Global Commands`));

process.exit(0);
