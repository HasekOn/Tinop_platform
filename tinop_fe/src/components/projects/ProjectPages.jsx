import React, { useEffect, useState } from 'react';
import Sidebar from "../navigation/Sidebar.jsx";
import Topbar from "../navigation/Topbar.jsx";

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = '1|2aL3epMnACdUnbk6sGvuo656qypEVseLyXHyFutxbdf299fa';
                const response = await fetch('http://127.0.0.1:8000/api/projects', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                // Ujistíme se, že pracujeme s polem
                const projectsArray = Array.isArray(data)
                    ? data
                    : Array.isArray(data.data)
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
    }, []);

    if (loading) return <div className="p-4 text-black">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.isArray(projects) && projects.length > 0 ? (
                projects.map((project, index) => (
                    <div
                        key={index}
                        className="bg-white shadow rounded p-4 flex flex-col justify-between"
                    >
                        <h2 className="font-bold mb-2 text-black">
                            {project.name || 'Project Title'}
                        </h2>
                        <p className="text-sm text-black">
                            {project.description || 'Project description here...'}
                        </p>
                    </div>
                ))
            ) : (
                <div className="p-4 text-gray-600">No projects available</div>
            )}
        </div>
    );
};

const Projects = () => {
    return (
        <div className="w-screen h-screen flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 overflow-y-auto bg-gray-100">
                    <ProjectList />
                </main>
            </div>
        </div>
    );
};

export default Projects;
