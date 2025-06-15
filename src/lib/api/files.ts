import { PUBLIC_POCKETBASE_URL } from "$env/static/public";
import { sendFormData } from "./helpers";

async function uploadFile(file: File, onSuccess: () => void, onError: (error: Error) => void) {
    // const formData = new FormData();

    // formData.append("file", file);

    // const response = await fetch(`${PUBLIC_POCKETBASE_URL}/public`, {
    //     method: "POST",
    //     body: formData
    // });

    // if (!response.ok) {
    //     return onError(new Error("Cannot reach server: " + response.statusText));
    // }

    // const data = await response.json()

    // if (data.status !== 200) {
    //     return onError(new Error("Failed to upload file " + data.message))
    // }

    // return onSuccess();
    
    sendFormData("/files?/uploadFile", { file: file }).then((response) => {
        if (response.status !== 200) {
            return onError(new Error("Cannot reach Server: " + response.statusText));
        }

        return onSuccess();

    }).catch((error) => {
        console.error("error uploading file:", error);
        return onError(new Error("Failed to upload file: " + error.message));
    });
}

async function deleteFile(fileId: string, onSuccess: () => void, onError: (error: Error) => void) {
    
    // const formData = new FormData();

    // formData.append("filename", filename);

    // const response = await fetch(`${PUBLIC_POCKETBASE_URL}/public`, {
    //     method: "DELETE",
    //     body: formData
    // });

    // if (!response.ok) {
    //     return onError(new Error(`Cannot reach server: ${response.statusText}`));
    // }

    // const data = await response.json()

    // if (data.status !== 200) {
    //     return onError(new Error("Failed to delete file " + data.message));
    // }

    sendFormData("/files?/deleteFile", { fileId: fileId }).then((response) => {
        if (response.status !== 200) {
            return onError(new Error("Cannot reach Server: " + response.statusText));
        }

        return onSuccess();

    }).catch((error) => {
        console.error("error deleting file:", error);
        return onError(new Error("Failed to delete file: " + error.message));
    });
}

export { uploadFile, deleteFile };