/* eslint-disable no-console */
import * as Sharding from 'discord-hybrid-sharding';
import 'dotenv/config';
import * as Jobs from 'node-schedule';
import readline from 'readline';
import sms from 'source-map-support';

sms.install({
 handleUncaughtExceptions: process.argv.includes('--debug'),
 environment: 'node',
 emptyCacheBetweenOperations: process.argv.includes('--debug'),
});

// eslint-disable-next-line no-console
const { log } = console;

console.clear();
log(`
++++++++++++++++++++ Welcome ++++++++++++++++++++
+       Restart all Shards with "restart"       +
+                   Arguments:                  +
+            --debug --warn --debug-db          +
+++++++++++++++++++++++++++++++++++++++++++++++++
`);

const manager = new Sharding.ClusterManager(`${process.cwd()}/dist/bot.js`, {
 totalShards: 'auto',
 totalClusters: 'auto',
 mode: 'process',
 token: process.env.Token,
 execArgv: [],
 shardArgs: process.argv,
});

manager.on('shardCreate', (shard) => log(`[Shard Manager] Launched Shard ${shard.id}`));

Jobs.scheduleJob('*/10 * * * *', async () => {
 log(`=> Current Date: ${new Date().toLocaleString()}`);
});

process.setMaxListeners(5);
process.on('unhandledRejection', async (error: string) => console.error(error));
process.on('uncaughtException', async (error: string) => console.error(error));
process.on('promiseRejectionHandledWarning', (error: string) => console.error(error));
process.on('experimentalWarning', (error: string) => console.error(error));
process.on('SIGINT', () => {
 manager.broadcastEval((cl) => cl.emit('SIGINT'));
 log('[SIGINT]: Gracefully shutting down...');
 process.exit(0);
});

await manager.spawn();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.on('line', async (msg: string) => {
 const parts = msg.trim().split(/\s+/);
 const code = parts.join(' ');

 if (!code.startsWith('restart')) return;

 manager.respawnAll({ respawnDelay: 1000 });
});
