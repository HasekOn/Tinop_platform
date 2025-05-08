import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPencilAlt, faTrash, faUser} from '@fortawesome/free-solid-svg-icons';
import {Link} from "react-router-dom";

const ProjectPreview = ({project, onDelete, onEdit, onInvite}) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <Link to={`/projects/${project.id}`}
              className="cursor-pointer hover:ring-1 hover:ring-blue-500 transition duration-200 bg-white shadow rounded p-4 flex flex-col justify-between relative">
            <div>
                <h2 className="font-bold mb-2 text-black">
                    {project.name || 'Project Title'}
                </h2>
                <p className="text-sm text-black">
                    {project.description || 'Project description here...'}
                </p>
            </div>
            {project.is_owner && (
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteDialog(true);
                        }}
                        title="Delete Project"
                    >
                        <FontAwesomeIcon icon={faTrash} className="text-red-500 hover:text-red-700"/>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(project);
                        }}
                        title="Edit Project"
                    >
                        <FontAwesomeIcon icon={faPencilAlt} className="text-blue-500 hover:text-blue-700"/>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onInvite(project);
                        }}
                        title="Invite Users"
                    >
                        <FontAwesomeIcon icon={faUser} className="text-green-500 hover:text-green-700"/>
                    </button>
                </div>
            )}
            {showDeleteDialog && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div
                        className="absolute inset-0 bg-gray-800 opacity-50"
                        onClick={() => setShowDeleteDialog(false)}
                    ></div>
                    <div
                        className="bg-white rounded shadow-lg z-10 p-6 w-full max-w-md mx-auto flex flex-col justify-center">
                        <p className="text-gray-800 mb-6">
                            Are you sure you want to delete this project?
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteDialog(false);
                                }}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteDialog(false);
                                    onDelete(project.id);
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Link>
    )
        ;
};

export default ProjectPreview;
