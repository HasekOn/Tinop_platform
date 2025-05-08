import React from "react";
import {Link} from "react-router-dom";

export const InitialsAvatar = ({name}) => {
    const initials = name
        ?.split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <Link to="/profile">
            <div
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold cursor-pointer">
                {initials || "?"}
            </div>
        </Link>
    );
};
