import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPencilAlt, faTrash} from '@fortawesome/free-solid-svg-icons';
import {getAuthToken} from '../../utils/tokenAuth.js';

const TaskPreview = ({
                         id,
                         name = 'Task Title',
                         status = 'Task status',
                         timeEst = 'Time estimate',
                         onEdit = null,
                         onDelete = null,
                         onShow = null,
                     }) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDelete = (e) => {
        e.stopPropagation();
        setShowDeleteDialog(true);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit?.();
    };

    const handleShow = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/tasks/${id}`, {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Accept': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Error fetching task details');
            }
            const detailData = await response.json();
            if (onShow) {
                onShow(detailData);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <div
                onClick={handleShow}
                className="bg-white rounded-lg p-4 shadow flex flex-col justify-between relative cursor-pointer hover:shadow-lg transition-shadow w-full max-w-md h-40 mx-auto"
            >
                <div>
                    <h2 className="font-bold text-black mb-1">{name}</h2>
                    <p className="text-black text-sm">{status}</p>
                    <p className="text-black text-sm">{timeEst}</p>
                </div>
                <div className="flex space-x-3 mt-4 justify-end">
                    {onEdit && (
                        <button
                            onClick={handleEdit}
                            className="p-2 hover:bg-gray-300 text-blue-500 rounded"
                            aria-label="Edit Task"
                        >
                            <FontAwesomeIcon icon={faPencilAlt}/>
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={handleDelete}
                            className="p-2 hover:bg-gray-300 rounded text-red-600"
                            aria-label="Delete Task"
                        >
                            <FontAwesomeIcon icon={faTrash}/>
                        </button>
                    )}
                </div>
            </div>

            {showDeleteDialog && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
                    <div
                        className="bg-white rounded shadow-lg z-10 p-6 w-full max-w-md h-35 mx-auto flex flex-col justify-center">
                        <p className="text-gray-800 mb-6">Are you sure?</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowDeleteDialog(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteDialog(false);
                                    onDelete?.();
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TaskPreview;
