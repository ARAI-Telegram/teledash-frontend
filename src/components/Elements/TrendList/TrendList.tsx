import { mdiCounter, mdiTrophyOutline } from "@mdi/js";
import clsx from "clsx";
import { startCase } from "lodash";
import { Link } from "react-router-dom";

import { ListBox, ListBoxProps } from "components/Elements";

import { SavedSearch, SavedSearchesMessagesCountDict, StatsEntry } from "types";
import { formatNumber } from "utils/formatNumber";

// ListBoxProps<StatsEntry> with optional children
type StatsEntryTrendListProps = Omit<ListBoxProps<StatsEntry>, "children"> &
  Partial<Pick<ListBoxProps<StatsEntry>, "children">>;

export function StatsEntryTrendList({
  startIcon,
  title,
  items,
  length = 10,
  children,
}: StatsEntryTrendListProps) {
  return (
    <ListBox
      startIcon={startIcon}
      title={title}
      items={items}
      length={length}
      variant="ordered"
    >
      {(entry) =>
        children ? (
          children(entry)
        ) : (
          <li key={entry.value} className="flex justify-between gap-4">
            <span className="truncate font-medium">{entry.value} </span>
            <span className="font-bold tabular-nums">
              {formatNumber(entry.count)}
            </span>
          </li>
        )
      }
    </ListBox>
  );
}

type SearchQueryTrendListProps = Omit<
  StatsEntryTrendListProps,
  "startIcon" | "children"
> & {
  onItemClick?: (item: StatsEntry) => void;
};

export function SearchQueryTrendList({
  title,
  items,
  length = 10,
  onItemClick,
}: SearchQueryTrendListProps) {
  return (
    <StatsEntryTrendList
      startIcon={mdiTrophyOutline}
      title={title}
      items={items}
      length={length}
    >
      {(entry) => (
        <li key={entry.value} className="flex justify-between gap-4">
          {onItemClick ? (
            <button
              type="button"
              onClick={() => onItemClick(entry)}
              className="truncate font-medium hover:underline"
            >
              {entry.value}
            </button>
          ) : (
            <Link
              to="/search/messages"
              className="truncate font-medium hover:underline"
              state={{
                defaultFilterOptions: {
                  messages: {
                    // If the entry starts with # we consider it to be a hashtag
                    // and use exact search which matches the whole string.
                    search_type: entry.value.startsWith("#")
                      ? "exact"
                      : "flexible",
                    search_query: `"${entry.value}"`,
                  },
                },
              }}
            >
              {entry.value}
            </Link>
          )}
          <span className="font-bold tabular-nums">
            {formatNumber(entry.count)}
          </span>
        </li>
      )}
    </StatsEntryTrendList>
  );
}

type AttachmentTypesTrendListProps = Omit<
  StatsEntryTrendListProps,
  "startIcon" | "children"
> & {
  onItemClick?: (item: StatsEntry) => void;
};

export function AttachmentTypesTrendList({
  title,
  items,
  length = 10,
  onItemClick,
}: AttachmentTypesTrendListProps) {
  return (
    <StatsEntryTrendList
      startIcon={mdiTrophyOutline}
      title={title}
      items={items}
      length={length}
    >
      {(entry) => (
        <li key={entry.value} className="flex justify-between gap-4">
          {onItemClick ? (
            <button
              type="button"
              onClick={() => onItemClick(entry)}
              className="truncate font-medium hover:underline"
            >
              {entry.value
                .split("_")
                .map((s) => startCase(s))
                .join(" ")}
            </button>
          ) : (
            <Link
              to="/search/messages"
              className="truncate font-medium hover:underline"
              state={{
                defaultFilterOptions: {
                  messages: {
                    attachment_type: entry.value,
                  },
                },
              }}
            >
              {entry.value
                .split("_")
                .map((s) => startCase(s))
                .join(" ")}
            </Link>
          )}
          <span className="font-bold tabular-nums">
            {formatNumber(entry.count)}
          </span>
        </li>
      )}
    </StatsEntryTrendList>
  );
}

export function TagsTrendList({
  title,
  items,
  length = 10,
}: Omit<StatsEntryTrendListProps, "startIcon" | "children">) {
  return (
    <StatsEntryTrendList
      startIcon={mdiTrophyOutline}
      title={title}
      items={items}
      length={length}
    >
      {(entry) => (
        <li key={entry.value} className="flex justify-between gap-4">
          <Link
            to="/search/messages"
            className="truncate font-medium hover:underline"
            state={{
              defaultFilterOptions: {
                messages: {
                  tags: [entry.value],
                },
              },
            }}
          >
            {entry.value}
          </Link>
          <span className="font-bold tabular-nums">
            {formatNumber(entry.count)}
          </span>
        </li>
      )}
    </StatsEntryTrendList>
  );
}

export function SavedSearchesMessagesCountTrendList({
  savedSearches,
  messagesCountDict,
  length,
}: {
  savedSearches: SavedSearch[];
  messagesCountDict: SavedSearchesMessagesCountDict;
  length?: number;
}) {
  return (
    <ListBox<{
      name: string;
      id: string;
      countUnread: number;
      countTotal: number;
    }>
      startIcon={mdiCounter}
      title="Saved Searches"
      items={savedSearches
        .map((savedSearch) => {
          const messagesCount = messagesCountDict?.[savedSearch.id];
          const count_unread = messagesCount?.count_unread;
          const count_total = messagesCount?.count_total;

          return {
            name: savedSearch.name,
            id: savedSearch.id,
            countUnread: count_unread,
            countTotal: count_total,
          };
        })
        .sort((a, b) => {
          // First compare by countUnread
          const unreadDiff = b.countUnread - a.countUnread;
          // If equal, then compare by countTotal
          return unreadDiff !== 0 ? unreadDiff : b.countTotal - a.countTotal;
        })}
      length={length}
    >
      {(savedSearchCounts) => (
        <li key={savedSearchCounts.name} className="flex items-center gap-4">
          <span className="flex-1 truncate font-medium">
            <Link
              className="hover:underline"
              to={`/saved-searches/${savedSearchCounts.id}`}
            >
              {savedSearchCounts.name}
            </Link>
          </span>
          <span
            className={clsx(
              "w-14 flex-shrink-0 text-right font-bold tabular-nums",
              savedSearchCounts.countUnread > 0
                ? "text-green-600"
                : "text-gray-400",
            )}
          >
            {formatNumber(savedSearchCounts.countUnread ?? 0)}
          </span>
          <span className="w-14 flex-shrink-0 text-right font-bold tabular-nums">
            {formatNumber(savedSearchCounts.countTotal ?? 0)}
          </span>
        </li>
      )}
    </ListBox>
  );
}
