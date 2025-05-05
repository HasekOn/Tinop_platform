import React, {useCallback, useEffect, useState} from 'react';
import Sidebar from "../navigation/Sidebar.jsx";
import Topbar from "../navigation/Topbar.jsx";
import {getAuthToken} from "../../utils/tokenAuth.js";
import {toast, ToastContainer} from 'react-toastify';
import {deleteById} from "../../utils/crudHelper.js";
import IdeaModal from './IdeaModal.jsx';
import IdeaPreview from './IdeaPreview.jsx';
import IdeaDetailDialog from './IdeaDetailDialog.jsx';

const Ideas = () => {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({open: false, idea: null});
    const [selectedIdeaDetail, setSelectedIdeaDetail] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortValue, setSortValue] = useState("likesAsc");
    const [filterValue, setFilterValue] = useState("all");

    const sortOptions = [
        {value: "likesAsc", label: "Likes Ascending"},
        {value: "likesDesc", label: "Likes Descending"},
        {value: "dislikesAsc", label: "Dislikes Ascending"},
        {value: "dislikesDesc", label: "Dislikes Descending"},
        {value: "bestDiff", label: "Best Average"}
    ];

    const filterOptions = [
        {value: "all", label: "All Ideas"},
        {value: "my", label: "Created by me"},
    ];

    const fetchIdeas = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/api/ideas', {
                headers: {'Authorization': `Bearer ${getAuthToken()}`},
            });
            if (!res.ok) throw new Error('Fetch failed');
            const data = await res.json();
            setIdeas(Array.isArray(data) ? data : data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchIdeas();
    }, [fetchIdeas]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleSort = (value) => {
        setSortValue(value);
    };

    const handleFilter = (value) => {
        setFilterValue(value);
    };

    const handleDelete = async (id) => {
        try {
            await deleteById('ideas', id);
            toast.success('Idea was deleted 🚀');
            fetchIdeas();
        } catch (e) {
            toast.error(`Failed to delete: ${e.message}`);
        }
    };

    const handleShowDetail = (ideaData) => {
        setSelectedIdeaDetail(ideaData);
    };

    let filteredIdeas = ideas.filter((idea) =>
        idea.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (idea.description && idea.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (filterValue === "my") {
        filteredIdeas = filteredIdeas.filter((idea) => idea.is_user_owner === true);
    }

    if (filterValue.startsWith("category:")) {
        const category = filterValue.split(":")[1];
        filteredIdeas = filteredIdeas.filter(
            (idea) => idea.category && idea.category.toLowerCase() === category.toLowerCase()
        );
    }

    if (sortValue === "likesAsc") {
        filteredIdeas = [...filteredIdeas].sort((a, b) => a.likes - b.likes);
    } else if (sortValue === "likesDesc") {
        filteredIdeas = [...filteredIdeas].sort((a, b) => b.likes - a.likes);
    } else if (sortValue === "dislikesDesc") {
        filteredIdeas = [...filteredIdeas].sort((a, b) => b.dislikes - a.dislikes);
    } else if (sortValue === "dislikesAsc") {
        filteredIdeas = [...filteredIdeas].sort((a, b) => a.dislikes - b.dislikes);
    } else if (sortValue === "bestDiff") {
        filteredIdeas = [...filteredIdeas].sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes));
    }

    return (
        <div className="w-screen h-screen flex">
            <ToastContainer position="bottom-right" autoClose={1500}/>
            <Sidebar/>
            <div className="flex-1 flex flex-col">
                <Topbar
                    currentPage="ideas"
                    onCreate={() => setModal({open: true, idea: null})}
                    onSearch={handleSearch}
                    onSort={handleSort}
                    onFilter={handleFilter}
                    sortOptions={sortOptions}
                    filterOptions={filterOptions}
                    filterName="Filter"
                />

                <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
                    {loading && <p>Loading…</p>}
                    {!loading && filteredIdeas.length === 0 && (
                        <p className="text-center">No ideas found.</p>
                    )}
                    <div className="grid grid-cols-3 gap-4">
                        {filteredIdeas.map((idea) => (
                            <div key={idea.id}>
                                <IdeaPreview
                                    id={idea.id}
                                    name={idea.name}
                                    description={idea.description}
                                    likes={idea.likes}
                                    dislikes={idea.dislikes}
                                    onEdit={() => setModal({open: true, idea})}
                                    onDelete={() => handleDelete(idea.id)}
                                    onShow={() => handleShowDetail(idea)}
                                    is_user_owner={idea.is_user_owner}
                                />
                            </div>
                        ))}
                    </div>
                </main>

                <IdeaModal
                    isOpen={modal.open}
                    idea={modal.idea}
                    onClose={() => setModal({open: false, idea: null})}
                    onIdeaSaved={() => {
                        setModal({open: false, idea: null});
                        fetchIdeas();
                    }}
                />

                {selectedIdeaDetail && (
                    <IdeaDetailDialog
                        idea={selectedIdeaDetail}
                        onClose={() => setSelectedIdeaDetail(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default Ideas;
