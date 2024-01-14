import Language, { languages } from '../BaseClient/Other/language.js';

/**
 * Returns the language object for the specified guild ID.
 * If the guild ID is not provided or is falsy, returns the English language object.
 * @param guildIDOrLocale - The ID of the guild to get the language object for or a language locale.
 * @returns A Promise that resolves to the language object for the specified guild ID.
 */
export default async (guildIDOrLocale: bigint | undefined | null | string) => {
 if (!guildIDOrLocale) return new Language('en-GB');

 if (typeof guildIDOrLocale === 'string' && guildIDOrLocale.includes('-')) {
  return new Language(guildIDOrLocale as keyof typeof languages);
 }

 // get guild locale here and return that instead of "en-GB"

 return new Language('en-GB' as keyof typeof languages);
};
