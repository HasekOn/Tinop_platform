import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getAuthToken } from '../../utils/tokenAuth.js';

const TaskPreview = ({
                         id,
                         name = 'Task Title',
                         status = 'Task status',
                         timeEst = 'Time estimate',
                         onEdit = null,
                         onDelete = null,
                         onShow = null,
                     }) => {

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure?')) {
            onDelete?.();
        }
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
                    'Accept': 'application/json'
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
        <div
            onClick={handleShow}
            className="bg-white rounded-lg p-4 shadow flex flex-col justify-between relative cursor-pointer hover:shadow-lg transition-shadow"
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
                        className="p-2 hover:bg-gray-300 rounded"
                        aria-label="Edit Task"
                    >
                        <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={handleDelete}
                        className="p-2 hover:bg-gray-300 rounded text-red-600"
                        aria-label="Delete Task"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskPreview;
