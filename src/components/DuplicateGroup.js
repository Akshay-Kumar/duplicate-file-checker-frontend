import React, { useState } from "react";
import { getThumbnail, streamVideo } from "../api";
import VideoPlayer from "./VideoPlayer";
import "../styles.css";
import {
    faTrash,
    faEye,
    faFileVideo,
    faFilter,
    faSortAmountDown,
    faSortAmountUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const getFileMetadata = (file) => {
    const sizeBytes = file.size || 0;
    const extension = file.path?.split(".").pop() || "";
    const created = file.created;
    const modified = file.modified;

    const sizeStr =
        sizeBytes < 1024 * 1024
            ? `${(sizeBytes / 1024).toFixed(2)} KB`
            : `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`;

    return {
        size: sizeStr,
        extension,
        created,
        modified
    };
};

function DuplicateGroup({ group, groupIndex, onDelete }) {
    const [selected, setSelected] = useState([]);
    const [preview, setPreview] = useState(null);
    const [filterExt, setFilterExt] = useState("all");
    const [sortAsc, setSortAsc] = useState(true);

    const toggleSelect = (file) => {
        setSelected((prev) =>
            prev.includes(file.path) ? prev.filter((f) => f !== file.path) : [...prev, file.path]
        );
    };

    const handleDelete = () => {
        if (selected.length > 0) {
            onDelete(selected);
            setSelected([]);
        }
    };

    // Filtering
    const filteredFiles =
        filterExt === "all"
            ? group.files
            : group.files.filter((f) => f.path.toLowerCase().endsWith(`.${filterExt.toLowerCase()}`));

    // Sorting
    const sortedFiles = [...filteredFiles].sort((a, b) =>
        sortAsc
            ? a.path.localeCompare(b.path)
            : b.path.localeCompare(a.path)
    );

    return (
        <div className="duplicate-group">
            <div className="group-header">
                <h2>
                    <FontAwesomeIcon icon={faFileVideo} /> Group #{groupIndex + 1}
                </h2>

                <div className="group-controls">
                    <select
                        value={filterExt}
                        onChange={(e) => setFilterExt(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="mp4">MP4</option>
                        <option value="mkv">MKV</option>
                        <option value="avi">AVI</option>
                    </select>

                    <button
                        onClick={() => setSortAsc((prev) => !prev)}
                        className="sort-btn"
                        title="Toggle Sort"
                    >
                        <FontAwesomeIcon icon={sortAsc ? faSortAmountDown : faSortAmountUp} />
                    </button>
                </div>
            </div>

            <div className="file-grid">
                {sortedFiles.map((file, idx) => {
                    const meta = getFileMetadata(file);
                    return (
                        <div
                            key={idx}
                            className={`file-item ${selected.includes(file.path) ? "selected" : ""}`}
                        >
                            <div className="file-name">
                                {file.path}
                                <div className="file-meta">
                                    <small>{meta.size}</small> |{" "}
                                    <small>{meta.extension.toUpperCase()}</small>
                                </div>
                                <div className="file-meta">
                                    <strong>created at: </strong><small>{meta.created}</small> |{" "}
                                    <strong>modified at: </strong><small>{meta.modified}</small>
                                </div>
                            </div>
                            <div className="file-controls">
                                {/*
                                    <img
                                        src={getThumbnail(file.path)}
                                        alt="thumb"
                                        className="thumbnail"
                                        onClick={() => setPreview(file.path)}
                                        title="Preview"
                                    />
                                */}
                                <input
                                    type="checkbox"
                                    onChange={() => toggleSelect(file)}
                                    checked={selected.includes(file.path)}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {preview && (
                <VideoPlayer
                    file={preview}
                    onClose={() => setPreview(null)}
                    url={streamVideo(preview)}
                />
            )}

            {selected.length > 0 && (
                <button className="delete-btn" onClick={handleDelete}>
                    <FontAwesomeIcon icon={faTrash} /> Delete Selected ({selected.length})
                </button>
            )}
        </div>
    );
}

export default DuplicateGroup;
