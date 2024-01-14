/* eslint-disable no-console */
import 'dotenv/config';
import sms from 'source-map-support';
import client from './BaseClient/Client.js';
import util from './BaseClient/Util.js';

client.util = util;

sms.install({
 handleUncaughtExceptions: process.argv.includes('--debug'),
 environment: 'node',
 emptyCacheBetweenOperations: process.argv.includes('--debug'),
});

const processArgs = process.argv;
if (processArgs.includes('--debug')) console.log('[DEBUG] Debug mode enabled');
if (processArgs.includes('--debug-db')) console.log('[DEBUG] Debug mode for database enabled');
if (processArgs.includes('--warn')) console.log('[DEBUG] Warn mode enabled');

const events = await util.getEvents();
client.setMaxListeners(events.length);

process.setMaxListeners(4);
process.on('unhandledRejection', async (error: string) => console.error(error));
process.on('uncaughtException', async (error: string) => console.error(error));
process.on('promiseRejectionHandledWarning', (error: string) => console.error(error));
process.on('experimentalWarning', (error: string) => console.error(error));

events.forEach(async (path) => {
 const eventName = path.replace('.js', '').split(/\/+/).pop();
 if (!eventName) return;

 const eventHandler = (await import('./Events/baseEventHandler.js')).default;

 if (eventName === 'ready') client.once(eventName, (...args) => eventHandler(eventName, args));
 else client.on(eventName, (...args) => eventHandler(eventName, args));
});

if (processArgs.includes('--debug')) {
 client.rest.on('rateLimited', (info) => {
  console.log(
   `[Ratelimited] ${info.method} ${info.url.replace('https://discord.com/api/v10/', '')} ${
    info.timeToReset
   }ms`,
  );
 });
}
