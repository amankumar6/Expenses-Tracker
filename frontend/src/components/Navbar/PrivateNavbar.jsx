import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";

import {
    DisclosureButton,
    Disclosure,
    Menu,
    MenuItem,
    MenuItems,
    Transition,
    DisclosurePanel,
    MenuButton,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { SiCashapp } from "react-icons/si";

import { logoutAction } from "../../redux/slice/authSlice";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function PrivateNavbar() {
    const dispatch = useDispatch();

    const logoutHandler = () => {
        dispatch(logoutAction());
        localStorage.removeItem("userInfo");
    };

    return (
        <Disclosure as="nav" className="bg-white ">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-start items-center">
                            <div className="flex md:justify-center md:flex-row md:w-full">
                                <div className="-ml-2 mr-2 flex items-left md:hidden">
                                    {/* Mobile menu button */}
                                    <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                        <span className="absolute -inset-0.5" />
                                        <span className="sr-only">
                                            Open main menu
                                        </span>
                                        {open ? (
                                            <XMarkIcon
                                                className="block h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <Bars3Icon
                                                className="block h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </DisclosureButton>
                                </div>
                                <div className="flex flex-shrink-0 items-center">
                                    {/* Logo */}
                                    <SiCashapp className="h-8 w-auto text-green-500" />
                                </div>
                                <div className="hidden md:ml-6 md:flex md:space-x-8">
                                    <Link
                                        to="/"
                                        className="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900"
                                    >
                                        CashCrafter
                                    </Link>
                                </div>
                                <div className="hidden md:ml-6 md:flex md:space-x-8">
                                    <Link
                                        to="/add-transaction"
                                        className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                    >
                                        Add Transaction
                                    </Link>
                                    <Link
                                        to="/add-category"
                                        className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                    >
                                        Add Category
                                    </Link>
                                    <Link
                                        to="/categories"
                                        className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                    >
                                        Categories
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        to="/dashboard"
                                        className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                    >
                                        Dashboard
                                    </Link>
                                </div>
                            </div>
                            <div className="hidden md:ml-6 md:flex md:space-x-8 items-center">
                                <div className="flex-shrink-0">
                                    <button
                                        onClick={logoutHandler}
                                        type="button"
                                        className="relative m-2 inline-flex items-center gap-x-1.5 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                                    >
                                        <IoLogOutOutline
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                        <span>Logout</span>
                                    </button>
                                </div>
                                <div className="hidden md:ml-1 md:flex md:flex-shrink-0 md:items-center">
                                    {/* Profile dropdown */}
                                    <Menu as="div" className="relative ml-1">
                                        <div>
                                            <MenuButton className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">
                                                    Open user menu
                                                </span>
                                            </MenuButton>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-200"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <MenuItem>
                                                    {({ active }) => (
                                                        <Link
                                                            to="/student-dashboard"
                                                            className={classNames(
                                                                active
                                                                    ? "bg-gray-100"
                                                                    : "",
                                                                "block px-4 py-2 text-sm text-gray-700"
                                                            )}
                                                        >
                                                            My Dashboard
                                                        </Link>
                                                    )}
                                                </MenuItem>
                                                <MenuItem>
                                                    {({ focus }) => (
                                                        <button
                                                            onClick={
                                                                logoutHandler
                                                            }
                                                            className={classNames(
                                                                focus
                                                                    ? "bg-gray-100"
                                                                    : "",
                                                                "block px-4 py-2 text-sm text-gray-700"
                                                            )}
                                                        >
                                                            Sign out
                                                        </button>
                                                    )}
                                                </MenuItem>
                                            </MenuItems>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <DisclosurePanel className="md:hidden">
                        <div className="space-y-1 pb-3 pt-2">
                            <Link to="/">
                                <DisclosureButton
                                    as="button"
                                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
                                >
                                    CashCrafter
                                </DisclosureButton>
                            </Link>
                            <Link to="/add-transaction">
                                <DisclosureButton
                                    as="button"
                                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
                                >
                                    Add Transaction
                                </DisclosureButton>
                            </Link>
                            <Link to="/add-category">
                                <DisclosureButton
                                    as="button"
                                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
                                >
                                    Add Category
                                </DisclosureButton>
                            </Link>
                            <Link to="/categories">
                                <DisclosureButton
                                    as="button"
                                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
                                >
                                    Categories
                                </DisclosureButton>
                            </Link>
                            <Link to="/profile">
                                <DisclosureButton
                                    as="button"
                                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
                                >
                                    Profile
                                </DisclosureButton>
                            </Link>
                            <Link to="/dashboard">
                                <DisclosureButton
                                    as="button"
                                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
                                >
                                    My Dashboard
                                </DisclosureButton>
                            </Link>
                        </div>
                        {/* Profile links */}
                        <div className="border-t border-gray-200 pb-3 pt-1">
                            <div className="mt-2 space-y-1">
                                <DisclosureButton
                                    as="button"
                                    onClick={logoutHandler}
                                    className="block px-4 py-2 text-base font-medium text-red-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6"
                                >
                                    Sign out
                                </DisclosureButton>
                            </div>
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    );
}
