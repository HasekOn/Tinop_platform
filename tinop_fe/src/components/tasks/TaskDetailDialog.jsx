import React, { useEffect, useState } from 'react';
import { getAuthToken, getCurrentUser } from '../../utils/tokenAuth.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import EditCommentDialog from "../helpers/EditCommentDialog.jsx";
import ConfirmationDialog from "../helpers/ConfirmationDialog .jsx";
import {InitialsAvatar} from "../../utils/InitialsAvatar.jsx";

const TaskDetailDialog = ({ task, onClose }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);
    const [postingComment, setPostingComment] = useState(false);
    const [error, setError] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const [commentToDelete, setCommentToDelete] = useState(null);

    const taskData = task.data;

    const fetchComments = async () => {
        setLoadingComments(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskData.id}/comments`, {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Accept': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Chyba při načítání komentářů');
            }
            const data = await response.json();
            setComments(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingComments(false);
        }
    };

    useEffect(() => {
        if (task && taskData.id) {
            fetchComments();
        }
    }, [task, taskData.id]);

    const handlePostComment = async () => {
        if (newComment.trim() === '') return;
        setPostingComment(true);
        try {
            const currentUser = getCurrentUser();
            const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskData.id}/comments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    content: newComment,
                    commentable_id: taskData.id,
                    commentable_type: 'App\\Models\\Task',
                    user_id: currentUser.id,
                }),
            });
            if (!response.ok) {
                throw new Error('Chyba při odesílání komentáře');
            }
            await response.json();
            fetchComments();
            setNewComment('');
        } catch (err) {
            setError(err.message);
        } finally {
            setPostingComment(false);
        }
    };

    const deleteComment = async (commentId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Accept': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Chyba při mazání komentáře');
            }
            fetchComments();
        } catch (err) {
            setError(err.message);
        }
    };

    const updateComment = async (commentId, updatedContent) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/comments/${commentId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ content: updatedContent }),
            });
            if (!response.ok) {
                throw new Error('Chyba při úpravě komentáře');
            }
            await response.json();
            fetchComments();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-brightness-50 backdrop-blur-lg p-4 z-50">
            <div className="bg-white rounded-lg overflow-y-auto max-h-full w-full max-w-3xl p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
                    &#x2715;
                </button>

                <div className="mb-6 border-b pb-4">
                    <h2 className="text-3xl font-bold text-gray-800">{taskData.name}</h2>
                    <p className="mt-2 text-gray-600">{taskData.description}</p>
                </div>

                <div className="mb-6 border-b pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="font-semibold text-gray-700">Status: </span>
                        <span className="text-gray-600">{taskData.status}</span>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-700">Effort: </span>
                        <span className="text-gray-600">{taskData.effort}</span>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-700">Priority: </span>
                        <span className="text-gray-600">{taskData.priority}</span>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-700">Time Estimate: </span>
                        <span className="text-gray-600">{taskData.timeEst}</span>
                    </div>
                </div>

                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Comments</h3>
                    <div className="space-y-4 mb-4">
                        {loadingComments ? (
                            <p>Loading comments...</p>
                        ) : (
                            comments?.data?.map(comment => (
                                <div
                                    key={comment.id}
                                    className="p-3 border rounded-lg flex justify-between items-start"
                                >
                                    <div className="flex items-start">
                                        <InitialsAvatar name={comment.user?.name}/>
                                        <div className="ml-3 flex flex-col">
                                            <p className="text-gray-700">{comment.content}</p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {comment.user?.name || "Unknown"} –{" "}
                                                {new Date(comment.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    {(comment.user_id === getCurrentUser().id || getCurrentUser().is_admin === 1) && (
                                        <div className="flex flex-col space-y-1 ml-4">
                                            <button onClick={() => setEditingComment(comment)} title="Edit comment">
                                                <FontAwesomeIcon icon={faPencilAlt} className="text-blue-500 hover:text-blue-700" />
                                            </button>
                                            <button onClick={() => setCommentToDelete(comment)} title="Delete comment">
                                                <FontAwesomeIcon icon={faTrash} className="text-red-500 hover:text-red-700" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                        {!loadingComments && comments?.data?.length === 0 && (
                            <p>No comments.</p>
                        )}
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>

                    <div className="flex flex-col">
            <textarea
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                placeholder="Add comment..."
                rows="3"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
            />
                        <button
                            onClick={handlePostComment}
                            disabled={postingComment}
                            className="mt-2 self-end px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            {postingComment ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                </div>
            </div>

            {editingComment && (
                <EditCommentDialog
                    initialComment={editingComment.content}
                    onConfirm={(updatedContent) => {
                        updateComment(editingComment.id, updatedContent);
                        setEditingComment(null);
                    }}
                    onCancel={() => setEditingComment(null)}
                />
            )}

            {commentToDelete && (
                <ConfirmationDialog
                    message="Opravdu chcete smazat tento komentář?"
                    onConfirm={() => {
                        deleteComment(commentToDelete.id);
                        setCommentToDelete(null);
                    }}
                    onCancel={() => setCommentToDelete(null)}
                />
            )}
        </div>
    );
};

export default TaskDetailDialog;
