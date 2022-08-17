import { useState } from "react";
import useStorage from "../hooks/useStorage";

function UploadFiles() {
    const [image, setImage] = useState(null);
    const [upload, progress, url, error, getPreview] = useStorage('images/');

    const handleChange = (e) => {
        setImage(e.target.files[0]);
    }

    const uploadFiles = () => {
        upload(image)
    }

    return (
        <div>
            {image && <img src={getPreview(image)} alt="" />}
            <input
                type="file"
                accept="image/*"
                onChange={handleChange}
            />
            <br />
            {progress}
            {error && "ERROR: " + error}
            <br />
            <button onClick={uploadFiles}>Upload</button>
            {url && <img src={url} alt="" />}
        </div>
    )
}

export default UploadFiles