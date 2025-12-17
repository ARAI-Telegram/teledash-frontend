import { mdiRefresh } from "@mdi/js";
import { Link } from "react-router-dom";

import { Button, LoadingState } from "components/Elements";
import { ContentLayout } from "components/Layout";

import { useEvaluation } from "features/classification";

export const Evaluation = () => {
  const { data: evaluation, isLoading, error, refetch } = useEvaluation();

  return (
    <ContentLayout title="Model Evaluation">
      {isLoading ? (
        <LoadingState message="Loading evaluation data…" />
      ) : error ? (
        <div className="text-red-500">Error: {error?.message}</div>
      ) : !evaluation ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-600">
            No evaluation data available yet. Start labeling to build the
            evaluation dataset.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex justify-between">
            <div className="space-y-1">
              <h2 className="font-medium text-gray-900">
                Current Model Performance
              </h2>
              <p className="text-sm text-gray-500">
                Evaluation metrics based on manually labeled data
              </p>
            </div>
            <Button
              variant="secondary"
              startIcon={mdiRefresh}
              onClick={() => refetch()}
              size="sm"
            >
              Refresh Metrics
            </Button>
          </div>

          {/* Labeled Data Count */}
          <div className="rounded-lg bg-white shadow">
            <div className="px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                Labeled Data Pool
              </h3>
              <div className="mt-4">
                <div className="text-4xl font-bold text-blue-600">
                  {evaluation.num_labeled_data.toLocaleString()}
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  total manually labeled messages
                </p>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="rounded-lg bg-white shadow">
            <div className="space-y-1 border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                Performance Metrics
              </h3>
              <p className="text-sm text-gray-500">
                Classification performance on labeled data
              </p>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Accuracy
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-green-600">
                    {evaluation.metrics.accuracy}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Precision
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-blue-600">
                    {evaluation.metrics.precision}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Recall</dt>
                  <dd className="mt-1 text-3xl font-semibold text-blue-600">
                    {evaluation.metrics.recall}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    F1 Score
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-purple-600">
                    {evaluation.metrics.f1_score}
                  </dd>
                </div>
              </dl>

              {/* Confusion Matrix */}
              <div className="mt-8 border-t pt-6">
                <h4 className="text-sm font-medium text-gray-900">
                  Confusion Matrix
                </h4>
                <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-lg bg-green-50 p-4">
                    <dt className="text-xs font-medium text-green-700">
                      True Positives
                    </dt>
                    <dd className="mt-1 text-2xl font-semibold text-green-900">
                      {evaluation.metrics.true_positives}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-green-50 p-4">
                    <dt className="text-xs font-medium text-green-700">
                      True Negatives
                    </dt>
                    <dd className="mt-1 text-2xl font-semibold text-green-900">
                      {evaluation.metrics.true_negatives}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-red-50 p-4">
                    <dt className="text-xs font-medium text-red-700">
                      False Positives
                    </dt>
                    <dd className="mt-1 text-2xl font-semibold text-red-900">
                      {evaluation.metrics.false_positives}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-red-50 p-4">
                    <dt className="text-xs font-medium text-red-700">
                      False Negatives
                    </dt>
                    <dd className="mt-1 text-2xl font-semibold text-red-900">
                      {evaluation.metrics.false_negatives}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Recommendation Card (if available) */}
          {evaluation.recommendation && (
            <div className="rounded-lg bg-white shadow">
              <div className="space-y-2 px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Recommendation
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Sample Assessment:
                    </p>
                    <p className="text-sm text-gray-600">
                      {evaluation.recommendation.sample_assessment}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Metrics Interpretation:
                    </p>
                    <p className="text-sm text-gray-600">
                      {evaluation.recommendation.metrics_interpretation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center pt-6">
        <Link to="/classification/labeling">
          <Button size="lg">Start Manual Labeling</Button>
        </Link>
      </div>
    </ContentLayout>
  );
};
