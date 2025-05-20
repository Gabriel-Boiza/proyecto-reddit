import { useEffect, useState } from "react";
import axios from "axios";
import { AdminContext } from "./adminContext"; // ← CAMBIO AQUÍ
import { domain } from "./domain";

const AdminProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const [adminId, setAdminId] = useState();
    const [adminUsername, setAdminUsername] = useState();
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");

    const login = async (credentials) => {
        try {
            await axios.post(`${domain}admin/login`, credentials, { withCredentials: true });
            setIsAuth(true);
            setMessage("Admin login successful");
            setIsError(false);
            window.location.href = "/admin/dashboard";
            return true;
        } catch (error) {
            setIsAuth(false);
            setMessage(error.response?.data?.message || "Error during admin login.");
            setIsError(true);
            return false;
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${domain}admin/logout`, {}, { withCredentials: true });
            setIsAuth(false);
            setMessage("Admin logged out");
            setIsError(false);
            window.location.reload();
        } catch (error) {
            setMessage("Error during admin logout");
            setIsError(true);
        }
    };

    useEffect(() => {
        console.log("hola")
        axios.get(`${domain}admin/check-auth`, { withCredentials: true })
            .then((response) => {
                setIsAuth(true);
                setAdminId(response.data.admin.id);
                setAdminUsername(response.data.admin.username);
            })
            .catch(() => setIsAuth(false))
            .finally(() => setLoading(false));
    }, []);

    return (
        <AdminContext.Provider value={{
            isAuth,
            isError,
            message,
            loading,
            adminId,
            adminUsername,
            login,
            logout
        }}>
            {children}
        </AdminContext.Provider>
    );
};

export default AdminProvider;
