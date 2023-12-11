import type * as Discord from 'discord.js';

export type Language = import('../BaseClient/Other/language.js').default;

export interface Command {
 takesFirstArg: boolean;
 thisGuildOnly: string[];
 dmOnly: boolean;
 dmAllowed: boolean;
 type: 'mod' | 'other' | 'owner';
 requiresSlashCommand: boolean;
 default: (
  msg: Discord.Message,
  args: string[],
  {
   language,
   command,
   prefix,
  }: {
   language: Language;
   command: Command;
   prefix: string;
  },
 ) => void | Promise<void>;
}

export type AcceptedMergingTypes = 'string' | 'boolean' | 'difference' | 'icon' | 'image';

export interface AutoCompleteFile {
 default: <T extends Discord.AutocompleteInteraction<Discord.CacheType>>(
  cmd: T,
 ) => Promise<{ name: string; value: string }[] | undefined>;
}

export type CommandCategories =
 | 'info'
 | 'utility'
 | 'moderation'
 | 'fun'
 | 'nitro'
 | 'roles'
 | 'vote'
 | 'automation'
 | 'leveling';

export type DePromisify<T> = T extends Promise<infer U> ? U : T;

export type NeverNull<T, K extends keyof T> = {
 [P in keyof T]: P extends K ? NonNullable<T[P]> : T[P];
};

export type HelpCommand =
 | {
    parentCommand: string;
    subCommandGroup: string;
    subCommand: string;
   }
 | {
    parentCommand: string;
    subCommand: string;
    subCommandGroup?: undefined;
   }
 | {
    parentCommand: string;
    subCommandGroup?: undefined;
    subCommand?: undefined;
   };
