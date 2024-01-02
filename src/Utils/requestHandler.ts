import { API } from '../BaseClient/Client.js';

import channels from './requestHandler/channels.js';
import commands from './requestHandler/commands.js';
import guilds from './requestHandler/guilds.js';
import invites from './requestHandler/invites.js';
import stageInstances from './requestHandler/stageInstances.js';
import stickers from './requestHandler/stickers.js';
import threads from './requestHandler/threads.js';
import users from './requestHandler/users.js';
import voice from './requestHandler/voice.js';
import webhooks from './requestHandler/webhooks.js';

export default {
 commands,
 channels,
 guilds,
 webhooks,
 invites,
 oAuth2: API.oauth2,
 roleConnections: API.roleConnections,
 stageInstances,
 stickers,
 threads,
 users,
 voice,
};
