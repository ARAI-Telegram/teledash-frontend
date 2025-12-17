import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axios } from "lib/axios";

import { LabeledDataIn, LabeledDataOut } from "types";

export async function submitLabel(
  data: LabeledDataIn,
): Promise<LabeledDataOut> {
  return axios.post("/labeling", data);
}

export const useSubmitLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitLabel,
    onSuccess: () => {
      // Invalidate evaluation query to refresh stats
      queryClient.invalidateQueries({ queryKey: ["evaluation"] });
      // Invalidate labeling message to fetch next one
      queryClient.invalidateQueries({ queryKey: ["labeling-message"] });
    },
  });
};
