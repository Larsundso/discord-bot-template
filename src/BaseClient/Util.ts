import moment from 'moment';
import ms from 'ms';
import DataBase from './DataBase.js';
import splitByThousand from '../Utils/splitByThousand.js';
import getEvents from '../Utils/getEvents.js';
import getLanguage from '../Utils/getLanguage.js';

// When adding utils, add their code in src/Utils/ and import/export them here.

export const utils = {
 getEvents,
 ms,
 moment,
 splitByThousand,
 DataBase,
 getLanguage,
};

export default utils;
