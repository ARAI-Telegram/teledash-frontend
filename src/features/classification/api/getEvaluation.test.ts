import { http, HttpResponse } from "msw";
import { API_URL } from "config";
import { server } from "test/mocks/server";
import { renderHook, waitFor } from "test/test-utils";

import { useEvaluation } from "./getEvaluation";

describe("useEvaluation", () => {
  it("fetches and returns evaluation data on success", async () => {
    const { result } = renderHook(() => useEvaluation());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(
      expect.objectContaining({
        num_labeled_data: 1234,
        metrics: expect.objectContaining({
          accuracy: 0.92,
          f1_score: 0.91,
        }),
      }),
    );
  });

  it("returns error without retrying on failure", async () => {
    let callCount = 0;
    server.use(
      http.get(`${API_URL}/evaluation`, () => {
        callCount++;
        return new HttpResponse(null, { status: 404 });
      }),
    );

    const { result } = renderHook(() => useEvaluation());

    await waitFor(() => expect(result.current.isError).toBe(true));

    // retry: false means exactly 1 request
    expect(callCount).toBe(1);
  });
});
