import { mdiTrashCan } from "@mdi/js";
import { useState } from "react";

import { Button, DisclosureDialog } from "components/Elements";
import { useDeleteChat } from "features/chats";

import { useNotificationStore } from "stores/notifications";
import { Chat } from "types";

type DeleteChatProps = {
  chat: Chat;
};

export function DeleteChat({ chat }: DeleteChatProps) {
  const { addNotification } = useNotificationStore();
  const [leave, setLeave] = useState(true);
  const [del, setDel] = useState(false);
  const [attachments, setAttachments] = useState(false);

  const deleteChatMutation = useDeleteChat({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: "success",
          title: "Chat deleted.",
        });
      },
    },
  });

  return (
    <DisclosureDialog
      triggerButton={(open) => (
        <Button
          size="sm"
          variant="secondary"
          startIcon={mdiTrashCan}
          className="flex-shrink-0"
          onClick={open}
        >
          <span>Delete</span>
        </Button>
      )}
      title="Delete Chat"
    >
      {({ close }) => (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete &quot;{chat.title ?? chat.id}
            &quot;?
          </p>

          <div className="space-y-3">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={leave}
                onChange={(e) => setLeave(e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="font-medium text-gray-700">Leave</span>
                <p className="text-sm text-gray-500">
                  Leave the chat in Telegram
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={del}
                onChange={(e) => {
                  setDel(e.target.checked);
                  if (!e.target.checked) setAttachments(false);
                }}
                className="mt-0.5 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="font-medium text-gray-700">Delete data</span>
                <p className="text-sm text-gray-500">
                  Delete all chat data (record, messages, metrics, vectorized
                  index)
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={attachments}
                disabled={!del}
                onChange={(e) => setAttachments(e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
              />
              <div>
                <span className="font-medium text-gray-700">
                  Delete attachments
                </span>
                <p className="text-sm text-gray-500">
                  Also delete attachment files from storage (requires delete
                  data)
                </p>
              </div>
            </label>
          </div>

          <Button
            type="button"
            variant="danger"
            disabled={!leave && !del}
            isLoading={deleteChatMutation.isPending}
            onClick={async () => {
              try {
                await deleteChatMutation.mutateAsync({
                  id: chat.id!,
                  leave,
                  delete: del,
                  attachments,
                });
                close();
              } catch (error) {
                console.error(error);
              }
            }}
            className="w-full"
          >
            Confirm
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={close}
            data-autofocus
          >
            Cancel
          </Button>
        </div>
      )}
    </DisclosureDialog>
  );
}
