import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearAuthData } from "../../utils/tokenAuth.js";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        clearAuthData();
        navigate('/login');
        window.location.reload();
    };

    const menuItems = ["Tasks", "Projects", "Time sheet", "Ideas"];

    return (
        <div className={`bg-gray-800 text-white w-64 h-full p-6 pt-20 fixed top-0 left-0 z-30 transition-transform transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <a className="text-2xl font-bold mb-8 block" href={'/tasks'}>TinopPlatform</a>
            <nav>
                <ul>
                    {menuItems.map((item, index) => {
                        const path = `/${item.toLowerCase().replace(/\s/g, "")}`;
                        return (
                            <li key={index}>
                                <NavLink
                                    to={path}
                                    className={({ isActive }) =>
                                        `block mb-4 p-2 rounded cursor-pointer hover:bg-gray-700 ${isActive ? "bg-blue-600" : ""}`
                                    }
                                >
                                    {item}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className="mt-auto">
                <button
                    onClick={handleLogout}
                    className="w-full py-2 bg-red-500 rounded hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>
            <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 px-5 bg-red-500 rounded absolute top-2 left-2 hover:bg-red-600 transition"
            >
                X
            </button>
        </div>
    );
};

export default Sidebar;
