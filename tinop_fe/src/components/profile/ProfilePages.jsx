import React, {useEffect, useState} from 'react';
import {getAuthToken, getCurrentUser} from '../../utils/tokenAuth';
import {toast} from 'react-toastify';
import {InitialsAvatar} from "../../utils/InitialsAvatar.jsx";
import TaskPreview from "../tasks/TaskPreview.jsx";
import IdeaPreview from "../ideas/IdeaPreview.jsx";

const ProfilePages = () => {
    const user = getCurrentUser();

    const [activeTab, setActiveTab] = useState('tasks');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getEndpointForTab = (tab) => {
        if (tab === 'tasks') {
            return 'http://127.0.0.1:8000/api/tasks';
        } else if (tab === 'ideas') {
            return 'http://127.0.0.1:8000/api/ideas';
        } else if (tab === 'timesheets') {
            return 'http://127.0.0.1:8000/api/allAvailability';
        }
        return '';
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            const url = getEndpointForTab(activeTab);
            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`,
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Error fetching data');
                }
                const result = await response.json();
                if (activeTab === 'ideas') {
                    setData(result.data ? result.data.filter(idea => idea.is_user_owner === true) : []);
                } else {
                    setData(result.data || []);
                }
            } catch (err) {
                setError(err.message);
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab, user.id]);

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <InitialsAvatar name={user.name}/>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
                        <p className="text-gray-600">{user.title || "Your Title"}</p>
                        <p className="text-gray-500 text-sm">{user.bio || "This is your bio"}</p>
                    </div>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Edit Profile
                </button>
            </div>

            <div className="mb-4 border-b">
                <ul className="flex space-x-8">
                    <li
                        className={`cursor-pointer pb-2 ${activeTab === 'tasks' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('tasks')}
                    >
                        Tasks
                    </li>
                    <li
                        className={`cursor-pointer pb-2 ${activeTab === 'ideas' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('ideas')}
                    >
                        Ideas
                    </li>
                    <li
                        className={`cursor-pointer pb-2 ${activeTab === 'timesheets' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('timesheets')}
                    >
                        Timesheets
                    </li>
                </ul>
            </div>
            <div>
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : (
                    <>
                        {activeTab === 'tasks' && (
                            <div>
                                {data.length === 0 ? (
                                    <p>No tasks available.</p>
                                ) : (
                                    data.map(task => (
                                        <TaskPreview key={task.id} task={task}/>
                                    ))
                                )}
                            </div>
                        )}
                        {activeTab === 'ideas' && (
                            <div>
                                {data.length === 0 ? (
                                    <p>No ideas available.</p>
                                ) : (
                                    data.map(idea => (
                                        <IdeaPreview key={idea.id} idea={idea}/>
                                    ))
                                )}
                            </div>
                        )}
                        {activeTab === 'timesheets' && (
                            <div>
                                {data.length === 0 ? (
                                    <p>No timesheets available.</p>
                                ) : (
                                    data.map(ts => (
                                        <div key={ts.id} className="border p-4 rounded mb-2">
                                            <h3 className="font-bold">{ts.date} - {ts.status}</h3>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfilePages;
