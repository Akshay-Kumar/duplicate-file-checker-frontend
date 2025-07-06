// src/components/VideoPlayer.js
import React from "react";
import "./VideoPlayer.css";

const VideoPlayer = ({ videoPath, onClose }) => {
    if (!videoPath) return null;

    const videoUrl = `/video/?path=${encodeURIComponent(videoPath)}`;

    return (
        <div className="video-modal">
            <div className="video-container">
                <button className="close-button" onClick={onClose}>×</button>
                <video controls autoPlay>
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
};

export default VideoPlayer;
