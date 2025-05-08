import React from 'react';

const ConfirmationDialog = ({message, onConfirm, onCancel}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-gray-800 opacity-50"></div>

            <div
                className="bg-white rounded shadow-lg z-10 p-6 w-full max-w-md h-35 mx-auto flex flex-col justify-center">
                <p className="text-gray-800 mb-6">{message}</p>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
