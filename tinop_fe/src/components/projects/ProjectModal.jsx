import React, {useEffect, useState} from 'react';
import {getAuthToken, getCurrentUser} from '../../utils/tokenAuth.js';
import {toast} from 'react-toastify';
import {updateById} from '../../utils/crudHelper.js';

const ProjectModal = ({isOpen, project, onClose, onProjectSaved}) => {
    const [formData, setFormData] = useState({
        creator_id: getCurrentUser().id,
        name: '',
        description: '',
        effort: 'MEDIUM',
        timeEst: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            if (project && project.id) {
                setFormData({
                    creator_id: project.creator_id,
                    name: project.name || '',
                    description: project.description || '',
                    effort: project.effort || 'MEDIUM',
                    timeEst: project.timeEst || ''
                });
            } else {
                setFormData({
                    creator_id: getCurrentUser().id,
                    name: '',
                    description: '',
                    effort: 'MEDIUM',
                    timeEst: ''
                });
            }
            setError(null);
        }
    }, [isOpen, project]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const isEditing = project && project.id;
        const endpoint = 'projects';
        const newRecord = {
            creator_id: formData.creator_id,
            name: formData.name,
            description: formData.description,
            effort: formData.effort,
            timeEst: formData.timeEst
        };

        try {
            let savedProject;
            if (isEditing) {
                savedProject = await updateById(endpoint, project.id, newRecord, 'PATCH');
                toast.success('Project updated successfully');
            } else {
                const response = await fetch(`http://127.0.0.1:8000/api/${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(newRecord)
                });
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || 'Error creating project');
                }
                savedProject = await response.json();
                toast.success('Project created successfully');
            }
            onProjectSaved(savedProject);
            onClose();
        } catch (err) {
            setError(err.message);
            toast.error(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 backdrop-brightness-50 backdrop-blur-lg flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto shadow-xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    {project && project.id ? 'Edit Project' : 'Create New Project'}
                </h2>
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
                    {/* Project Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Project Name *</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full rounded border-gray-300 text-gray-800 shadow-sm p-2 focus:ring-2 focus:ring-blue-400"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            className="mt-1 block w-full rounded border-gray-300 text-gray-800 shadow-sm p-2 focus:ring-2 focus:ring-blue-400"
                            rows="3"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                    </div>
                    {/* Effort */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Effort</label>
                        <select
                            className="mt-1 block w-full rounded border-gray-300 text-gray-800 shadow-sm p-2 focus:ring-2 focus:ring-blue-400"
                            value={formData.effort}
                            onChange={(e) => setFormData({...formData, effort: e.target.value})}
                        >
                            {['EASY', 'MEDIUM', 'HARD'].map((o) => (
                                <option key={o} value={o}>
                                    {o}
                                </option>
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
                            onChange={e => setFormData({...formData, timeEst: e.target.value})}
                            min={new Date().toISOString().split('T')[0]}
                        />
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
                                ? project && project.id
                                    ? 'Updating…'
                                    : 'Creating…'
                                : project && project.id
                                    ? 'Update Project'
                                    : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectModal;
