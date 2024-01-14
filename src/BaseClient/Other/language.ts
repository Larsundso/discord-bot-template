import merge from 'lodash.merge';
import client from '../Client.js';
import stp from '../../Utils/stp.js';

// When adding translations, import them here and add them to the languages object.
import enJSON from '../../Languages/en-GB.json' assert { type: 'json' };
// import deJSON from '../../Languages/de-DE.json' assert { type: 'json' };

export const languages = {
 'en-GB': enJSON,
 'en-US': enJSON,
 // 'de-DE': deJSON,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mergeLang = <T extends Record<string, any>>(lang: T) =>
 merge({}, languages['en-GB'], lang) as T & (typeof languages)['en-GB'];

const t = (lan: ReturnType<typeof mergeLang>): (typeof languages)['en-GB'] => ({
 ...lan,
});

export default class Language {
 botName = client.user?.username ?? 'Bot';
 botId = client.user?.id;
 CURRENT_LANGUAGE: keyof typeof languages = 'en-GB';
 JSON: (typeof languages)['en-GB'] = mergeLang(languages['en-GB']);
 stp = stp;

 t: ReturnType<typeof t>;

 constructor(type: keyof typeof languages) {
  this.CURRENT_LANGUAGE = type;

  this.JSON = mergeLang(languages[this.CURRENT_LANGUAGE]);
  if (!this.JSON) this.JSON = mergeLang(languages['en-GB']);

  this.t = t(this.JSON);
 }
}
