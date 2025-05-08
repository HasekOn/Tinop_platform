import React, {useCallback, useEffect, useState} from 'react';
import {toast, ToastContainer} from 'react-toastify';
import {getAuthToken} from '../../utils/tokenAuth.js';
import {deleteById} from '../../utils/crudHelper.js';
import Navigation from '../navigation/Navigation.jsx';
import TaskPreview from "../tasks/TaskPreview.jsx";
import TaskModal from "../tasks/TaskModal.jsx";
import TaskDetailDialog from "../tasks/TaskDetailDialog.jsx";
import { useParams } from 'react-router-dom';

const ProjectWhole = () => {
    const [tasks, setTasks] = useState([]);
    const [project, setProject] = useState({name: ''});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({open: false, task: null});
    const [selectedTaskDetail, setSelectedTaskDetail] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortValue, setSortValue] = useState('timeAsc');
    const [filterValue, setFilterValue] = useState('all');

    const { id: projectId } = useParams();

    const sortOptions = [
        {value: 'timeAsc', label: 'Time Estimate Ascending'},
        {value: 'timeDesc', label: 'Time Estimate Descending'},
    ];

    const filterOptions = [
        {value: 'all', label: 'All Tasks'},
        {value: 'status:TO PLAN', label: 'To Plan'},
        {value: 'status:TO DO', label: 'To Do'},
        {value: 'status:IN PROGRESS', label: 'In Progress'},
        {value: 'status:CANCELLED', label: 'Cancelled'},
        {value: 'status:DONE', label: 'Done'},
    ];

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/projects/${projectId}/tasks`, {
                headers: {'Authorization': `Bearer ${getAuthToken()}`},
            });
            if (!res.ok) throw new Error('Fetch failed');
            const data = await res.json();
            setTasks(Array.isArray(data) ? data : data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    const fetchProject = useCallback(async () => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/projects/${projectId}`, {
                method: 'GET',
                headers: {'Authorization': `Bearer ${getAuthToken()}`},
            });
            if (!res.ok) throw new Error('Failed to fetch project');
            const data = await res.json();
            setProject(data.data);
        } catch (err) {
            toast.error(`Error loading project: ${err.message}`);
        }
    }, [projectId]);

    useEffect(() => {
        fetchProject();
        fetchTasks();
    }, [fetchProject, fetchTasks]);

    const handleSearch = term => setSearchTerm(term);
    const handleSort = value => setSortValue(value);
    const handleFilter = value => setFilterValue(value);

    const handleDelete = async id => {
        try {
            await deleteById('tasks', id);
            toast.success('Task was deleted 🚀');
            fetchTasks();
        } catch (e) {
            toast.error(`Failed to delete: ${e.message}`);
        }
    };

    const handleShowDetail = detailData => setSelectedTaskDetail(detailData);

    let filteredTasks = tasks.filter(task =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterValue.startsWith('status:')) {
        const statusValue = filterValue.split(':')[1];
        filteredTasks = filteredTasks.filter(
            task => task.status.toLowerCase() === statusValue.toLowerCase()
        );
    }

    if (sortValue === 'timeAsc') {
        filteredTasks = [...filteredTasks].sort((a, b) =>
            new Date(a.timeEst) - new Date(b.timeEst)
        );
    } else if (sortValue === 'timeDesc') {
        filteredTasks = [...filteredTasks].sort((a, b) =>
            new Date(b.timeEst) - new Date(a.timeEst)
        );
    }

    return (
        <div className="w-screen h-screen flex bg-gray-100">
            <ToastContainer position="bottom-right" autoClose={1500}/>
            <div className="flex-1 flex flex-col">
                <Navigation
                    currentPage={'Project Tasks'}
                    onCreate={() => setModal({open: true, task: null})}
                    onSearch={handleSearch}
                    onSort={handleSort}
                    onFilter={handleFilter}
                    sortOptions={sortOptions}
                    filterOptions={filterOptions}
                    filterName={'Status'}
                />
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">{project.name}</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {loading && <p>Loading tasks…</p>}
                        {!loading && filteredTasks.map(t => (
                            <TaskPreview
                                key={t.id}
                                id={t.id}
                                name={t.name}
                                status={t.status}
                                timeEst={t.timeEst}
                                onEdit={() => setModal({open: true, task: t})}
                                onDelete={() => handleDelete(t.id)}
                                onShow={handleShowDetail}
                            />
                        ))}
                        {!loading && filteredTasks.length === 0 && (
                            <p className="col-span-3 text-center">No tasks found.</p>
                        )}
                    </div>
                </div>
                <TaskModal
                    isOpen={modal.open}
                    task={modal.task}
                    onClose={() => setModal({open: false, task: null})}
                    onTaskSaved={() => {
                        setModal({open: false, task: null});
                        fetchTasks();
                    }}
                    url={`http://127.0.0.1:8000/api/projects/${projectId}/attachTask`}
                />
                {selectedTaskDetail && (
                    <TaskDetailDialog
                        task={selectedTaskDetail}
                        onClose={() => setSelectedTaskDetail(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default ProjectWhole;
