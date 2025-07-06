// Topbar.js
import React from "react";
import "./Topbar.css";

const Topbar = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="topbar">
            <input
                type="text"
                placeholder="🔍 Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    );
};

export default Topbar;
