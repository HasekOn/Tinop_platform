import React, {useCallback, useEffect, useState} from 'react';
import TaskModal from './TaskModal.jsx';
import TaskPreview from './TaskPreview.jsx';
import TaskDetailDialog from './TaskDetailDialog.jsx';
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
    const [selectedTaskDetail, setSelectedTaskDetail] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortValue, setSortValue] = useState("timeAsc");    // výchozí řazení
    const [filterValue, setFilterValue] = useState("all");      // výchozí filtr

    const sortOptions = [
        {value: "timeAsc", label: "Time Estimate Ascending"},
        {value: "timeDesc", label: "Time Estimate Descending"},
    ];

    const filterOptions = [
        {value: "all", label: "All Tasks"},
        {value: "status:TO PLAN", label: "To Plan"},
        {value: "status:TO DO", label: "To Do"},
        {value: "status:IN PROGRESS", label: "In Progress"},
        {value: "status:CANCELLED", label: "Cancelled"},
        {value: "status:DONE", label: "Done"},
    ];

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/api/tasks', {
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
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleSort = (value) => {
        setSortValue(value);
    };

    const handleFilter = (value) => {
        setFilterValue(value);
    };

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

    let filteredTasks = tasks.filter(task =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterValue.startsWith("status:")) {
        const statusValue = filterValue.split(":")[1];
        filteredTasks = filteredTasks.filter(task =>
            task.status.toLowerCase() === statusValue.toLowerCase()
        );
    }

    if (sortValue === "timeAsc") {
        filteredTasks = [...filteredTasks].sort((a, b) =>
            new Date(a.timeEst) - new Date(b.timeEst)
        );
    } else if (sortValue === "timeDesc") {
        filteredTasks = [...filteredTasks].sort((a, b) =>
            new Date(b.timeEst) - new Date(a.timeEst)
        );
    }

    return (
        <div className="w-screen h-screen flex">
            <ToastContainer position="bottom-right" autoClose={1500}/>
            <Sidebar/>
            <div className="flex-1 flex flex-col">
                <Topbar
                    currentPage={'tasks'}
                    onCreate={() => setModal({open: true, task: null})}
                    onSearch={handleSearch}
                    onSort={handleSort}
                    onFilter={handleFilter}
                    sortOptions={sortOptions}
                    filterOptions={filterOptions}
                    filterName={'Status'}
                />

                <div className="p-4 grid grid-cols-3 gap-4">
                    {loading && <p>Loading…</p>}
                    {!loading && filteredTasks.map(t => (
                        <div key={t.id}>
                            <TaskPreview
                                id={t.id}
                                name={t.name}
                                status={t.status}
                                timeEst={t.timeEst}
                                onEdit={() => setModal({open: true, task: t})}
                                onDelete={() => handleDelete(t.id)}
                                onShow={handleShowDetail}
                            />
                        </div>
                    ))}
                    {!loading && filteredTasks.length === 0 && (
                        <p className="col-span-3 text-center">No tasks found.</p>
                    )}
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

export default Tasks;
