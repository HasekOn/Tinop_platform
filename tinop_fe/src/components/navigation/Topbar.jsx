import React, {useState} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {getCurrentUser} from "../../utils/tokenAuth.js";

const InitialsAvatar = ({name}) => {
    const initials = name
        ?.split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {initials || "?"}
        </div>
    );
};

const Topbar = ({
                    currentPage,
                    onSearch = null,
                    onCreate = null
                }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const user = {
        name: getCurrentUser().name ?? ""
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (onSearch) onSearch(value);
    };

    const handleCreate = () => {
        if (onCreate && typeof onCreate === 'function') {
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
        <div className="flex justify-between items-center bg-white p-4 shadow">
            <div className="flex w-full max-w-md">
                <input
                    type="text"
                    placeholder={`Search for a ${currentPage || 'item'}`}
                    className="border p-2 rounded-l w-full text-black"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button
                    className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 flex items-center justify-center ml-3"
                    onClick={handleSearch}
                >
                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                </button>
            </div>

            <div className="flex items-center ml-4">
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded flex items-center mr-4 hover:bg-green-600"
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
