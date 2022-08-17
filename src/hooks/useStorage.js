import { useState } from "react";
import { storage } from "../utils/firebase";

function useStorage(folder = '') {
    const [progress, setProgress] = useState(0);
    const [url, setUrl] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const upload = (file) => {
        setProgress(0);
        setUrl(null);
        setError(null);
        setLoading(true);
        if (!file) return setError('Choose an image');
        const storageRef = storage.ref(`${folder}${file.name}`);
        const uploadTask = storageRef.put(file)
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(progress);
            },
            (error) => {
                setLoading(false);
                setError(error.message);
            },
            async () => {
                const url = await storageRef.getDownloadURL()
                setUrl(url);
                setLoading(false);
            }
        )
    }

    const getPreview = (image) => {
        return URL.createObjectURL(image)
    }

    return { upload, progress, url, error, getPreview, loading, setLoading };
}

export default useStorage