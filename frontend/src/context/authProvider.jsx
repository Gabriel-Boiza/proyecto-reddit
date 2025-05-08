import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./authContext";
import { domain } from "./domain";

const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");

    const login = async (user) => {
        try {
            const data = await axios.post(`${domain}login`, user, { withCredentials: true });
            setIsAuth(true);
            setMessage("Login successful");
            setIsError(false);  
            return true
        } catch (error) {
            setIsAuth(false);
            setMessage(error.response?.data?.message || "Error during login.");
            setIsError(true);  
            return false
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${domain}logout`, {}, { withCredentials: true });
            setIsAuth(false);
            setMessage("Logged out successfully");
            setIsError(false);
        } catch (error) {
            setMessage("Error during logout");
            setIsError(true);
        }
    };

    useEffect(() => {
        axios.get(`${domain}check-auth`, { withCredentials: true })
            .then(() => setIsAuth(true))
            .catch(() => setIsAuth(false))
            .finally(() => setLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{ isAuth, isError, message, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
