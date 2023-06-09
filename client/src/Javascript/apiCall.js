import { ToastContainer, toast } from 'react-toastify';

export async function apiCall(method, path, data=false) {
    try {
        const response = await fetch(`http://localhost:8080/ws/${path}`, {
            method: method,
            credentials: "include",
            headers: data ? {
                "Content-Type": "application/json",
            } : {},
            body: data ? JSON.stringify(data) : undefined,
        });

        const json = await response.json();
        
        if (response.ok) {
            return json;
        } else {
            toast.error(json.message, {
                position: toast.POSITION.TOP_RIGHT
            });
            return false;
        }
    } catch (error) {
        toast.error("Error", {
            position: toast.POSITION.TOP_RIGHT
        });
    }
}