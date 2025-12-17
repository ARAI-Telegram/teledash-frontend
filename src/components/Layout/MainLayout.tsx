import {
  CloseButton,
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  mdiAccount,
  mdiBookmark,
  mdiBrain,
  mdiCloseCircle,
  mdiCog,
  mdiHome,
  mdiMagnify,
  mdiMenu,
  mdiTag,
} from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";
import * as React from "react";
import { Link, NavLink } from "react-router-dom";

import { useCountTotalUnreadMessages } from "features/saved-searches";
import { useLogout, useUser } from "lib/auth";

import { APP_NAME } from "config";

type SideNavigationItem = {
  name: string;
  to: string;
  icon: string;
  status?: React.ReactNode;
};

const SideNavigation = ({ onItemClick }: { onItemClick?: () => void }) => {
  const totalUnreadMessages = useCountTotalUnreadMessages();

  const navigation = [
    {
      name: "Start",
      to: ".",
      icon: mdiHome,
    },
    {
      name: "Chats",
      to: "./search/chats",
      icon: mdiMagnify,
    },
    {
      name: "Messages",
      to: "./search/messages",
      icon: mdiMagnify,
    },
    {
      name: "Users",
      to: "./search/users",
      icon: mdiMagnify,
    },
    {
      name: "Saved Searches",
      to: "./saved-searches",
      icon: mdiBookmark,
      status: totalUnreadMessages === "0" ? null : totalUnreadMessages,
    },
    {
      name: "Tags",
      to: "./tags",
      icon: mdiTag,
    },
    {
      name: "Configuration",
      to: "./config",
      icon: mdiCog,
    },
    {
      name: "Classification",
      to: "./classification/evaluation",
      icon: mdiBrain,
    },
  ].filter(Boolean) as SideNavigationItem[];

  return (
    <>
      {navigation.map((item, index) => (
        <NavLink
          end={index === 0}
          key={item.name}
          to={item.to}
          onClick={onItemClick}
          className={({ isActive }: { isActive: boolean }) =>
            clsx(
              "group flex items-center whitespace-nowrap rounded-md px-2 py-2 text-base font-medium text-gray-300",
              "border-l-4 border-transparent",
              !isActive && "hover:bg-gray-700 hover:text-white",
              isActive &&
                "border-l-indigo-500 bg-gray-700 text-indigo-400 hover:bg-gray-600 hover:text-indigo-300",
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                path={item.icon}
                size={1}
                aria-hidden="true"
                className={clsx(
                  "text-gray-400 group-hover:text-gray-300",
                  "mr-4 h-6 w-6 flex-shrink-0",
                  isActive && "text-indigo-400 group-hover:text-indigo-300",
                )}
              />
              {item.name}
              {item.status && (
                <span
                  className={clsx(
                    "mx-2 inline-flex items-center rounded-full bg-gray-400 px-2 text-sm font-medium text-gray-800",
                    isActive && "bg-indigo-400 group-hover:bg-indigo-300",
                  )}
                >
                  {item.status}
                </span>
              )}
            </>
          )}
        </NavLink>
      ))}
    </>
  );
};

type UserNavigationItem = {
  name: string;
  to: string;
  onClick?: () => void;
};

const UserNavigation = () => {
  const user = useUser();
  const logout = useLogout();

  const userNavigation = [
    { name: "My account", to: "./account" },
    user.data?.is_superuser && { name: "Administration", to: "./admin" },
    {
      name: "Sign out",
      to: "",
      onClick: async () => {
        try {
          await logout.mutateAsync({});
        } catch (error) {
          // TODO: Display the error message.
          console.error(error);
        }
      },
    },
  ].filter(Boolean) as UserNavigationItem[];

  return (
    <Menu as="div" className="relative ml-3">
      {({ open }) => (
        <>
          <div>
            <MenuButton className="flex max-w-xs items-center rounded-full bg-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <span className="sr-only">Open user menu</span>
              <Icon path={mdiAccount} size={1} aria-hidden="true" />
            </MenuButton>
          </div>
          <Transition
            show={open}
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems
              static
              className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              {userNavigation.map((item) => (
                <MenuItem key={item.name}>
                  {({ focus }) => (
                    <Link
                      onClick={item.onClick}
                      to={item.to}
                      className={clsx(
                        focus ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700",
                      )}
                    >
                      {item.name}
                    </Link>
                  )}
                </MenuItem>
              ))}
            </MenuItems>
          </Transition>
        </>
      )}
    </Menu>
  );
};

type MobileSidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MobileSidebar = ({ sidebarOpen, setSidebarOpen }: MobileSidebarProps) => {
  return (
    <Transition show={sidebarOpen} as={React.Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 z-40 flex md:hidden"
        open={sidebarOpen}
        onClose={setSidebarOpen}
      >
        <TransitionChild
          as={React.Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </TransitionChild>
        <TransitionChild
          as={React.Fragment}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <DialogPanel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800 pb-4 pt-5">
            <TransitionChild
              as={React.Fragment}
              enter="ease-in-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="absolute right-0 top-0 -mr-12 pt-4">
                <CloseButton className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Close sidebar</span>
                  <Icon path={mdiCloseCircle} aria-hidden="true" />
                </CloseButton>
              </div>
            </TransitionChild>
            <div className="flex flex-shrink-0 items-center px-4">
              <Logo />
            </div>
            <div className="mt-5 h-0 flex-1 overflow-y-auto">
              <nav className="space-y-1 px-2">
                <SideNavigation onItemClick={() => setSidebarOpen(false)} />
              </nav>
            </div>
          </DialogPanel>
        </TransitionChild>
        <div className="w-14 flex-shrink-0" aria-hidden="true"></div>
      </Dialog>
    </Transition>
  );
};

const Sidebar = () => {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex min-w-64 flex-col">
        <div className="flex h-0 flex-1 flex-col">
          <div className="flex h-16 flex-shrink-0 items-center bg-gray-900 px-4">
            <Logo />
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 bg-gray-800 px-2 py-4">
              <SideNavigation />
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <Link className="flex items-center text-white" to=".">
      <span className="text-xl font-semibold text-white">{APP_NAME}</span>
    </Link>
  );
};

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar />
      <div className="flex w-0 flex-1 flex-col overflow-hidden">
        {/* content header */}
        <div className="relative z-10 flex h-16 flex-shrink-0 bg-white shadow-sm">
          <button
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Icon path={mdiMenu} size={1} aria-hidden="true" />
          </button>
          <div className="flex flex-1 justify-end px-4">
            <div className="ml-4 flex items-center md:ml-6">
              <UserNavigation />
            </div>
          </div>
        </div>

        {/* content */}
        <main className="relative flex-1 overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
};
