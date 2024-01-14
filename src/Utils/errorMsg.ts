import * as Discord from 'discord.js';
import type Language from '../BaseClient/Other/language.js';
import error from './error.js';
import request from './requestHandler.js';

const { log } = console;

/**
 * Sends an error message to a Discord channel or edits an existing message with the error message.
 * @param msg - The message object to reply to or edit.
 * @param content - The content of the error message.
 * @param language - The language object containing localized strings.
 * @param m - The message object to edit, if applicable.
 * @returns The edited message object or undefined if the message couldn't be edited.
 */
export default async (
 msg: Discord.Message,
 content: string,
 language: Language,
 m?: Discord.Message<true>,
): Promise<Discord.Message | Discord.DiscordAPIError | Error | undefined> => {
 log(new Error(content));

 const embed: Discord.APIEmbed = {
  author: {
   name: language.t.error,
  },
  color: Discord.Colors.Red,
  description: content,
 };

 if (m) {
  const ms = await request.channels.editMsg(m, { embeds: [embed] });
  if ('message' in ms) {
   if (msg.inGuild()) error(msg.guild, new Error(`Couldnt get Guild Webhooks`));
   return undefined;
  }

  return ms;
 }

 return request.channels.replyMsg(msg, { embeds: [embed] });
};
