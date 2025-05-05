import React, {useCallback, useEffect, useState} from 'react';
import TaskModal from './TaskModal.jsx';
import TaskPreview from './TaskPreview.jsx';
import {toast, ToastContainer} from 'react-toastify';
import {getAuthToken} from '../../utils/tokenAuth.js';
import {deleteById} from "../../utils/crudHelper.js";
import Sidebar from "../navigation/Sidebar.jsx";
import Topbar from "../navigation/Topbar.jsx";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({open: false, task: null});

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/api/tasks', {
                headers: {'Authorization': `Bearer ${getAuthToken()}`}
            });
            if (!res.ok) throw new Error('Fetch failed');
            const data = await res.json();
            setTasks(Array.isArray(data) ? data : data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleDelete = async id => {
        try {
            await deleteById('tasks', id);
            toast.success('Task was deleted 🚀');
            fetchTasks();
        } catch (e) {
            toast.error(`Failed to delete: ${e.message}`);
        }
    };


    return (
        <div className="w-screen h-screen flex">
            <ToastContainer position="bottom-right" autoClose={1500}/>
            <Sidebar/>
            <div className="flex-1 flex flex-col">
                <Topbar currentPage={'tasks'} onCreate={() => setModal({open: true, task: null})}/>

                <div className="p-4 grid grid-cols-3 gap-4">
                    {loading && <p>Loading…</p>}
                    {!loading && tasks.map(t => (
                        <div key={t.id} className="bg-gray-200 p-4 rounded">
                            <TaskPreview
                                name={t.name}
                                status={t.status}
                                timeEst={t.timeEst}
                                onEdit={() => setModal({open: true, task: t})}
                                onDelete={() => handleDelete(t.id)}
                            />
                        </div>
                    ))}
                </div>

                <TaskModal
                    isOpen={modal.open}
                    task={modal.task}
                    onClose={() => setModal({open: false, task: null})}
                    onTaskSaved={() => {
                        setModal({open: false, task: null});
                        fetchTasks();
                    }}
                />
            </div>
        </div>
    );

};

export default Tasks;
