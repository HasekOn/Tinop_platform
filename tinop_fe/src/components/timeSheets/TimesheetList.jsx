import React, {useEffect, useState} from 'react';
import {getAuthToken} from '../../utils/tokenAuth.js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';

const getStatusClasses = (availability) => {
    const safeAvailability = availability || "office";
    switch (safeAvailability) {
        case 'office':
            return 'bg-blue-100 text-blue-800';
        case 'remote':
            return 'bg-green-100 text-green-800';
        case 'unavailable':
            return 'bg-gray-300 text-gray-800';
        case 'vacation':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const formatDayHeader = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const dayNum = d.getDay();
    let dayAbbrev = "";
    switch (dayNum) {
        case 1:
            dayAbbrev = "po";
            break;
        case 2:
            dayAbbrev = "út";
            break;
        case 3:
            dayAbbrev = "st";
            break;
        case 4:
            dayAbbrev = "čt";
            break;
        case 5:
            dayAbbrev = "pá";
            break;
        default:
            dayAbbrev = "";
    }
    return `${dayAbbrev} ${day}. ${month}.`;
};

const getWeekDates = (currentDate) => {
    const date = new Date(currentDate);
    let day = date.getDay();
    if (day === 0) day = 7;
    const diff = date.getDate() - day + 1;
    const monday = new Date(date);
    monday.setDate(diff);
    let weekDates = [];
    for (let i = 0; i < 5; i++) {
        let d = new Date(monday);
        d.setDate(monday.getDate() + i);
        weekDates.push(d.toISOString().split('T')[0]);
    }
    return weekDates;
};

const AvailabilityWithTooltip = ({availability, note}) => {
    const [hover, setHover] = useState(false);
    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
      <span className={`inline-block px-2 py-1 rounded text-sm ${getStatusClasses(availability)}`}>
        {availability || "office"}
          {note && " *"}
      </span>
            {hover && note && (
                <div
                    className="absolute left-0 top-full mt-1 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow z-50">
                    {note}
                </div>
            )}
        </div>
    );
};

const TimesheetList = ({filter, searchTerm, sortValue, onEdit}) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url =
                    filter === 'week'
                        ? 'http://127.0.0.1:8000/api/allAvailability?period=week'
                        : 'http://127.0.0.1:8000/api/allAvailability';
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`,
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Error loading data');
                }
                const data = await response.json();
                const fetchedUsers = data?.data?.users || [];
                setUsers(fetchedUsers);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filter]);

    const handlePrev = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - (filter === 'week' ? 7 : 1));
        setCurrentDate(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + (filter === 'week' ? 7 : 1));
        setCurrentDate(newDate);
    };

    if (loading) return <div className="p-4 text-black">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
    if (!users || users.length === 0)
        return <div className="p-4 text-gray-600">No data to display</div>;

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        return sortValue === "timeAsc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
    });

    const renderNavigationBar = () => {
        return (
            <div className="flex items-center justify-center space-x-4 mb-4">
                <button onClick={handlePrev} className="p-2 rounded bg-blue-500 hover:bg-blue-600">
                    <FontAwesomeIcon icon={faChevronLeft} className="text-white"/>
                </button>
                <div className="font-medium text-black">
                    {filter === 'today'
                        ? formatDayHeader(currentDate.toISOString().split('T')[0])
                        : (() => {
                            const weekDates = getWeekDates(currentDate);
                            return `${formatDayHeader(weekDates[0])} - ${formatDayHeader(weekDates[4])}`;
                        })()}
                </div>
                <button onClick={handleNext} className="p-2 rounded bg-blue-500 hover:bg-blue-600">
                    <FontAwesomeIcon icon={faChevronRight} className="text-white"/>
                </button>
            </div>
        );
    };

    if (filter === 'today') {
        const dayIso = currentDate.toISOString().split('T')[0];
        return (
            <div className="p-4">
                {renderNavigationBar()}
                <div className="flex justify-center">
                    <table className="w-auto bg-white border">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Name</th>
                            <th className="py-2 px-4 border-b text-left" title={dayIso}>
                                {formatDayHeader(dayIso)}
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{user.name}</td>
                                <td className="py-2 px-4 border-b">
                                    <AvailabilityWithTooltip
                                        availability={user.availability || "office"}
                                        note={user.description}
                                    />
                                    {user.isEditable && (
                                        <button
                                            onClick={() => onEdit(user)}
                                            className="focus:outline-none ml-1"
                                            title="Edit"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500"
                                                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M11 5h6m2 2v6M5 13v6h6l7-7-6-6-7 7z"/>
                                            </svg>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    } else if (filter === 'week') {
        const weekDates = getWeekDates(currentDate);
        const todayIso = new Date().toISOString().split('T')[0];

        return (
            <div className="p-4">
                {renderNavigationBar()}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Name</th>
                            {weekDates.map(date => (
                                <th
                                    key={date}
                                    className={`py-2 px-4 border-b text-center ${date === todayIso ? "bg-yellow-100" : ""}`}
                                    title={date}
                                >
                                    {formatDayHeader(date)}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {sortedUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{user.name}</td>
                                {weekDates.map(date => {
                                    const record = user.week ? user.week.find(day => day.date === date) : null;
                                    return (
                                        <td
                                            key={date}
                                            className={`py-2 px-4 border-b text-center ${date === todayIso ? "bg-yellow-50" : ""}`}
                                        >
                                            <AvailabilityWithTooltip
                                                availability={record ? record.availability : (user.availability || "office")}
                                                note={record ? record.description : user.description}
                                            />
                                            {record && record.isEditable && (
                                                <button
                                                    onClick={() => onEdit(record)}
                                                    className="focus:outline-none ml-1"
                                                    title="Edit"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         className="h-4 w-4 text-blue-500" fill="none"
                                                         viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2} d="M11 5h6m2 2v6M5 13v6h6l7-7-6-6-7 7z"/>
                                                    </svg>
                                                </button>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    } else {
        return <div className="p-4 text-gray-600">Invalid filter</div>;
    }
};

export default TimesheetList;
