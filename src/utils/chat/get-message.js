export function getMessage({ message }) {
  // custom lại function này để lấy me
  // const sender = participants.find((participant) => participant.id === message.senderId);

  const senderDetails = 
    message.from_id === message?.oa_id || message.from_id === message?.page_id || message.from_id === message?.website_id
      ? { type: 'me' }
      : { avatarUrl: message?.from_avatar, firstName: message?.from_display_name };

  const me = senderDetails.type === 'me';

  const hasImage = message.type === 'image';

  return { hasImage, me, senderDetails };
}
