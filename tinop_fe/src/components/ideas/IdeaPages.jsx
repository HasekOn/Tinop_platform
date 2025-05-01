import React, { useEffect, useState } from 'react';
import Sidebar from "../navigation/Sidebar.jsx";
import Topbar from "../navigation/Topbar.jsx";

const IdeaList = () => {
    const [ideas, setIdeas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                const token = '1|2aL3epMnACdUnbk6sGvuo656qypEVseLyXHyFutxbdf299fa';
                const response = await fetch('http://127.0.0.1:8000/api/ideas', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log("Fetched ideas:", data);

                // Nastavíme data přímo – očekáváme, že struktura obsahuje { data, meta }
                setIdeas(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchIdeas();
    }, []);

    if (loading) return <div className="p-4 text-black">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4 text-black">Ideas:</h2>
            <ul className="space-y-4">
                {ideas && ideas.data && ideas.data.length > 0 ? (
                    ideas.data.map((idea) => (
                        <li key={idea.id} className="idea-card bg-white shadow rounded p-4">
                            <div className="idea-content">
                                <h3 className="text-xl font-bold">{idea.name}</h3>
                                <p className="text-gray-700">{idea.description}</p>
                            </div>
                            <div className="idea-actions mt-2 flex space-x-2">
                                <button className="like-button bg-green-100 rounded px-2 py-1">
                                    👍 {idea.likes}
                                </button>
                                <button className="dislike-button bg-red-100 rounded px-2 py-1">
                                    👎 {idea.dislikes}
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="p-4 text-gray-600">No ideas available</li>
                )}
            </ul>

            {ideas && ideas.meta && (
                <div className="pagination mt-4 text-gray-600">
                    Page: {ideas.meta.current_page} / {ideas.meta.last_page}
                </div>
            )}
        </div>
    );
};

const Ideas = () => {
    return (
        <div className="w-screen h-screen flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 overflow-y-auto bg-gray-100">
                    <IdeaList />
                </main>
            </div>
        </div>
    );
};

export default Ideas;
