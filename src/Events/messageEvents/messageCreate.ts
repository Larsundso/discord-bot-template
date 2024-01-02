import type * as Discord from 'discord.js';

import commandHandler from './commandHandler.js';

export default async (msg: Discord.Message) => {
 if (!msg) return;
 if (!msg.author) return;

 commandHandler(msg);
};
