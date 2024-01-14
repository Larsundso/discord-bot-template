import * as Discord from 'discord.js';

export type Language = import('../BaseClient/Other/language.js').default;

export interface Command<T extends boolean> {
 requiredArgs: number;
 guildOnly: T;
 usage: string;
 exampleUsage: string;
 permissions: Discord.PermissionResolvable[];
 run: (msg: Discord.Message<T>, args: string[], language: Language) => void | Promise<void>;
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
