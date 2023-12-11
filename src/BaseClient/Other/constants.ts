import * as Discord from 'discord.js';

export const GuildTextChannelTypes = [
 Discord.ChannelType.AnnouncementThread,
 Discord.ChannelType.GuildAnnouncement,
 Discord.ChannelType.GuildStageVoice,
 Discord.ChannelType.GuildText,
 Discord.ChannelType.GuildVoice,
 Discord.ChannelType.PrivateThread,
 Discord.ChannelType.PublicThread,
] as const;

export const AllNonThreadGuildChannelTypes = [
 Discord.ChannelType.GuildAnnouncement,
 Discord.ChannelType.GuildStageVoice,
 Discord.ChannelType.GuildText,
 Discord.ChannelType.GuildVoice,
 Discord.ChannelType.GuildForum,
] as const;

const colors = {
 danger: 16711680,
 success: 65280,
 ephemeral: 0x2b2d31,
 loading: 16776960,
 base: 11599616,
};

export default {
 colors,
 standard: {
  appURL: (user: Discord.User) => `discord://-/users/${user.id}`,
  userURL: (user: Discord.User) => `https://discord.com/users/${user.id}`,
  getEmote: (
   emoji:
    | Discord.Emoji
    | { name: string | undefined; id?: string | null | undefined; animated?: boolean | null },
  ) =>
   emoji.id
    ? `<${emoji.animated ? 'a:' : ':'}${emoji.name}:${emoji.id}>`
    : `${/\w/g.test(emoji.name ?? '') ? `:${emoji.name}:` : emoji.name}`,
  getTime: (time: number) =>
   `<t:${String(time).slice(0, -3)}:f> (<t:${String(time).slice(0, -3)}:R>)`,
  msgURL: (g: string | undefined | null, c: string, m: string) =>
   `https://discord.com/channels/${g ?? '@me'}/${c}/${m}`,
  user: (u: Discord.User | { discriminator: string; username: string }) =>
   `${u.discriminator === '0' ? u.username : `${u.username}#${u.discriminator}`}`,
  getEmoteIdentifier: (e: { animated: boolean; name: string; id: string | null | undefined }) =>
   `${e.animated ? 'a:' : ''}${e.name}${e.id ? `:${e.id}` : ''}`,
 },
};
