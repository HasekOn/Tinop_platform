import React, { useEffect, useState } from 'react';
import { getAuthToken, getCurrentUser } from "../../utils/tokenAuth.js";
import { toast } from 'react-toastify';
import { updateById } from '../../utils/crudHelper.js';

const TaskModal = ({
                       isOpen,
                       onClose,
                       onTaskSaved,
                       task
                   }) => {
    const [formData, setFormData] = useState({
        user_id: getCurrentUser().id,
        name: '',
        status: 'TO PLAN',
        effort: 'EASY',
        priority: 'MEDIUM',
        timeEst: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            if (task && task.id) {
                setFormData({
                    user_id: task.user_id,
                    name: task.name,
                    status: task.status,
                    effort: task.effort,
                    priority: task.priority,
                    timeEst: task.timeEst,
                    description: task.description
                });
            } else {
                setFormData(f => ({
                    ...f,
                    user_id: getCurrentUser().id,
                    name: '',
                    status: 'TO PLAN',
                    effort: 'EASY',
                    priority: 'MEDIUM',
                    timeEst: '',
                    description: ''
                }));
            }
            setError(null);
        }
    }, [isOpen, task]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (task && task.id) {
                // UPDATE
                await updateById('tasks', task.id, formData, 'PATCH');
                toast.success('Task was updated 🎉');
            } else {
                // CREATE
                const response = await fetch('http://127.0.0.1:8000/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || 'Chyba při vytváření úkolu');
                }
                toast.success('Task was created 🎉');
            }

            onClose();
            onTaskSaved();
        } catch (err) {
            setError(err.message);
            toast.error(`Chyba: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-lg bg-black bg-opacity-30 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-xl min-h-[70vh] flex flex-col">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    {task && task.id ? 'Edit Task' : 'Create New Task'}
                </h2>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        {/* Task Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Task Name *
                            </label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded border-gray-300 text-gray-800 shadow-sm p-2 focus:ring-2 focus:ring-blue-400"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Status *
                            </label>
                            <select
                                className="mt-1 block w-full rounded border-gray-300 text-gray-800 shadow-sm p-2 focus:ring-2 focus:ring-blue-400"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                                required
                            >
                                {['TO PLAN', 'TO DO', 'IN PROGRESS', 'CANCELLED', 'DONE'].map(o => (
                                    <option key={o} value={o}>{o}</option>
                                ))}
                            </select>
                        </div>

                        {/* Effort */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Effort
                            </label>
                            <select
                                className="mt-1 block w-full rounded border-gray-300 text-gray-800 shadow-sm p-2 focus:ring-2 focus:ring-blue-400"
                                value={formData.effort}
                                onChange={e => setFormData({ ...formData, effort: e.target.value })}
                            >
                                {['EASY', 'MEDIUM', 'HARD'].map(o => (
                                    <option key={o} value={o}>{o}</option>
                                ))}
                            </select>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Priority
                            </label>
                            <select
                                className="mt-1 block w-full rounded border-gray-300 text-gray-800 shadow-sm p-2 focus:ring-2 focus:ring-blue-400"
                                value={formData.priority}
                                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                            >
                                {['LOW', 'MEDIUM', 'HIGH'].map(o => (
                                    <option key={o} value={o}>{o}</option>
                                ))}
                            </select>
                        </div>

                        {/* Time Estimate */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Time Estimate
                            </label>
                            <input
                                type="date"
                                className="mt-1 block w-full rounded border-gray-300 text-gray-800 shadow-sm p-2 focus:ring-2 focus:ring-blue-400"
                                value={formData.timeEst}
                                onChange={e => setFormData({ ...formData, timeEst: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                className="mt-1 block w-full rounded border-gray-300 text-gray-800 shadow-sm p-2 focus:ring-2 focus:ring-blue-400"
                                rows="3"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
                        >
                            {loading
                                ? (task && task.id ? 'Updating…' : 'Creating…')
                                : (task && task.id ? 'Update Task' : 'Create Task')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
