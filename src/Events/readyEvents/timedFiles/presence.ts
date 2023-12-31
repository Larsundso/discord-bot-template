import * as Discord from 'discord.js';
import ch from '../../../BaseClient/Util.js';
import client from '../../../BaseClient/Client.js';
import pack from '../../../../package.json' assert { type: 'json' };

export default async () => {
 const random = Math.floor(Math.random() * 3);
 const users = await ch.DataBase.stats.findFirst().then((r) => r?.allusers);

 const activities: Discord.ActivitiesOptions[] = [];

 switch (random) {
  case 1: {
   activities.push({
    name: `${ch.splitByThousand(client.guilds.cache.size)} Servers | v${
     pack.version
    } | Default Prefix: ${process.env.PREFIX}`,
    type: Discord.ActivityType.Competing,
   });
   break;
  }
  case 2: {
   activities.push({
    name: `with ${ch.splitByThousand(Number(users))} Users | v${pack.version} | ${
     process.env.PREFIX
    }invite`,
    type: Discord.ActivityType.Playing,
   });
   break;
  }
  default: {
   activities.push({
    name: 'Development',
    state: `Development | v${pack.version} | Default Prefix: ${process.env.PREFIX}`,
    type: Discord.ActivityType.Custom,
   });
   break;
  }
 }

 client.user?.setPresence({
  afk: false,
  activities,
  status: Discord.PresenceUpdateStatus.Online,
 });
};
