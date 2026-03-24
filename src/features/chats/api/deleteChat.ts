import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { MutationConfig } from "lib/react-query";

import { DeleteChatResponse } from "types";

export type DeleteChatParams = {
  id: number;
  leave?: boolean;
  delete?: boolean;
  attachments?: boolean;
};

export const deleteChat = ({
  id,
  ...params
}: DeleteChatParams): Promise<DeleteChatResponse> => {
  return axios.delete(`/chats/${id}`, { params });
};

type UseDeleteChatOptions = {
  mutationConfig?: MutationConfig<typeof deleteChat>;
};

export const useDeleteChat = ({
  mutationConfig,
}: UseDeleteChatOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.refetchQueries({ queryKey: ["chats"] });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteChat,
  });
};
