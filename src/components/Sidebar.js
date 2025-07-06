import React from "react";
import "./Sidebar.css";

const Sidebar = ({ folders, onSelectFolder }) => {
    return (
        <div className="sidebar">
            <h3>Folders</h3>
            <ul>
                {folders.map((folder, i) => (
                    <li
                        key={i}
                        title={folder}  // 🧠 Tooltip
                        onClick={() => onSelectFolder(folder)}
                    >
                        {folder.split("/").pop()} {/* 🪄 Show only leaf folder name */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
