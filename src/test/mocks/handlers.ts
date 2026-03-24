import { http, HttpResponse } from "msw";

import { API_URL } from "config";

export const handlers = [
  http.get(`${API_URL}/labeling`, () => {
    return HttpResponse.json({
      id: "msg-1",
      text: "Test message for labeling",
      label_classifier: null,
    });
  }),

  http.get(`${API_URL}/evaluation`, () => {
    return HttpResponse.json({
      num_labeled_data: 1234,
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
      recommendation: {
        sample_assessment: "Sample size is sufficient for reliable evaluation.",
        metrics_interpretation:
          "The model shows strong overall performance with high recall.",
      },
    });
  }),

  http.post(`${API_URL}/labeling`, async ({ request }) => {
    const body = (await request.json()) as {
      message_id: string;
      label_manual: 0 | 1;
    };
    return HttpResponse.json({
      message_id: body.message_id,
      text: "Test message for labeling",
      label_classifier: null,
      label_manual: body.label_manual,
      created_at: "2026-03-24T12:00:00Z",
    });
  }),
];
