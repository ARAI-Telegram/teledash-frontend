import {
  mdiAlarmLightOutline,
  mdiEye,
  mdiOpenInNew,
  mdiPaperclip,
  mdiShare,
  mdiTagOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import parse from "html-react-parser";

import { RatingIndicator } from "components/Elements";
import { TooltipChatLink } from "features/chats";
import {
  parseMessageEntitiesAndHighlights,
  MessageTags,
  MessageServiceInfo,
  Attachment,
} from "features/messages";
import { createDisplayNameFromUser, UserLink } from "features/users";
import { formatDate, formatDateDistance, parseDate } from "lib/date";

import { Message as MessageType } from "types";

export const Message = (props: MessageType) => {
  const {
    text,
    caption,
    entities,
    caption_entities,
    reply_to_message,
    forward,
    highlight,
    from_user,
    sender_chat,
    chat,
    attachment,
    views,
    date,
    edit_date,
    id,
    tags,
    extracted_hashtags: _extractedHashtags,
    classification_score_pos,
    service_info,
    deleted,
  } = props;

  const messageText = text ?? caption;
  const messageEntities = entities ?? caption_entities;
  const reply = reply_to_message;
  const replyText = reply?.text ?? reply?.caption;
  let forwardName;
  let fromUserOrChat;

  const formattedMessageText = messageText
    ? parseMessageEntitiesAndHighlights(
        messageText,
        messageEntities ?? undefined,
        // TODO: Why are the highlights wrapped in an array? Because we could
        // get several fragments with different settings?
        highlight?.text?.[0] ??
          highlight?.caption?.[0] ??
          highlight?.["text.minimal"]?.[0] ??
          highlight?.["caption.minimal"]?.[0],
      )
    : messageText; // undefined

  if (forward) {
    if (forward.sender_name) {
      // sender_name (str, optional) – For messages forwarded from users who have hidden their accounts, name of the user.
      forwardName = forward.sender_name;
    } else if (forward.from_chat) {
      forwardName = <TooltipChatLink chat={forward.from_chat} />;
    } else if (forward.from_user) {
      forwardName = <UserLink user={forward.from_user} />;
    }
  }

  if (from_user) {
    fromUserOrChat = <UserLink user={from_user} />;
  } else if (sender_chat) {
    fromUserOrChat = <TooltipChatLink chat={sender_chat} />;
  }

  return (
    <div className="flex flex-col p-4">
      {/* Message header */}
      <div className="mb-3 text-xs sm:text-sm">
        <div className="grid grid-cols-[1fr_auto] items-start gap-x-2">
          {/* Username */}
          {fromUserOrChat && (
            <div className="flex min-w-0 items-center">
              <span className="min-w-0 truncate font-medium">
                {fromUserOrChat}
              </span>
            </div>
          )}

          {/* Meta info */}
          <div className="col-start-2 row-start-1 flex shrink-0 items-center text-gray-500">
            {/* Views */}
            {views != null && (
              <div className="mr-2 flex items-center">
                <span className="mr-1">{views}</span>
                <Icon path={mdiEye} size={0.7} />
              </div>
            )}

            {/* Date */}
            {/* TODO: Currently we cannot distinguish between a reaction and an actual edit. When this is possible, use "edit_date" and add "Edited" in front of the date. */}
            {date && (
              <span
                className="mr-1 whitespace-nowrap"
                title={formatDateDistance(parseDate(date))}
              >
                {formatDate(parseDate(date))}
              </span>
            )}

            {deleted && (
              <span
                className="ml-2 rounded bg-red-100 px-1.5 py-0.5 font-medium text-red-800"
                title={formatDate(parseDate(deleted))}
              >
                Deleted
              </span>
            )}

            {/* External link to message */}
            {chat?.username && id && (
              <div className="flex items-center">
                <a
                  href={
                    "https://t.me/s/" +
                    chat.username +
                    "/" +
                    id.substring(id.lastIndexOf(":") + 1)
                  }
                  rel="noreferrer"
                  target="_blank"
                  className="px-1 hover:text-black"
                >
                  <Icon path={mdiOpenInNew} size={0.65} />
                </a>
              </div>
            )}
          </div>

          {chat && !sender_chat && (
            <div className="col-span-2 flex min-w-0 items-center space-x-1">
              <span className="shrink-0 text-gray-500">in</span>
              <span className="min-w-0 truncate font-medium">
                <TooltipChatLink chat={chat} />
              </span>
            </div>
          )}
        </div>

        {/* Forward info */}
        {forwardName && (
          <div className="flex min-w-0 items-center">
            <Icon
              path={mdiShare}
              size={0.7}
              className="mr-1 shrink-0 text-gray-500"
            />
            <span className="mr-1 shrink-0 text-gray-500">Forwarded from</span>
            <span className="truncate font-medium">{forwardName}</span>
          </div>
        )}
      </div>

      {/* Message container */}
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
        <div className="col-span-1 flex flex-col gap-2 rounded-r-xl rounded-bl-xl rounded-tl border border-gray-200 p-2 lg:col-span-2">
          {/* Reply */}
          {reply && (
            <div className="mb-2 flex justify-between rounded-b rounded-tl rounded-tr-xl border-l-[3px] border-gray-300 bg-gray-100 px-3 py-2 text-xs sm:py-3 sm:text-sm">
              <div className="flex min-w-0 flex-col justify-center">
                {reply.user && (
                  <div className="font-medium">
                    {createDisplayNameFromUser(reply.user)}
                  </div>
                )}
                <div className="line-clamp-2">
                  {(replyText ?? reply.has_attachment) ? (
                    <i>Attachment</i>
                  ) : (
                    <i>No content</i>
                  )}
                </div>
              </div>
              {reply.has_attachment && (
                <div className="-my-2 -mr-3 ml-2 flex items-center rounded-br rounded-tr-xl bg-gray-200 p-3 sm:-my-3">
                  <Icon path={mdiPaperclip} size={1} />
                </div>
              )}
            </div>
          )}
          {/* Attachment */}
          {attachment && <Attachment {...props} />}
          {formattedMessageText && (
            <div className="truncate whitespace-pre-wrap px-1 text-sm sm:text-base">
              {parse(formattedMessageText)}
            </div>
          )}
          {/* Service Info */}
          {service_info && <MessageServiceInfo service_info={service_info} />}
        </div>
        {/* TODO: Create component MessageMargin with MessageMarginItem that renders icon, title and children. */}
        {/* Right margin of Message */}
        <div className="col-span-1 flex flex-col gap-4 pl-2 pt-2 text-xs">
          {/* Tags */}
          <div>
            <div className="flex items-center gap-1 whitespace-nowrap sm:text-sm">
              <Icon path={mdiTagOutline} size={0.8} className="text-gray-500" />
              <span className="font-bold text-gray-500">Tags</span>
            </div>
            <div className="flex flex-wrap content-start gap-2 py-2">
              <MessageTags messageId={id} tags={tags} />
            </div>
          </div>
          {/* Classification Rating */}
          {classification_score_pos != null && (
            <div>
              <div className="flex items-center gap-1 whitespace-nowrap sm:text-sm">
                <Icon
                  path={mdiAlarmLightOutline}
                  size={0.8}
                  className="text-gray-500"
                />
                <span className="font-bold text-gray-500">
                  Classification Rating
                </span>
              </div>
              <RatingIndicator
                rating={classification_score_pos}
                className="p-2"
                type="gauge"
                size="lg"
                description="The classification score for this message as rated by the active classifier."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
