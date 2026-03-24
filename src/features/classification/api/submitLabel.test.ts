import { http, HttpResponse } from "msw";
import { API_URL } from "config";
import { server } from "test/mocks/server";
import { createTestQueryClient, renderHook, waitFor } from "test/test-utils";

import { useSubmitLabel } from "./submitLabel";

describe("useSubmitLabel", () => {
  it("submits label and returns response", async () => {
    const { result } = renderHook(() => useSubmitLabel());

    result.current.mutate({ message_id: "msg-1", label_manual: 1 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(
      expect.objectContaining({
        message_id: "msg-1",
        label_manual: 1,
      }),
    );
  });

  it("invalidates evaluation and labeling-message queries on success", async () => {
    const queryClient = createTestQueryClient();

    // Pre-seed both query caches so invalidation triggers refetches
    queryClient.setQueryData(["evaluation"], { num_labeled_data: 0 });
    queryClient.setQueryData(["labeling-message"], { id: "old", text: "old" });

    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useSubmitLabel(), { queryClient });

    result.current.mutate({ message_id: "msg-1", label_manual: 1 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["evaluation"] });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["labeling-message"],
    });

    invalidateSpy.mockRestore();
  });

  it("does NOT invalidate queries on mutation error", async () => {
    server.use(
      http.post(`${API_URL}/labeling`, () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useSubmitLabel(), { queryClient });

    result.current.mutate({ message_id: "msg-1", label_manual: 1 });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(invalidateSpy).not.toHaveBeenCalled();

    invalidateSpy.mockRestore();
  });
});
