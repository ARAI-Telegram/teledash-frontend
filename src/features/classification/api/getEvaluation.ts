import { useQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";

import { EvaluationResult } from "types";

export async function getEvaluation(): Promise<EvaluationResult> {
  return axios.get("/evaluation");
}

export const useEvaluation = () => {
  return useQuery({
    queryKey: ["evaluation"],
    queryFn: getEvaluation,
    retry: false, // Don't retry on 404 (no evaluation data available yet)
  });
};
