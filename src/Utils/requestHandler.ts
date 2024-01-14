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

interface RequestHandler {
 commands: typeof commands;
 channels: typeof channels;
 guilds: typeof guilds;
 webhooks: typeof webhooks;
 invites: typeof invites;
 oAuth2: typeof API.oauth2;
 roleConnections: typeof API.roleConnections;
 stageInstances: typeof stageInstances;
 stickers: typeof stickers;
 threads: typeof threads;
 users: typeof users;
 voice: typeof voice;
}

const requestHandler: RequestHandler = {
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

export default requestHandler;
