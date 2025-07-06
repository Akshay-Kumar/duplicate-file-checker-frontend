// api.js
import axios from "axios";
const BASE = process.env.REACT_APP_API_URL;

export const fetchMediaFiles = () =>
    axios.get(`${BASE}/api/media`).then(res => res.data);

export const scanDirs = (dirs) =>
    axios.post(`${BASE}/scan`, dirs);

export const getDuplicates = () =>
    axios.get(`${BASE}/duplicates`);

export const getThumbnail = (path) =>
    `${BASE}/thumbnail/?path=${encodeURIComponent(path)}`;

export const streamVideo = (path) =>
    `${BASE}/video/?path=${encodeURIComponent(path)}`;

export const deleteFiles = (paths) =>
    axios.post(`${BASE}/delete`, paths);

export const exportExcel = () =>
    window.open(`${BASE}/export`, "_blank");
