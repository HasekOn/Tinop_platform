import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPencilAlt, faThumbsDown, faThumbsUp, faTrash} from '@fortawesome/free-solid-svg-icons';
import {getAuthToken, getCurrentUser} from '../../utils/tokenAuth.js';
import ConfirmationDialog from "../helpers/ConfirmationDialog .jsx";

const IdeaPreview = ({id, name, description, likes, dislikes, reaction, onEdit, onDelete, onShow, is_user_owner}) => {
    const currentUser = getCurrentUser();
    const canEdit = currentUser && (is_user_owner === true || currentUser.is_admin === 1);
    const [showDialog, setShowDialog] = useState(false);
    const [currentReaction, setCurrentReaction] = useState(reaction);
    const [likeCount, setLikeCount] = useState(likes);
    const [dislikeCount, setDislikeCount] = useState(dislikes);

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

    const handleReact = async (type) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/ideas/${id}/react`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({reaction: type})
            });

            if (!response.ok) {
                throw new Error("Error reacting to idea");
            }

            setCurrentReaction(type);

            if (type === 'like') {
                setLikeCount(prev => prev + (currentReaction === 'like' ? -1 : 1));
                if (currentReaction === 'dislike') setDislikeCount(prev => prev - 1);
            } else if (type === 'dislike') {
                setDislikeCount(prev => prev + (currentReaction === 'dislike' ? -1 : 1));
                if (currentReaction === 'like') setLikeCount(prev => prev - 1);
            }
        } catch (err) {
            console.error("Error:", err);
        }
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
                            <button onClick={handleEdit} title="Edit idea">
                                <FontAwesomeIcon icon={faPencilAlt} className="text-blue-500 hover:text-blue-700"/>
                            </button>
                            <button onClick={handleDelete} title="Delete idea">
                                <FontAwesomeIcon icon={faTrash} className="text-red-500 hover:text-red-700"/>
                            </button>
                        </div>
                    )}
                </div>
                {description && (
                    <p className="mt-2 text-gray-600 line-clamp-2">{description}</p>
                )}
                <div className="mt-4 flex space-x-4">
                    <button
                        className={`flex items-center px-3 py-1 rounded ${currentReaction === 'like' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-400 text-gray-800'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleReact('like');
                        }}
                    >
                        <FontAwesomeIcon icon={faThumbsUp} className="mr-1"/>
                        <span>{likeCount}</span>
                    </button>
                    <button
                        className={`flex items-center px-3 py-1 rounded ${currentReaction === 'dislike' ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-400 text-gray-800'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleReact('dislike');
                        }}
                    >
                        <FontAwesomeIcon icon={faThumbsDown} className="mr-1"/>
                        <span>{dislikeCount}</span>
                    </button>
                </div>
            </div>

            {showDialog && (
                <ConfirmationDialog
                    message="Do you really want to delete this idea?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </>
    );
};

export default IdeaPreview;
