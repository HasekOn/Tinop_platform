import React from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {clearAuthData} from "../../utils/tokenAuth.js";

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        clearAuthData();
        navigate('/login');

        window.location.reload();
    };

    const menuItems = [
        "Tasks",
        "Projects",
        "Time sheet",
        "Ideas",
    ];

    return (
        <div className="bg-gray-800 text-white w-64 min-h-screen flex flex-col p-6">
            <a className="text-2xl font-bold mb-8" href={'/tasks'}>TinopPlatform</a>
            <nav>
                <ul>
                    {menuItems.map((item, index) => {
                        const path = `/${item.toLowerCase().replace(/\s/g, "")}`;
                        return (
                            <li key={index}>
                                <NavLink
                                    to={path}
                                    className={({isActive}) =>
                                        `block mb-4 p-2 rounded cursor-pointer hover:bg-gray-700 ${
                                            isActive ? "bg-blue-600" : ""
                                        }`
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
        </div>
    );
};

export default Sidebar;
