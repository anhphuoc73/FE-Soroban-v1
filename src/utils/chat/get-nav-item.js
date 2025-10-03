import { decodeString } from "../decodeString";
import { formattedDate } from "../format-time";

export function getNavItem({ conversation }) {
  const {
    to_id, from_id, message_short, to_display_name, from_display_name,
    platform, to_avatar, from_avatar, time_create_at, is_read, _id,
    oa_id, page_id, website_id, is_platform_sender, name_response, avatar_response
  } = conversation;

  // Xác định đối tượng khách hàng trong cuộc trò chuyện
  const isToSocial = {
    zalo: to_id === oa_id,
    facebook: to_id === page_id,
    livechat: to_id === website_id,
  }[platform] ?? false;

  const displayName = isToSocial ? from_display_name : to_display_name;
  const participants = [{
    id: isToSocial ? from_id : to_id,
    name: displayName,
    status: "online",
    avatarUrl: isToSocial ? from_avatar : to_avatar,
    nameResponse: is_platform_sender ? name_response : null,
    avatarResponse: is_platform_sender ? avatar_response : null,
  }];

  // Xác định người gửi là nền tảng hay khách hàng
  const isFromSocial = {
    zalo: from_id === oa_id,
    facebook: from_id === page_id,
    livechat: from_id === website_id,
  }[platform] ?? false;

  const senderPrefix = isFromSocial ? { zalo: "OA: ", facebook: "Page: ", livechat: "Site: " }[platform] ?? "Khách: " : "";

  // Format tin nhắn
  const displayText = `${senderPrefix}${decodeString(message_short)}`;

  return {
    group: false,
    displayName,
    displayText,
    participants,
    lastActivity: formattedDate(time_create_at * 1000).toLocaleString(),
    isRead: is_read,
    conversation_id: _id,
    platform,
    isPlatformSender: is_platform_sender,
  };
}
