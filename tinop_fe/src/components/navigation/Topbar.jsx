import React, {useState} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretDown, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {getCurrentUser} from "../../utils/tokenAuth.js";
import {InitialsAvatar} from "../../utils/InitialsAvatar.jsx";

const Topbar = ({
                    currentPage,
                    onSearch = null,
                    onSort = null,
                    onFilter = null,
                    sortOptions = [],
                    filterOptions = [],
                    filterName = null,
                    onCreate = null,
    setIsSidebarOpen
                }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [selectedSort, setSelectedSort] = useState(sortOptions.length > 0 ? sortOptions[0].value : "");
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(filterOptions.length > 0 ? filterOptions[0].value : "");
    const user = {
        name: getCurrentUser().name ?? ""
    };

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (onSearch) {
            onSearch(term);
        }
    };

    const toggleSortDropdown = () => {
        setShowSortDropdown(!showSortDropdown);
    };

    const handleSortOptionClick = (value) => {
        setSelectedSort(value);
        setShowSortDropdown(false);
        if (onSort) {
            onSort(value);
        }
    };

    const toggleFilterDropdown = () => {
        setShowFilterDropdown(!showFilterDropdown);
    };

    const handleFilterOptionClick = (value) => {
        setSelectedFilter(value);
        setShowFilterDropdown(false);
        if (onFilter) {
            onFilter(value);
        }
    };

    const handleCreate = () => {
        if (onCreate) {
            onCreate();
        }
    };

    const getCreateButtonText = () => {
        switch (currentPage) {
            case "tasks":
                return "New Task";
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
        <div className="flex justify-between items-center bg-white p-4 shadow relative w-full">
            <div className="flex items-center space-x-3 w-full max-w-md">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="bg-blue-500 text-white px-3 py-2 rounded mr-4 hover:bg-blue-600 transition"
                >
                    ☰
                </button>
                <input
                    type="text"
                    placeholder={`Search for a ${currentPage || 'item'}`}
                    className="border p-2 rounded w-full text-black"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />

                {sortOptions.length > 0 && (
                    <div className="relative">
                        <button
                            className="bg-gray-200 text-black px-3 py-2 rounded hover:bg-gray-300 flex items-center"
                            onClick={toggleSortDropdown}
                        >
                            Sort <FontAwesomeIcon icon={faCaretDown} className="ml-1"/>
                        </button>
                        {showSortDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                                {sortOptions.map(option => (
                                    <div
                                        key={option.value}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleSortOptionClick(option.value)}
                                    >
                                        {option.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {filterOptions.length > 0 && (
                    <div className="relative">
                        <button
                            className="bg-gray-200 text-black px-3 py-2 rounded hover:bg-gray-300 flex items-center"
                            onClick={toggleFilterDropdown}
                        >
                            {`${filterName}`}
                            <FontAwesomeIcon icon={faCaretDown} className="ml-1"/>
                        </button>
                        {showFilterDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                                {filterOptions.map(option => (
                                    <div
                                        key={option.value}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleFilterOptionClick(option.value)}
                                    >
                                        {option.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center space-x-3">
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded flex items-center hover:bg-green-600"
                    onClick={handleCreate}
                >
                    <span className="mr-1 font-bold">+</span>
                    {getCreateButtonText()}
                </button>

                <InitialsAvatar name={user?.name}/>
            </div>
        </div>
    );
};

export default Topbar;
