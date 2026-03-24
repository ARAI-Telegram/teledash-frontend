import { http, HttpResponse } from "msw";
import { API_URL } from "config";
import { server } from "test/mocks/server";
import { render, screen, waitFor, userEvent } from "test/test-utils";

import { Evaluation } from "./Evaluation";

describe("Evaluation", () => {
  it("shows loading state while fetching", () => {
    server.use(
      http.get(`${API_URL}/evaluation`, () => {
        return new Promise(() => {}); // Never resolves
      }),
    );

    render(<Evaluation />);
    expect(screen.getByText("Loading evaluation data…")).toBeInTheDocument();
  });

  it("shows error message on fetch failure", async () => {
    server.use(
      http.get(`${API_URL}/evaluation`, () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    render(<Evaluation />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it("shows empty state when no evaluation data", async () => {
    server.use(
      http.get(`${API_URL}/evaluation`, () => {
        return new HttpResponse(null, { status: 204 });
      }),
    );

    render(<Evaluation />);

    await waitFor(() => {
      expect(
        screen.getByText(/No evaluation data available yet/),
      ).toBeInTheDocument();
    });
  });

  it("renders all metric values", async () => {
    render(<Evaluation />);

    await waitFor(() => {
      expect(screen.getByText("0.92")).toBeInTheDocument();
    });

    expect(screen.getByText("0.89")).toBeInTheDocument(); // precision
    expect(screen.getByText("0.95")).toBeInTheDocument(); // recall
    expect(screen.getByText("0.91")).toBeInTheDocument(); // f1_score
  });

  it("renders labeled data count with locale formatting", async () => {
    render(<Evaluation />);

    // toLocaleString() output varies by runtime locale
    const expected = (1234).toLocaleString();

    await waitFor(() => {
      expect(screen.getByText(expected)).toBeInTheDocument();
    });
  });

  it("renders confusion matrix values", async () => {
    render(<Evaluation />);

    await waitFor(() => {
      expect(screen.getByText("42")).toBeInTheDocument(); // TP
    });

    expect(screen.getByText("38")).toBeInTheDocument(); // TN
    expect(screen.getByText("5")).toBeInTheDocument(); // FP
    expect(screen.getByText("3")).toBeInTheDocument(); // FN

    expect(screen.getByText("True Positives")).toBeInTheDocument();
    expect(screen.getByText("True Negatives")).toBeInTheDocument();
    expect(screen.getByText("False Positives")).toBeInTheDocument();
    expect(screen.getByText("False Negatives")).toBeInTheDocument();
  });

  it("renders recommendation when present", async () => {
    render(<Evaluation />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Sample size is sufficient for reliable evaluation.",
        ),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        "The model shows strong overall performance with high recall.",
      ),
    ).toBeInTheDocument();

    expect(screen.getByText("Sample Assessment:")).toBeInTheDocument();
    expect(screen.getByText("Metrics Interpretation:")).toBeInTheDocument();
  });

  it("hides recommendation when null", async () => {
    server.use(
      http.get(`${API_URL}/evaluation`, () => {
        return HttpResponse.json({
          num_labeled_data: 100,
          metrics: {
            accuracy: 0.8,
            precision: 0.75,
            recall: 0.85,
            f1_score: 0.79,
            true_positives: 20,
            true_negatives: 15,
            false_positives: 7,
            false_negatives: 3,
          },
          recommendation: null,
        });
      }),
    );

    render(<Evaluation />);

    await waitFor(() => {
      expect(screen.getByText("0.8")).toBeInTheDocument();
    });

    expect(screen.queryByText("Sample Assessment:")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Metrics Interpretation:"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Recommendation")).not.toBeInTheDocument();
  });

  it("refresh button triggers refetch", async () => {
    let fetchCount = 0;
    server.use(
      http.get(`${API_URL}/evaluation`, () => {
        fetchCount++;
        return HttpResponse.json({
          num_labeled_data: fetchCount * 100,
          metrics: {
            accuracy: 0.92,
            precision: 0.89,
            recall: 0.95,
            f1_score: 0.91,
            true_positives: 42,
            true_negatives: 38,
            false_positives: 5,
            false_negatives: 3,
          },
          recommendation: null,
        });
      }),
    );

    render(<Evaluation />);

    await waitFor(() => {
      expect(screen.getByText("Refresh Metrics")).toBeInTheDocument();
    });

    const initialCount = fetchCount;
    const user = userEvent.setup();
    await user.click(screen.getByText("Refresh Metrics"));

    await waitFor(() => {
      expect(fetchCount).toBeGreaterThan(initialCount);
    });
  });

  it('"Start Manual Labeling" link is always visible', async () => {
    render(<Evaluation />);

    // The link is outside the loading/error/data ternary, so it's always present
    expect(screen.getByText("Start Manual Labeling")).toBeInTheDocument();
  });
});
