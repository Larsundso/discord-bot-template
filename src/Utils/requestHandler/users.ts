import createDM from './users/createDM.js';
import edit from './users/edit.js';
import editCurrentGuildMember from './users/editCurrentGuildMember.js';
import get from './users/get.js';
import getApplicationRoleConnection from './users/getApplicationRoleConnection.js';
import getCurrent from './users/getCurrent.js';
import getCurrentConnections from './users/getCurrentConnections.js';
import getGuilds from './users/getGuilds.js';
import leaveGuild from './users/leaveGuild.js';
import updateApplicationRoleConnection from './users/updateApplicationRoleConnection.js';

interface Users {
 get: typeof get;
 getCurrent: typeof getCurrent;
 getGuilds: typeof getGuilds;
 leaveGuild: typeof leaveGuild;
 edit: typeof edit;
 editCurrentGuildMember: typeof editCurrentGuildMember;
 createDM: typeof createDM;
 getCurrentConnections: typeof getCurrentConnections;
 getApplicationRoleConnection: typeof getApplicationRoleConnection;
 updateApplicationRoleConnection: typeof updateApplicationRoleConnection;
}

/**
 * Object containing methods for handling user-related requests.
 * @property {Function} get
 * - Method for getting a user by ID.
 * @property {Function} getCurrent
 * - Method for getting the current user.
 * @property {Function} getGuilds
 * - Method for getting the guilds that the current user is a member of.
 * @property {Function} leaveGuild
 * - Method for leaving a guild.
 * @property {Function} edit
 * - Method for editing a user.
 * @property {Function} editCurrentGuildMember
 * - Method for editing the current user's guild member data.
 * @property {Function} createDM
 * - Method for creating a direct message channel with a user.
 * @property {Function} getCurrentConnections
 * - Method for getting the current user's connections.
 * @property {Function} getApplicationRoleConnection
 * - Method for getting the current user's application role connection.
 * @property {Function} updateApplicationRoleConnection
 * - Method for updating the current user's application role connection.
 */
const users: Users = {
 get,
 getCurrent,
 getGuilds,
 leaveGuild,
 edit,
 editCurrentGuildMember,
 createDM,
 getCurrentConnections,
 getApplicationRoleConnection,
 updateApplicationRoleConnection,
};

export default users;
