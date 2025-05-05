import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPencilAlt, faTrash} from '@fortawesome/free-solid-svg-icons';

const TaskPreview = ({
                         name = 'Task Title',
                         status = 'Task status',
                         timeEst = 'Time estimate',
                         onEdit = null,
                         onDelete = null
                     }) => {
    const handleDelete = () => {
        if (window.confirm('Are you sure?')) {
            onDelete?.();
        }
    };

    const handleEdit = () => {
        onEdit?.();
    };

    return (
        <div className="bg-gray-200 rounded-lg p-4 flex flex-col justify-between relative">
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
    );
};

export default TaskPreview;
