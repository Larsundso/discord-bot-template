import * as Discord from 'discord.js';
import getLanguage from './getLanguage.js';
import request from './requestHandler.js';

/**
 * Sends an error message to the configured error channel of the guild.
 * @param guild - The guild where the error occurred.
 * @param err - The error object to be sent.
 * @returns Promise<void>
 */
export default async (guild: Discord.Guild, err: Error, postDebug: boolean = true) => {
 if (process.argv.includes('--silent')) return;

 // get error channel per guild here
 const errorChannel = '';

 const language = await getLanguage(guild.id);

 const payload: Discord.RESTPostAPIChannelMessageJSONBody = {
  embeds: [
   {
    color: 0xff0000,
    description: `Stack Trace\n\`\`\`${err.stack?.replace(
     /file:\/\/\/root\/Bots\/Ayako-v2\/dist/g,
     '',
    )}\`\`\``,
    fields: [
     {
      name: 'Message',
      value: err.message.split(/:+/g).slice(1, 100).join(':'),
     },
    ],
    author: {
     name: 'Error',
    },
    title: language.t.errors.contactSupport,
   },
  ],
 };

 if (postDebug) {
  request.webhooks.execute(
   guild,
   process.env.debugWebhookID ?? '',
   process.env.debugWebhookToken ?? '',
   payload,
  );
 }

 const channel = guild.channels.cache.get(errorChannel);
 if (!channel) return;
 request.channels.sendMessage(guild, channel.id, payload, guild.client);
};
