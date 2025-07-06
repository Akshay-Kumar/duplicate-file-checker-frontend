// MediaBrowser.js
import React, { useEffect, useState } from "react";
import { fetchMediaFiles } from "../api";
import './MediaBrowser.css'; // Optional: style as needed

function formatSize(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}

function MediaBrowser() {
    const [files, setFiles] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchMediaFiles()
            .then(setFiles)
            .catch(console.error);
    }, []);

    const filtered = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="media-browser">
            <div className="topbar">
                <input
                    type="text"
                    placeholder="Search files..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <table className="media-table">
                <thead>
                <tr>
                    <th>Filename</th>
                    <th>Size</th>
                    <th>Type</th>
                    <th>Modified</th>
                </tr>
                </thead>
                <tbody>
                {filtered.map((file, index) => (
                    <tr key={index}>
                        <td>{file.name}</td>
                        <td>{formatSize(file.size)}</td>
                        <td>{file.ext}</td>
                        <td>{new Date(file.modified * 1000).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default MediaBrowser;
