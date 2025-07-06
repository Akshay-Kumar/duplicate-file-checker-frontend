import React, { useEffect, useState, useRef } from "react";
import Topbar from "./components/Topbar";
import DuplicateGroup from "./components/DuplicateGroup";
import { scanDirs, getDuplicates, deleteFiles } from "./api";
import "./App.css";

const App = () => {
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [duplicateGroups, setDuplicateGroups] = useState([]);
    const fileInputRef = useRef(null);

    // Trigger scan & fetch duplicates on folder selection
    useEffect(() => {
        async function fetchDuplicates() {
            if (selectedFolder) {
                scanDirs([selectedFolder])
                    .then(() => getDuplicates())
                    .then((res) => {
                        console.log("Duplicates response:", res);
                        setDuplicateGroups(Array.isArray(res.data?.duplicates) ? res.data.duplicates : []);
                    })
                    .catch((err) => {
                        console.error(err);
                        setDuplicateGroups([]); // Clear on error
                    });
            }
        }
        fetchDuplicates();
    }, [selectedFolder]);

    const handleFolderSelect = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const relativePath = files[0].webkitRelativePath;
            const folder = relativePath.split("/")[0];
            setSelectedFolder(folder);
        }
    };

    const handleDelete = (filesToDelete) => {
        deleteFiles(filesToDelete)
            .then(() => {
                const remaining = duplicateGroups
                    .map((group) => ({
                        ...group,
                        files: group.files.filter((f) => !filesToDelete.includes(f.path)),
                    }))
                    .filter((group) => group.files.length > 1);
                setDuplicateGroups(remaining);
            })
            .catch(console.error);
    };

    const filteredGroups = (duplicateGroups || [])
        .map((group) => ({
            ...group,
            files: group.files.filter((file) =>
                file.path.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        }))
        .filter((group) => group.files.length > 0);

    return (
        <div className="app-container">
            <div className="sidebar">
                <button
                    className="browse-button"
                    onClick={() => fileInputRef.current.click()}
                >
                    📁 Browse Folder
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    webkitdirectory="true"
                    directory=""
                    multiple
                    onChange={handleFolderSelect}
                />
                {selectedFolder && (
                    <p className="selected-folder">Selected: {selectedFolder}</p>
                )}
            </div>
            <div className="main-content">
                <Topbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                {filteredGroups.length === 0 ? (
                    <p className="no-duplicates">No duplicate files found.</p>
                ) : (
                    filteredGroups.map((group, i) => (
                        <DuplicateGroup
                            key={i}
                            group={group}
                            groupIndex={i}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default App;
