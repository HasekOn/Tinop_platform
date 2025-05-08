import React, {useState} from 'react';

const EditCommentDialog = ({initialComment, onConfirm, onCancel}) => {
    const [editedComment, setEditedComment] = useState(initialComment);

    const handleConfirm = () => {
        if (editedComment.trim() === '') return;
        onConfirm(editedComment);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-gray-800 opacity-50"></div>

            <div className="bg-white rounded shadow-lg z-10 p-6 w-full max-w-md h-64 mx-auto flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Edit comment</h3>
                <textarea
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 flex-grow"
                    rows="3"
                />
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                        Zrušit
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Uložit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCommentDialog;
