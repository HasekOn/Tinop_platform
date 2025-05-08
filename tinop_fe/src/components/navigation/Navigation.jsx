import React, {useState} from "react";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

const Navigation = ({
                        currentPage = 'tasks',
                        onCreate,
                        onSearch,
                        onSort,
                        onFilter,
                        sortOptions,
                        filterOptions,
                        filterName
                    }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-max w-full">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            <Topbar
                setIsSidebarOpen={setIsSidebarOpen}
                currentPage={currentPage}
                onSearch={onSearch}
                onSort={onSort}
                onFilter={onFilter}
                sortOptions={sortOptions}
                filterOptions={filterOptions}
                filterName={filterName}
                onCreate={onCreate}
            />
        </div>
    );
};

export default Navigation;
