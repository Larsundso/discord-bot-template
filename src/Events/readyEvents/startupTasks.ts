import Jobs from 'node-schedule';
import slashCommandInitializer from './startupTasks/slashCommandInitializer.js';
import presence from './timedFiles/presence.js';

export default async () => {
 slashCommandInitializer();

 Jobs.scheduleJob('0 * * * * *', async () => {
  presence();
 });
};
