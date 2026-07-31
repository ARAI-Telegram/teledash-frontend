import { Link } from "react-router-dom";

import { DeleteSavedSearch } from "./DeleteSavedSearch";
import { MessagesCount } from "./MessagesCount";

import { LoadingState } from "components/Elements";
import {
  useCountUnreadMessages,
  useSavedSearchesList,
} from "features/saved-searches";

export function SavedSearchList() {
  const {
    data: savedSearches,
    status: savedSearchesStatus,
    error,
  } = useSavedSearchesList();
  const { data: messagesCountDict, status: messagesStatus } =
    useCountUnreadMessages();

  const hasResults = savedSearches && savedSearches.length > 0;

  return (
    <>
      {savedSearchesStatus === "pending" ? (
        <LoadingState size="sm" message="Loading saved searches…" />
      ) : savedSearchesStatus === "error" ? (
        <div className="text-red-500">Error: {error?.message}</div>
      ) : hasResults ? (
        <div className={"-mx-4 bg-white shadow sm:mx-0 sm:rounded-lg"}>
          <ul className="divide-y divide-gray-200">
            {savedSearches.map((savedSearch) => {
              const messagesCount = messagesCountDict?.[savedSearch.id];
              const count_unread = messagesCount?.count_unread;
              const count_total = messagesCount?.count_total;

              return (
                <li
                  key={savedSearch.id}
                  className="flex h-14 w-full items-center justify-between px-4 py-2 font-medium sm:px-6 sm:first:rounded-t-lg sm:last:rounded-b-lg"
                >
                  <div className="truncate">
                    <Link
                      className="hover:underline"
                      to={`/saved-searches/${savedSearch.id}`}
                    >
                      {savedSearch.name}
                    </Link>
                  </div>
                  <div className="flex items-center gap-4">
                    <MessagesCount
                      count={count_unread}
                      variant="unread"
                      status={messagesStatus}
                      className="w-24"
                    />
                    <MessagesCount
                      count={count_total}
                      status={messagesStatus}
                      className="w-24"
                    />
                    <DeleteSavedSearch savedSearch={savedSearch} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div>No saved searches found.</div>
      )}
    </>
  );
}
