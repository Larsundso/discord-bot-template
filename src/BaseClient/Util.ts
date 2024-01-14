import moment from 'moment';
import ms from 'ms';
import DataBase from './DataBase.js';

import commandPermissions from '../Utils/commandPermissions.js';
import error from '../Utils/error.js';
import errorMsg from '../Utils/errorMsg.js';
import getColor from '../Utils/getColor.js';
import getDuration from '../Utils/getDuration.js';
import getEmbedFromDBEmbed from '../Utils/getEmbedFromDBEmbed.js';
import getEvents from '../Utils/getEvents.js';
import getLanguage from '../Utils/getLanguage.js';
import getRandom from '../Utils/getRandom.js';
import request from '../Utils/requestHandler.js';
import splitByThousand from '../Utils/splitByThousand.js';
import stp from '../Utils/stp.js';
import getBaseEmbed from '../Utils/getBaseEmbed.js';

// When adding utils, add their code in src/Utils/ and import/export them here.

interface Util {
 getRandom: typeof getRandom;
 stp: typeof stp;
 commandPermissions: typeof commandPermissions;
 errorMsg: typeof errorMsg;
 error: typeof error;
 getEvents: typeof getEvents;
 ms: typeof ms;
 moment: typeof moment;
 splitByThousand: typeof splitByThousand;
 DataBase: typeof DataBase;
 getLanguage: typeof getLanguage;
 getDuration: typeof getDuration;
 request: typeof request;
 getEmbedFromDBEmbed: typeof getEmbedFromDBEmbed;
 getColor: typeof getColor;
 getBaseEmbed: typeof getBaseEmbed;
}

export const utils: Util = {
 getBaseEmbed,
 getRandom,
 stp,
 commandPermissions,
 errorMsg,
 error,
 getEvents,
 ms,
 moment,
 splitByThousand,
 DataBase,
 getLanguage,
 getDuration,
 request,
 getEmbedFromDBEmbed,
 getColor,
};

export default utils;
