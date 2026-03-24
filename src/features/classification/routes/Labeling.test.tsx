import { http, HttpResponse } from "msw";
import { API_URL } from "config";
import { server } from "test/mocks/server";
import { render, screen, waitFor, userEvent } from "test/test-utils";

import { Labeling } from "./Labeling";

describe("Labeling", () => {
  it("shows loading state while fetching", () => {
    // Delay the response so loading state is visible
    server.use(
      http.get(`${API_URL}/labeling`, () => {
        return new Promise(() => {}); // Never resolves
      }),
    );

    render(<Labeling />);
    expect(screen.getByText("Loading message…")).toBeInTheDocument();
  });

  it("shows error message on fetch failure", async () => {
    server.use(
      http.get(`${API_URL}/labeling`, () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    render(<Labeling />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it("shows empty state with link when no messages", async () => {
    server.use(
      http.get(`${API_URL}/labeling`, () => {
        return HttpResponse.json(null);
      }),
    );

    render(<Labeling />);

    await waitFor(() => {
      expect(
        screen.getByText("No messages available for labeling"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Back to Evaluation")).toBeInTheDocument();
  });

  it("renders message text and labeling UI when loaded", async () => {
    render(<Labeling />);

    await waitFor(() => {
      expect(
        screen.getByText("Test message for labeling"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
    expect(screen.getByText("Labeling Guidelines:")).toBeInTheDocument();
    expect(screen.getByText("Skip Message")).toBeInTheDocument();
  });

  it("Yes button submits label 1", async () => {
    let submittedBody: { message_id: string; label_manual: number } | null =
      null;
    server.use(
      http.post(`${API_URL}/labeling`, async ({ request }) => {
        submittedBody = (await request.json()) as typeof submittedBody;
        return HttpResponse.json({
          message_id: submittedBody!.message_id,
          text: "Test message for labeling",
          label_classifier: null,
          label_manual: submittedBody!.label_manual,
          created_at: "2026-03-24T12:00:00Z",
        });
      }),
    );

    render(<Labeling />);

    await waitFor(() => {
      expect(screen.getByText("Yes")).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByText("Yes"));

    await waitFor(() => {
      expect(submittedBody).toEqual({
        message_id: "msg-1",
        label_manual: 1,
      });
    });
  });

  it("No button submits label 0", async () => {
    let submittedBody: { message_id: string; label_manual: number } | null =
      null;
    server.use(
      http.post(`${API_URL}/labeling`, async ({ request }) => {
        submittedBody = (await request.json()) as typeof submittedBody;
        return HttpResponse.json({
          message_id: submittedBody!.message_id,
          text: "Test message for labeling",
          label_classifier: null,
          label_manual: submittedBody!.label_manual,
          created_at: "2026-03-24T12:00:00Z",
        });
      }),
    );

    render(<Labeling />);

    await waitFor(() => {
      expect(screen.getByText("No")).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByText("No"));

    await waitFor(() => {
      expect(submittedBody).toEqual({
        message_id: "msg-1",
        label_manual: 0,
      });
    });
  });

  it("Y key submits label 1", async () => {
    let submittedBody: { message_id: string; label_manual: number } | null =
      null;
    server.use(
      http.post(`${API_URL}/labeling`, async ({ request }) => {
        submittedBody = (await request.json()) as typeof submittedBody;
        return HttpResponse.json({
          message_id: submittedBody!.message_id,
          text: "Test message for labeling",
          label_classifier: null,
          label_manual: submittedBody!.label_manual,
          created_at: "2026-03-24T12:00:00Z",
        });
      }),
    );

    render(<Labeling />);

    await waitFor(() => {
      expect(
        screen.getByText("Test message for labeling"),
      ).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.keyboard("y");

    await waitFor(() => {
      expect(submittedBody).toEqual({
        message_id: "msg-1",
        label_manual: 1,
      });
    });
  });

  it("N key submits label 0", async () => {
    let submittedBody: { message_id: string; label_manual: number } | null =
      null;
    server.use(
      http.post(`${API_URL}/labeling`, async ({ request }) => {
        submittedBody = (await request.json()) as typeof submittedBody;
        return HttpResponse.json({
          message_id: submittedBody!.message_id,
          text: "Test message for labeling",
          label_classifier: null,
          label_manual: submittedBody!.label_manual,
          created_at: "2026-03-24T12:00:00Z",
        });
      }),
    );

    render(<Labeling />);

    await waitFor(() => {
      expect(
        screen.getByText("Test message for labeling"),
      ).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.keyboard("n");

    await waitFor(() => {
      expect(submittedBody).toEqual({
        message_id: "msg-1",
        label_manual: 0,
      });
    });
  });

  it("buttons are disabled while mutation is pending", async () => {
    // Make POST hang so isPending stays true
    server.use(
      http.post(`${API_URL}/labeling`, () => {
        return new Promise(() => {}); // Never resolves
      }),
    );

    render(<Labeling />);

    await waitFor(() => {
      expect(screen.getByText("Yes")).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByText("Yes"));

    await waitFor(() => {
      expect(screen.getByText("Yes").closest("button")).toBeDisabled();
      expect(screen.getByText("No").closest("button")).toBeDisabled();
    });
  });

  it("keyboard shortcuts are ignored while mutation is pending", async () => {
    let postCallCount = 0;
    server.use(
      http.post(`${API_URL}/labeling`, () => {
        postCallCount++;
        return new Promise(() => {}); // Never resolves
      }),
    );

    render(<Labeling />);

    await waitFor(() => {
      expect(
        screen.getByText("Test message for labeling"),
      ).toBeInTheDocument();
    });

    const user = userEvent.setup();

    // First key press triggers the mutation
    await user.keyboard("y");
    await waitFor(() => expect(postCallCount).toBe(1));

    // Second key press should be ignored because mutation is pending
    await user.keyboard("n");

    // Give it a tick to ensure no additional call happens
    await new Promise((r) => setTimeout(r, 50));
    expect(postCallCount).toBe(1);
  });

  it("skip button triggers refetch", async () => {
    let fetchCount = 0;
    server.use(
      http.get(`${API_URL}/labeling`, () => {
        fetchCount++;
        return HttpResponse.json({
          id: `msg-${fetchCount}`,
          text: `Message ${fetchCount}`,
          label_classifier: null,
        });
      }),
    );

    render(<Labeling />);

    await waitFor(() => {
      expect(screen.getByText("Message 1")).toBeInTheDocument();
    });

    const initialCount = fetchCount;
    const user = userEvent.setup();
    await user.click(screen.getByText("Skip Message"));

    await waitFor(() => {
      expect(fetchCount).toBeGreaterThan(initialCount);
    });
  });
});
