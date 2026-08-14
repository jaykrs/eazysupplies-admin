import axios from "axios";

export const uploadFiles = async ({ files, type = 1 }) => {
        const formData = new FormData();

        files.forEach((item) => {
            formData.append("files", item.file);
        });

        return await axios.post(
            `/api/file/multifile?type=${type}`,
            formData,
            {
                withCredentials: true, // 🔥 THIS is required for cookies
            }
        );
    };