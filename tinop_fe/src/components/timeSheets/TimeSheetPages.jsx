import React, {useState} from 'react';
import {ToastContainer} from 'react-toastify';
import Navigation from "../navigation/Navigation.jsx";
import TimesheetList from "./TimesheetList.jsx";
import TimeSheetModal from "./TimeSheetModal.jsx";

const TimeSheetPages = () => {
    const [filter, setFilter] = useState('week');
    const [searchTerm, setSearchTerm] = useState("");
    const [sortValue, setSortValue] = useState("timeAsc");
    const [modal, setModal] = useState({isOpen: false, timeSheet: null});
    const [refreshCounter, setRefreshCounter] = useState(0);

    const sortOptions = [
        {value: "timeAsc", label: "Time Estimate Ascending"},
        {value: "timeDesc", label: "Time Estimate Descending"},
    ];

    const filterOptions = [
        {value: "today", label: "TODAY"},
        {value: "week", label: "WEEK"},
    ];

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleSort = (value) => {
        setSortValue(value);
    };

    const handleFilter = (value) => {
        setFilter(value);
    };

    const handleTimeSheetSaved = (data) => {
        console.log("TimeSheet saved:", data);
        setModal({isOpen: false, timeSheet: null});
        setRefreshCounter(prev => prev + 1);
    };

    return (
        <div className="w-screen h-screen flex flex-col">
            <ToastContainer position="bottom-right" autoClose={1500}/>

            <Navigation
                currentPage={'timeSheets'}
                onCreate={() => setModal({isOpen: true, timeSheet: null})}
                onSearch={handleSearch}
                onSort={handleSort}
                onFilter={handleFilter}
                sortOptions={sortOptions}
                filterOptions={filterOptions}
                filterName={'Period'}
            />

            <main className="flex-1 overflow-y-auto bg-gray-100">
                <TimesheetList key={refreshCounter} filter={filter} searchTerm={searchTerm} sortValue={sortValue}
                               onEdit={(record) => setModal({isOpen: true, timeSheet: record})}/>
            </main>

            {modal.isOpen && (
                <TimeSheetModal
                    isOpen={modal.isOpen}
                    timeSheet={modal.timeSheet}
                    onClose={() => setModal({isOpen: false, timeSheet: null})}
                    onTimeSheetSaved={handleTimeSheetSaved}
                />
            )}
        </div>
    );
};

export default TimeSheetPages;
