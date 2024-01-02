import moment from 'moment';
import ms from 'ms';
import DataBase from './DataBase.js';

import error from '../Utils/error.js';
import getDuration from '../Utils/getDuration.js';
import getEvents from '../Utils/getEvents.js';
import getLanguage from '../Utils/getLanguage.js';
import request from '../Utils/requestHandler.js';
import splitByThousand from '../Utils/splitByThousand.js';
import errorMsg from '../Utils/errorMsg.js';
import commandPermissions from '../Utils/commandPermissions.js';

// When adding utils, add their code in src/Utils/ and import/export them here.

export const utils = {
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
};

export default utils;
