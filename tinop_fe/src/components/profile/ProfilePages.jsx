import React, {useEffect, useState} from 'react';
import {getAuthToken, getCurrentUser} from '../../utils/tokenAuth';
import {toast} from 'react-toastify';
import {InitialsAvatar} from '../../utils/InitialsAvatar.jsx';
import TaskPreview from "../tasks/TaskPreview.jsx";
import IdeaPreview from "../ideas/IdeaPreview.jsx";
import ProjectPreview from "../projects/ProjectPreview.jsx";
import {deleteById} from "../../utils/crudHelper.js";

const ProfilePages = () => {
    const user = getCurrentUser();
    const [activeTab, setActiveTab] = useState('tasks');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedTaskDetail, setSelectedTaskDetail] = useState(null);

    const getEndpointForTab = (tab) => {
        if (tab === 'tasks') return 'http://127.0.0.1:8000/api/tasks';
        if (tab === 'ideas') return 'http://127.0.0.1:8000/api/ideas';
        if (tab === 'projects') return 'http://127.0.0.1:8000/api/projects';
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
                if (!response.ok) throw new Error('Error fetching data');
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

    const handleDelete = async id => {
        try {
            await deleteById('tasks', id);
            toast.success('Task was deleted 🚀');
            fetchTasks();
        } catch (e) {
            toast.error(`Failed to delete: ${e.message}`);
        }
    };

    const handleShowDetail = (detailData) => {
        setSelectedTaskDetail(detailData);
    };

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
                        className={`cursor-pointer pb-2 ${activeTab === 'projects' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('projects')}
                    >
                        Projects
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
                                    data.map(t => (
                                        <TaskPreview
                                            id={t.id}
                                            name={t.name}
                                            status={t.status}
                                            timeEst={t.timeEst}
                                            onEdit={() => setModal({open: true, task: t})}
                                            onDelete={() => handleDelete(t.id)}
                                            onShow={handleShowDetail}
                                        />
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
                                        <IdeaPreview
                                            id={idea.id}
                                            name={idea.name}
                                            description={idea.description}
                                            likes={idea.likes}
                                            dislikes={idea.dislikes}
                                            is_user_owner={idea.is_user_owner}
                                            reaction={idea.reaction}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                        {activeTab === 'projects' && (
                            <div>
                                {data.length === 0 ? (
                                    <p>No projects available.</p>
                                ) : (
                                    data.map(project => (
                                        <ProjectPreview key={project.id} project={project}/>
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
