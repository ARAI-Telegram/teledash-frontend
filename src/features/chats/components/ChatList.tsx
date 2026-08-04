import { mdiAccountMultiple, mdiCalendar } from "@mdi/js";
import Icon from "@mdi/react";
import { Fragment } from "react";

import {
  Badge,
  FormattedMetricNumber,
  LoadingState,
  LoadMoreButton,
  ReactECharts,
  ReactEChartsProps,
  ResultsCount,
} from "components/Elements";
import {
  ChatListTags,
  ChatSortSelector,
  createChatBadgesArray,
  DeleteChat,
  TooltipChatLink,
  useChats,
} from "features/chats";
import { formatDate, parseDate } from "lib/date";
import { formatNumber } from "utils/formatNumber";

import { Chat, ChatSortBy, GetChatsParams, OrderEnum } from "types";

const ChatListItem = (props: Chat) => {
  const badgesArray = createChatBadgesArray(props);
  const membersGrowthLastDay = props.metrics?.growth_last_day?.diff ?? 0;
  const activityLastDay: ReactEChartsProps["option"] | undefined =
    props.metrics?.activity_last_day != null
      ? {
          tooltip: {
            trigger: "axis",
            formatter: (params: any) => {
              return `${params[0].value} messages ${24 - params[0].name} hours ago`;
            },
          },
          grid: {
            left: 0,
            right: 0,
            top: 5,
            bottom: 5,
            height: 30,
          },
          xAxis: {
            type: "category",
            show: false,
          },
          yAxis: {
            type: "value",
            show: false,
          },
          series: [
            {
              name: "Activity last 24 hours",
              type: "line",
              data: props.metrics.activity_last_day.data ?? undefined,
              smooth: true,
              connectNulls: true,
              zlevel: 1,
              symbol: "none",
            },
          ],
        }
      : undefined;

  return (
    <li className="col-span-5 grid grid-cols-1 gap-x-4 px-4 py-2 sm:px-6 lg:col-span-5 lg:grid-cols-subgrid lg:grid-rows-none lg:items-center">
      {/* Title + badges (always first) */}
      <div className="flex min-w-0 items-center lg:col-start-1">
        <div className="flex min-w-0 flex-wrap items-center gap-2 lg:flex-nowrap">
          <TooltipChatLink chat={props} className="truncate font-medium" />
          {badgesArray.map(({ label, variant }) => (
            <Badge
              key={label}
              label={label}
              variant={variant}
              className="shrink-0"
            />
          ))}
          <ChatListTags tags={props.tags} size="sm" variant="purple" />
        </div>
      </div>

      {/* Second row on mobile, separate columns on desktop */}
      <div className="flex items-center justify-between lg:contents">
        {/* Activity chart */}
        <div className="flex h-[40px] flex-1 items-center justify-start lg:col-start-2 lg:flex-none">
          {activityLastDay && <ReactECharts option={activityLastDay} />}
        </div>

        {/* Members info + Date info */}
        <div className="flex items-center justify-end gap-4 lg:contents">
          {/* Members info */}
          <div className="flex items-center gap-2 lg:col-start-3">
            {props.members_count != null && (
              <>
                <Icon
                  path={mdiAccountMultiple}
                  size={1}
                  className="text-gray-500"
                />
                <span
                  className="font-medium"
                  title={`Members: ${props.members_count}`}
                >
                  {formatNumber(props.members_count)}
                </span>
              </>
            )}
            {membersGrowthLastDay !== 0 && (
              <FormattedMetricNumber value={membersGrowthLastDay} />
            )}
          </div>

          {/* Date info */}
          <div className="flex items-center gap-2 lg:col-start-4">
            {props.updated_at && (
              <>
                <Icon path={mdiCalendar} size={1} className="text-gray-500" />
                <span
                  className="font-medium"
                  title={`Updated At: ${formatDate(parseDate(props.updated_at))}`}
                >
                  {formatDate(parseDate(props.updated_at), "dd.MM.yyyy")}
                </span>
              </>
            )}
          </div>

          {/* Delete */}
          <div className="flex items-center lg:col-start-5">
            <DeleteChat chat={props} />
          </div>
        </div>
      </div>
    </li>
  );
};

const defaultQueryParams: GetChatsParams = {
  limit: 50,
  exclude: [
    "permissions",
    "linked_chat",
    "members",
    "pinned_message",
    "invite_link",
    "photo",
  ],
};

type ChatListProps = {
  queryParams?: GetChatsParams;
  onUpdateSort: (sortBy: ChatSortBy, order: OrderEnum) => void;
};

export const ChatList = ({ queryParams, onUpdateSort }: ChatListProps) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useChats({
    params: { ...defaultQueryParams, ...queryParams },
  });

  const hasResults = data && data.pages[0].data.length > 0;

  return (
    <>
      {status === "pending" ? (
        <LoadingState size="sm" message="Loading chats…" />
      ) : status === "error" ? (
        <div className="text-red-500">Error: {error?.message}</div>
      ) : hasResults ? (
        <div className="space-y-2">
          <div className="flex w-full items-center justify-end space-x-4">
            {data.pages[0].count_total != null && (
              <ResultsCount count={data.pages[0].count_total} />
            )}
            <ChatSortSelector
              currentSort={{
                ...data.pages[0].sort,
                sortBy: data.pages[0].sort.sort_by,
              }}
              onUpdateSort={onUpdateSort}
              ignoreSortByOptions={
                queryParams?.search_query ? undefined : ["score"]
              }
            />
          </div>
          <div className="-mx-4 bg-white shadow sm:mx-0 sm:rounded-lg">
            <ul className="grid grid-cols-[1fr_min-content_min-content_min-content_min-content] divide-y divide-gray-200">
              {data.pages.map((page, index) => (
                <Fragment key={index}>
                  {page.data.map((chat) => (
                    <ChatListItem key={chat.id} {...chat} />
                  ))}
                </Fragment>
              ))}
            </ul>

            <LoadMoreButton
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              onLoadMore={fetchNextPage}
            />
          </div>
        </div>
      ) : (
        <div>No chats found.</div>
      )}
    </>
  );
};

// id?: number;
// title?: string;
// username?: string; (tooltip)
// type?: components["schemas"]["ChatType"]; (badge)
// language?: string;
// is_verified?: boolean; (flags)
// is_restricted?: boolean; (flags)
// is_scam?: boolean; (flags)
// is_fake?: boolean; (flags)
// description?: string;
// members_count?: number;
// restrictions?: { [key: string]: unknown }[];
// updated_at?: string;
// scraped_at?: string;
// scraped_by?: string;

// permissions?: { [key: string]: unknown };
// linked_chat?: components["schemas"]["ChatRef"];
// members?: components["schemas"]["UserRef"][];
// pinned_message?: components["schemas"]["MessageRef"];
// invite_link?: string;
// photo?: { [key: string]: unknown };
// language_other?: string[];
