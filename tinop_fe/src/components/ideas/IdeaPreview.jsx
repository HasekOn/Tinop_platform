import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getCurrentUser } from '../../utils/tokenAuth.js';
import ConfirmationDialog from "../helpers/ConfirmationDialog .jsx";

const IdeaPreview = ({ id, name, description, likes, dislikes, onEdit, onDelete, onShow, is_user_owner }) => {
    const currentUser = getCurrentUser();
    const canEdit = currentUser && (is_user_owner === true || currentUser.is_admin === 1);
    const [showDialog, setShowDialog] = useState(false);

    const handleDelete = (e) => {
        e.stopPropagation();
        setShowDialog(true);
    };

    const confirmDelete = () => {
        setShowDialog(false);
        onDelete?.();
    };

    const cancelDelete = () => {
        setShowDialog(false);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit?.();
    };

    return (
        <>
            <div
                onClick={onShow}
                className="idea-preview bg-white shadow rounded p-4 cursor-pointer hover:shadow-lg transition-shadow w-full max-w-md h-40 mx-auto"
            >
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800 max-w-xs truncate">{name}</h3>
                    {canEdit && (
                        <div className="flex space-x-3">
                            <button onClick={handleEdit} title="Upravit nápad">
                                <FontAwesomeIcon icon={faPencilAlt} className="text-blue-500 hover:text-blue-700" />
                            </button>
                            <button onClick={handleDelete} title="Smazat nápad">
                                <FontAwesomeIcon icon={faTrash} className="text-red-500 hover:text-red-700" />
                            </button>
                        </div>
                    )}
                </div>
                {description && (
                    <p className="mt-2 text-gray-600 line-clamp-2">{description}</p>
                )}
                <div className="mt-4 flex space-x-4">
                    <div className="flex items-center">
                        <span className="mr-1">👍</span>
                        <span>{likes}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="mr-1">👎</span>
                        <span>{dislikes}</span>
                    </div>
                </div>
            </div>

            {showDialog && (
                <ConfirmationDialog
                    message="Opravdu chcete smazat tento nápad?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </>
    );
};

export default IdeaPreview;
