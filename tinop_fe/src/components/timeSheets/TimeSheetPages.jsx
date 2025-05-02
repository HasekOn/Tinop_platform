import React, {useEffect, useState} from 'react';
import Sidebar from "../navigation/Sidebar.jsx";
import Topbar from "../navigation/Topbar.jsx";

const getStatusClasses = (status) => {
    switch (status) {
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

const TimesheetList = () => {
    const [timesheets, setTimesheets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTimesheets = async () => {
            try {
                const token = '1|2aL3epMnACdUnbk6sGvuo656qypEVseLyXHyFutxbdf299fa';
                const response = await fetch('http://127.0.0.1:8000/api/user_availabilities', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Chyba při načítání dat');
                }

                const data = await response.json();

                const timesheetArray = Array.isArray(data)
                    ? data
                    : Array.isArray(data.data)
                        ? data.data
                        : [];
                setTimesheets(timesheetArray);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTimesheets();
    }, []);

    if (loading) return <div className="p-4 text-black">Načítání...</div>;
    if (error) return <div className="p-4 text-red-500">Chyba: {error}</div>;

    // Seskupíme položky podle data
    const groupedTimesheets = timesheets.reduce((acc, entry) => {
        if (!acc[entry.date]) {
            acc[entry.date] = [];
        }
        acc[entry.date].push(entry);
        return acc;
    }, {});

    // Seřadíme data vzestupně (lze rozšířit o logiku pro týdenní výběr apod.)
    const sortedDates = Object.keys(groupedTimesheets).sort();

    return (
        <div className="p-4">
            {sortedDates.length > 0 ? (
                sortedDates.map(date => (
                    <div key={date} className="mb-6">
                        <h3 className="text-xl font-bold mb-2 text-black">{date}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {groupedTimesheets[date].map((entry) => (
                                <div
                                    key={entry.id}
                                    className="bg-white shadow rounded p-4 flex flex-col justify-between"
                                >
                                    <h4 className="font-bold mb-1 text-black">
                                        {entry.user?.name || 'Neznámý uživatel'}
                                    </h4>
                                    <div
                                        className={`inline-block px-2 py-1 rounded text-sm ${getStatusClasses(entry.status)}`}>
                                        {entry.status}
                                    </div>
                                    {entry.notes && (
                                        <p className="mt-2 text-sm text-gray-600">
                                            {entry.notes}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-4 text-gray-600">Žádná data k zobrazení</div>
            )}
        </div>
    );
};

const Timesheet = () => {
    return (
        <div className="w-screen h-screen flex">
            <Sidebar/>
            <div className="flex-1 flex flex-col">
                <Topbar/>
                <main className="flex-1 overflow-y-auto bg-gray-100">
                    <TimesheetList/>
                </main>
            </div>
        </div>
    );
};

export default Timesheet;
