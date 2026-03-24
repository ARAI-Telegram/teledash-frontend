import { http, HttpResponse } from "msw";
import { API_URL } from "config";
import { server } from "test/mocks/server";
import { renderHook, waitFor } from "test/test-utils";

import { useLabelingMessage } from "./getLabelingMessage";

describe("useLabelingMessage", () => {
  it("fetches and returns message on success", async () => {
    const { result } = renderHook(() => useLabelingMessage());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({
      id: "msg-1",
      text: "Test message for labeling",
      label_classifier: null,
    });
  });

  it("returns error without retrying on 404", async () => {
    let callCount = 0;
    server.use(
      http.get(`${API_URL}/labeling`, () => {
        callCount++;
        return new HttpResponse(null, { status: 404 });
      }),
    );

    const { result } = renderHook(() => useLabelingMessage());

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(callCount).toBe(1);
  });
});
