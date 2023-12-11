import ping from '../../../SlashCommands/ping.js';

export default {
 public: {
  ping,
 },
 categories: {
  ping: 'info',
 },
 names: ['ping'],
} as const;
