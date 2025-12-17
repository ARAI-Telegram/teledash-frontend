import { useQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";

import { MessageForLabeling } from "types";

export async function getLabelingMessage(): Promise<MessageForLabeling> {
  return axios.get("/labeling");
}

export const useLabelingMessage = () => {
  return useQuery({
    queryKey: ["labeling-message"],
    queryFn: getLabelingMessage,
    retry: false, // Don't retry on 404 (no messages available)
  });
};
