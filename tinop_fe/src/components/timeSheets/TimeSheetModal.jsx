import React, { useEffect, useState } from 'react';
import { getAuthToken, getCurrentUser } from '../../utils/tokenAuth.js';
import { toast } from 'react-toastify';

const TimeSheetModal = ({ isOpen, timeSheet, onClose, onTimeSheetSaved }) => {
    const [date, setDate] = useState('');
    const [availability, setAvailability] = useState('office');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            console.log(timeSheet);
            if (timeSheet && timeSheet.id) {
                setDate(timeSheet.date || '');
                setAvailability(timeSheet.availability || 'office');
                setDescription(timeSheet.description || '');
            } else {
                setDate('');
                setAvailability('office');
                setDescription('');
            }
            setError(null);
        }
    }, [isOpen, timeSheet]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentUser = getCurrentUser();
        const newRecord = {
            date,
            status: availability,
            notes: description,
            user_id: currentUser?.id
        };

        const isEditing = timeSheet && timeSheet.id;

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/user_availabilities${isEditing ? `/${timeSheet.id}` : ''}`,
                {
                    method: isEditing ? 'PATCH' : 'POST',
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(newRecord)
                }
            );

            if (!response.ok) {
                throw new Error('Failed to save timesheet');
            }

            const data = await response.json();
            if (isEditing) {
                toast.success("TimeSheet updated successfully");
            } else {
                toast.success("TimeSheet created successfully");
            }
            onTimeSheetSaved(data);
        } catch (error) {
            toast.error("Error saving timesheet");
        } finally {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-gray-800 opacity-50" onClick={onClose}></div>
            <div className="bg-white rounded shadow-lg z-10 p-6 w-full max-w-md mx-auto">
                <h2 className="text-xl font-bold mb-4">
                    {timeSheet && timeSheet.id ? 'Edit TimeSheet' : 'Create TimeSheet'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Availability</label>
                        <select
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value)}
                            className="w-full border p-2 rounded"
                        >
                            <option value="office">Office</option>
                            <option value="remote">Remote</option>
                            <option value="unavailable">Unavailable</option>
                            <option value="vacation">Vacation</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border p-2 rounded"
                            rows="3"
                        ></textarea>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TimeSheetModal;
