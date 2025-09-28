// Discord mention parsing utilities

interface DiscordMentions {
  channels?: { [id: string]: string };
  users?: { [id: string]: string };
  roles?: { [id: string]: string };
}

export function parseDiscordContent(content: string, mentions?: DiscordMentions): string {
  if (!content) return '';

  let parsedContent = content;

  // Remove Discord emotes: <:emoteName:123456789> and <a:animatedEmote:123456789>
  parsedContent = parsedContent.replace(/<a?:[a-zA-Z0-9_]+:[0-9]+>/g, '');

  // Parse channel mentions: <#123456789> -> #channel-name
  parsedContent = parsedContent.replace(/<#([0-9]+)>/g, (match, channelId) => {
    if (mentions?.channels?.[channelId]) {
      return `#${mentions.channels[channelId]}`;
    }
    return '#unknown-channel';
  });

  // Parse user mentions: <@123456789> or <@!123456789> -> @username
  parsedContent = parsedContent.replace(/<@!?([0-9]+)>/g, (match, userId) => {
    if (mentions?.users?.[userId]) {
      return `@${mentions.users[userId]}`;
    }
    return '@unknown-user';
  });

  // Parse role mentions: <@&123456789> -> @role-name
  parsedContent = parsedContent.replace(/<@&([0-9]+)>/g, (match, roleId) => {
    if (mentions?.roles?.[roleId]) {
      return `@${mentions.roles[roleId]}`;
    }
    return '@unknown-role';
  });

  // Clean up extra whitespace
  parsedContent = parsedContent.replace(/\s+/g, ' ').trim();

  return parsedContent;
}

export function cleanDiscordContent(content: string): string {
  if (!content) return '';

  let cleanedContent = content;

  // Remove Discord emotes: <:emoteName:123456789> and <a:animatedEmote:123456789>
  cleanedContent = cleanedContent.replace(/<a?:[a-zA-Z0-9_]+:[0-9]+>/g, '');

  // Convert channel mentions to readable format: <#123456789> -> #channel
  cleanedContent = cleanedContent.replace(/<#[0-9]+>/g, '#channel');

  // Convert user mentions to readable format: <@123456789> or <@!123456789> -> @user
  cleanedContent = cleanedContent.replace(/<@!?[0-9]+>/g, '@user');

  // Convert role mentions to readable format: <@&123456789> -> @role
  cleanedContent = cleanedContent.replace(/<@&[0-9]+>/g, '@role');

  // Clean up extra whitespace
  cleanedContent = cleanedContent.replace(/\s+/g, ' ').trim();

  return cleanedContent;
}

