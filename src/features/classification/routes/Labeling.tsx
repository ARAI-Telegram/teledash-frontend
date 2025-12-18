import { mdiCheck, mdiClose, mdiRefresh } from "@mdi/js";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import { Button, LoadingState } from "components/Elements";
import { ContentLayout } from "components/Layout";

import { useLabelingMessage, useSubmitLabel } from "features/classification";

export const Labeling = () => {
  const { data: message, isLoading, error, refetch } = useLabelingMessage();
  const submitLabelMutation = useSubmitLabel();

  const handleLabel = (label: 0 | 1) => {
    if (!message) return;

    submitLabelMutation.mutate({
      message_id: message.id,
      label_manual: label,
    });
  };

  // Add keyboard support for arrow keys
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger if submitting
      if (submitLabelMutation.isPending) return;

      switch (event.key) {
        case "n":
        case "N":
          event.preventDefault();
          handleLabel(0);
          break;
        case "y":
        case "Y":
          event.preventDefault();
          handleLabel(1);
          break;
        default:
          break;
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [message, submitLabelMutation.isPending]);

  return (
    <ContentLayout title="Manual Message Labeling">
      {isLoading ? (
        <LoadingState message="Loading message…" />
      ) : error ? (
        <div className="text-red-500">Error: {error?.message}</div>
      ) : !message ? (
        <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-600">No messages available for labeling</p>
          <div>
            <Link to="/classification/evaluation">
              <Button variant="secondary">Back to Evaluation</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            Does this message match the classification criteria?
          </p>

          {/* Message Display */}
          <div className="rounded-lg bg-white shadow">
            <div className="p-8">
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-gray-900">
                  {message.text}
                </p>
              </div>
            </div>
          </div>

          {/* Labeling Instructions */}
          <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="space-y-2">
              <h3 className="font-medium text-blue-900">
                Labeling Guidelines:
              </h3>
              <div className="space-y-1 text-sm text-blue-800">
                <div>
                  <strong>✓ Yes:</strong> This message matches the
                  classification criteria
                </div>
                <div>
                  <strong>✗ No:</strong> This message does not match the
                  classification criteria
                </div>
              </div>
            </div>
            <div className="border-t border-blue-200 pt-3">
              <p className="text-xs text-blue-800">
                <strong>Keyboard shortcuts:</strong> Press{" "}
                <kbd className="rounded border bg-white px-1 py-0.5 font-mono text-xs">
                  Y
                </kbd>{" "}
                for Yes,{" "}
                <kbd className="rounded border bg-white px-1 py-0.5 font-mono text-xs">
                  N
                </kbd>{" "}
                for No
              </p>
            </div>
          </div>

          {/* Label Buttons */}
          <div className="flex justify-center gap-8">
            <Button
              size="lg"
              variant="classification-label-yes"
              onClick={() => handleLabel(1)}
              startIcon={mdiCheck}
              disabled={submitLabelMutation.isPending}
              className="px-12 py-6 text-xl"
            >
              Yes
            </Button>
            <Button
              size="lg"
              variant="classification-label-no"
              onClick={() => handleLabel(0)}
              startIcon={mdiClose}
              disabled={submitLabelMutation.isPending}
              className="px-12 py-6 text-xl"
            >
              No
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4">
            <Link to="/classification/evaluation">
              <Button variant="secondary" className="text-sm">
                ← Back to Evaluation
              </Button>
            </Link>
            <Button
              variant="secondary"
              onClick={() => refetch()}
              startIcon={mdiRefresh}
              className="text-sm"
            >
              Skip Message
            </Button>
          </div>
        </div>
      )}
    </ContentLayout>
  );
};
