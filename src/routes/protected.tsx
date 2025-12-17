import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { Spinner } from "components/Elements";
import { MainLayout } from "components/Layout";
import { lazyImport } from "utils/lazyImport";
import { Labeling, Evaluation } from "features/classification";

const { Dashboard } = lazyImport(() => import("features/misc"), "Dashboard");
const { Profile } = lazyImport(() => import("features/accounts"), "Profile");
const { Admin } = lazyImport(() => import("features/accounts"), "Admin");
const { Chat } = lazyImport(() => import("features/chats"), "Chat");
const { Configuration } = lazyImport(
  () => import("features/misc"),
  "Configuration",
);
const { SavedSearch } = lazyImport(
  () => import("features/saved-searches"),
  "SavedSearch",
);
const { SavedSearches } = lazyImport(
  () => import("features/saved-searches"),
  "SavedSearches",
);
const { Search } = lazyImport(() => import("features/search"), "Search");
const { User } = lazyImport(() => import("features/users"), "User");
const { TagView } = lazyImport(() => import("features/tags"), "TagView");

const App = () => {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <Spinner size="xl" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </MainLayout>
  );
};

export const protectedRoutes = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/search", element: <Search filterKey="chats" /> },
      {
        path: "/search/chats",
        element: <Search filterKey="chats" />,
      },
      {
        path: "/search/messages",
        element: <Search filterKey="messages" />,
      },
      {
        path: "/search/users",
        element: <Search filterKey="users" />,
      },
      { path: "/chat/:chatId", element: <Chat /> },
      { path: "/user/:userId", element: <User /> },
      { path: "/saved-searches", element: <SavedSearches /> },
      { path: "/saved-searches/:savedSearchId", element: <SavedSearch /> },
      { path: "/tags", element: <TagView /> },
      { path: "/account", element: <Profile /> },
      { path: "/admin", element: <Admin /> },
      { path: "/config", element: <Configuration /> },
      { path: "/classification/evaluation", element: <Evaluation /> },
      { path: "/classification/labeling", element: <Labeling /> },
      { path: "*", element: <Navigate to="." /> },
    ],
  },
];
