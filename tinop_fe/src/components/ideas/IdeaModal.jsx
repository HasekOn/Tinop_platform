import React, {useEffect, useState} from 'react';
import {getAuthToken, getCurrentUser} from "../../utils/tokenAuth.js";
import {toast} from 'react-toastify';
import {updateById} from '../../utils/crudHelper.js';

const IdeaModal = ({isOpen, onClose, onIdeaSaved, idea}) => {
    const [formData, setFormData] = useState({
        user_id: getCurrentUser().id,
        name: '',
        likes: 0,
        dislikes: 0,
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            if (idea && idea.id) {
                setFormData({
                    user_id: idea.user_id,
                    name: idea.name,
                    likes: idea.likes ?? 0,
                    dislikes: idea.dislikes ?? 0,
                    description: idea.description ?? ''
                });
            } else {
                setFormData({
                    user_id: getCurrentUser().id,
                    name: '',
                    likes: 0,
                    dislikes: 0,
                    description: ''
                });
            }
            setError(null);
        }
    }, [isOpen, idea]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (idea && idea.id) {
                await updateById('ideas', idea.id, formData, 'PATCH');
                toast.success('Idea was updated 🎉');
            } else {
                const response = await fetch('http://127.0.0.1:8000/api/ideas', {
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
                    throw new Error(errData.message || 'Chyba při vytváření nápadu');
                }
                toast.success('Idea was created 🎉');
            }
            onClose();
            onIdeaSaved();
        } catch (err) {
            setError(err.message);
            toast.error(`Chyba: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-brightness-50 backdrop-blur-lg flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-xl min-h-[70vh] flex flex-col">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    {idea && idea.id ? 'Update Idea' : 'Create new Idea'}
                </h2>
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        {/* Jméno nápadu */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Idea name *
                            </label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded border-gray-300 text-gray-800 shadow-sm p-2 focus:ring-2 focus:ring-blue-400"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>

                        {/* Popis */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                className="mt-1 block w-full rounded border-gray-300 text-gray-800 shadow-sm p-2 focus:ring-2 focus:ring-blue-400"
                                rows="3"
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
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
                                ? (idea && idea.id ? 'Updating…' : 'Creating…')
                                : (idea && idea.id ? 'Update Idea' : 'Create Idea')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default IdeaModal;
