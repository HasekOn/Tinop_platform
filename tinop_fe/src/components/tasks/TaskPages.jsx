import React, {useEffect, useState} from 'react';
import Sidebar from "../navigation/Sidebar.jsx";
import Topbar from "../navigation/Topbar.jsx";
import {getAuthToken} from "../../utils/tokenAuth.js";

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/tasks', {
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`,
                        'Accept': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                const tasksArray = Array.isArray(data)
                    ? data
                    : Array.isArray(data.data)
                        ? data.data
                        : [];
                setTasks(tasksArray);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    if (loading) return <div className="p-4 text-black">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.isArray(tasks) && tasks.length > 0 ? (
                tasks.map((task, index) => (
                    <div
                        key={index}
                        className="bg-white shadow rounded p-4 flex flex-col justify-between"
                    >
                        <h2 className="font-bold mb-2 text-black">{task.name || 'Task Title'}</h2>
                        <p className="text-sm text-black">
                            {task.status || 'Task description here...'}
                        </p>
                    </div>
                ))
            ) : (
                <div className="p-4 text-gray-600">No tasks available</div>
            )}
        </div>
    );
};

const Tasks = () => {
    return (
        <div className="w-screen h-screen flex">
            <Sidebar/>
            <div className="flex-1 flex flex-col">
                <Topbar/>
                <main className="flex-1 overflow-y-auto bg-gray-100">
                    <TaskList/>
                </main>
            </div>
        </div>
    );
};

export default Tasks;
