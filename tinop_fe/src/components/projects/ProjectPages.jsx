import React, {useEffect, useState} from 'react';
import Navigation from '../navigation/Navigation.jsx';
import ProjectModal from './ProjectModal.jsx';
import ProjectPreview from './ProjectPreview.jsx';
import ProjectInvitation from './ProjectInvitation.jsx';
import {getAuthToken} from '../../utils/tokenAuth.js';
import {toast, ToastContainer} from 'react-toastify';
import {deleteById} from '../../utils/crudHelper.js';

const ProjectList = ({refreshKey, onDelete, onEdit, onInvite}) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/projects', {
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`,
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Error fetching projects');
                }
                const data = await response.json();
                const projectsArray = Array.isArray(data)
                    ? data
                    : data.data
                        ? data.data
                        : [];
                setProjects(projectsArray);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [refreshKey]);

    if (loading) return <div className="p-4 text-black">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects && projects.length > 0 ? (
                projects.map((project) => (
                    <ProjectPreview
                        key={project.id}
                        project={project}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onInvite={onInvite}
                    />
                ))
            ) : (
                <div className="p-4 text-gray-600">No projects available</div>
            )}
        </div>
    );
};

const ProjectPages = () => {
    const [modal, setModal] = useState({open: false, project: null});
    const [invitationModal, setInvitationModal] = useState({open: false, project: null});
    const [refreshKey, setRefreshKey] = useState(0);

    const handleProjectSaved = (savedProject) => {
        setModal({open: false, project: null});
        setRefreshKey((prev) => prev + 1);
    };

    const handleDeleteProject = async (projectId) => {
        try {
            await deleteById('projects', projectId);
            toast.success("Project deleted successfully");
            setRefreshKey((prev) => prev + 1);
        } catch (err) {
            toast.error("Error deleting project: " + err.message);
        }
    };

    const handleEditProject = (project) => {
        setModal({open: true, project});
    };

    const handleInviteProject = (project) => {
        setInvitationModal({open: true, project});
    };

    return (
        <div className="w-screen h-screen flex flex-col">
            <ToastContainer position="bottom-right" autoClose={1500}/>
            <Navigation
                currentPage="projects"
                onCreate={() => setModal({open: true, project: null})}
            />
            <main className="flex-1 overflow-y-auto bg-gray-100">
                <ProjectList
                    refreshKey={refreshKey}
                    onDelete={handleDeleteProject}
                    onEdit={handleEditProject}
                    onInvite={handleInviteProject}
                />
            </main>
            {modal.open && (
                <ProjectModal
                    isOpen={modal.open}
                    project={modal.project}
                    onClose={() => setModal({open: false, project: null})}
                    onProjectSaved={handleProjectSaved}
                />
            )}
            {invitationModal.open && (
                <ProjectInvitation
                    isOpen={invitationModal.open}
                    project={invitationModal.project}
                    onClose={() => setInvitationModal({open: false, project: null})}
                />
            )}
        </div>
    );
};

export default ProjectPages;
