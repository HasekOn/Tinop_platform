import React from "react";
import {NavLink} from "react-router-dom";

const Sidebar = () => {
    const menuItems = [
        "Tasks",
        "Projects",
        "Time sheet",
        "Ideas",
    ];

    return (
        <div className="bg-gray-800 text-white w-64 min-h-screen flex flex-col p-6">
            <h1 className="text-2xl font-bold mb-8">TinopPlatform</h1>
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
                <button className="w-full py-2 bg-red-500 rounded hover:bg-red-600 transition">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
