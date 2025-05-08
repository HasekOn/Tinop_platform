import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { getCurrentUser } from "../../utils/tokenAuth.js";
import { InitialsAvatar } from "../../utils/InitialsAvatar.jsx";

const Topbar = ({
                    currentPage,
                    onSearch = null,
                    onSort = null,
                    onFilter = null,
                    sortOptions = [],
                    filterOptions = [],
                    filterName = null,
                    onCreate = null,
                    setIsSidebarOpen,
                }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [selectedSort, setSelectedSort] = useState(
        sortOptions.length > 0 ? sortOptions[0].value : ""
    );
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(
        filterOptions.length > 0 ? filterOptions[0].value : ""
    );
    const user = { name: getCurrentUser().name ?? "" };

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (onSearch) onSearch(term);
    };
    const toggleSortDropdown = () => setShowSortDropdown(!showSortDropdown);
    const handleSortOptionClick = (value) => {
        setSelectedSort(value);
        setShowSortDropdown(false);
        if (onSort) onSort(value);
    };
    const toggleFilterDropdown = () => setShowFilterDropdown(!showFilterDropdown);
    const handleFilterOptionClick = (value) => {
        setSelectedFilter(value);
        setShowFilterDropdown(false);
        if (onFilter) onFilter(value);
    };
    const handleCreate = () => {
        if (onCreate) onCreate();
    };
    const getCreateButtonText = () => {
        switch (currentPage) {
            case "tasks":
                return "New Task";
            case "Project Tasks":
                return "New Project Task";
            case "projects":
                return "New Project";
            case "ideas":
                return "New Idea";
            case "timeSheets":
                return "New Record";
            default:
                return "Create New";
        }
    };

    return (
        <div className="bg-white p-4 shadow w-full">
            <div className="flex flex-col md:flex-row items-center justify-between w-full space-y-4 md:space-y-0">
                <div className="flex flex-row flex-nowrap overflow-x-auto overflow-visible md:overflow-visible items-start w-full md:w-auto space-x-3 pb-2">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition"
                    >
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    <div className="w-full max-w-xs">
                        <input
                            type="text"
                            placeholder={`Search for a ${currentPage || "item"}`}
                            className="border p-2 rounded w-full text-black truncate"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    {sortOptions.length > 0 && (
                        <div className="relative w-full md:w-auto">
                            <button
                                onClick={toggleSortDropdown}
                                className="bg-gray-200 text-black px-3 py-2 rounded w-full md:w-auto hover:bg-gray-300 flex items-center justify-between"
                            >
                                Sort <FontAwesomeIcon icon={faCaretDown} className="ml-1" />
                            </button>
                            {showSortDropdown && (
                                <div className="fixed inset-0 z-50 md:absolute md:right-0 md:inset-auto md:mt-2">
                                    <div className="bg-white border rounded shadow-lg m-4 md:m-0 md:w-48">
                                        {sortOptions.map((option) => (
                                            <div
                                                key={option.value}
                                                onClick={() => handleSortOptionClick(option.value)}
                                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {option.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {filterOptions.length > 0 && (
                        <div className="relative w-full md:w-auto">
                            <button
                                onClick={toggleFilterDropdown}
                                className="bg-gray-200 text-black px-3 py-2 rounded w-full md:w-auto hover:bg-gray-300 flex items-center justify-between"
                            >
                                {filterName}
                                <FontAwesomeIcon icon={faCaretDown} className="ml-1" />
                            </button>
                            {showFilterDropdown && (
                                <div className="fixed inset-0 z-50 md:absolute md:right-0 md:inset-auto md:mt-2">
                                    <div className="bg-white border rounded shadow-lg m-4 md:m-0 md:w-48">
                                        {filterOptions.map((option) => (
                                            <div
                                                key={option.value}
                                                onClick={() => handleFilterOptionClick(option.value)}
                                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {option.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-x-3 w-full md:w-auto justify-end">
                    <button
                        onClick={handleCreate}
                        className="bg-green-500 text-white px-4 py-2 rounded w-full md:w-auto flex items-center justify-center hover:bg-green-600"
                    >
                        <span className="mr-1 font-bold">+</span>
                        {getCreateButtonText()}
                    </button>
                    <InitialsAvatar name={user?.name} />
                </div>
            </div>
        </div>
    );
};

export default Topbar;
