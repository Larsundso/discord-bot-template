import * as Discord from 'discord.js';
import * as Jobs from 'node-schedule';
import client from '../../BaseClient/Client.js';
import { endGiveaway as endNormalGiveaway } from '../../Commands/StringCommands/gw.js';
import { endGiveaway as endCrossGiveaway } from '../../Commands/SlashCommands/cross/server.js';

const { log } = console;

export default async () => {
 log(
  `| Logged in\n| => Bot: ${client.user?.username}#${client.user?.discriminator} / ${client.user
   ?.id}\n| Login at ${new Date(Date.now()).toLocaleString()}`,
 );

};
