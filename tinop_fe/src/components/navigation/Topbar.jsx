import React from "react";

const Topbar = () => {
    return (
        <div className="flex justify-between items-center bg-white p-4 shadow">
            <input
                type="text"
                placeholder="Search for a task"
                className="border p-2 rounded w-full max-w-xs text-black"
            />
            <div className="ml-4">
                <img
                    src="/path-to-profile-picture.jpg" //user profile image XX jinak inicialy
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                />
            </div>
        </div>
    );
};

export default Topbar;